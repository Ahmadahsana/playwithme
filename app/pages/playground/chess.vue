<template>
  <div class="relative min-h-screen bg-surface-950 text-white font-inter overflow-x-hidden">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-20 pointer-events-none" />

    <!-- Ambient Glow Orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/8 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-[100px] pointer-events-none" />

    <!-- Back to Hub -->
    <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-40 flex items-center gap-3">
      <NuxtLink
        to="/playground"
        class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
        aria-label="Back to Playground"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>
      <div class="flex flex-col">
        <h1 class="font-outfit font-bold text-lg leading-none">♟️ Chess</h1>
        <span class="text-xs text-surface-400">Vs. AI · Minimax + Alpha-Beta</span>
      </div>
    </div>

    <!-- Status badge top right -->
    <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-40">
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-all duration-300"
        :class="statusClass"
      >
        <span
          v-if="aiThinking"
          class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"
          aria-hidden="true"
        />
        <span>{{ statusText }}</span>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="relative z-10 flex flex-col xl:flex-row items-center xl:items-start justify-center min-h-screen gap-8 px-4 pt-24 pb-10 xl:pt-28 xl:gap-12 max-w-6xl mx-auto">

      <!-- Chess Board -->
      <div class="flex flex-col items-center gap-2 shrink-0">
        <!-- File labels (a–h) -->
        <div class="flex" :style="{ paddingLeft: '22px' }">
          <div
            v-for="file in files"
            :key="file"
            class="flex items-center justify-center text-[10px] sm:text-[11px] text-surface-500 font-mono font-semibold"
            :style="{ width: squareSize + 'px', height: '18px' }"
          >{{ file }}</div>
        </div>

        <div class="flex">
          <!-- Rank labels (8–1) -->
          <div class="flex flex-col">
            <div
              v-for="rank in ranks"
              :key="rank"
              class="flex items-center justify-center text-[10px] sm:text-[11px] text-surface-500 font-mono font-semibold"
              :style="{ width: '22px', height: squareSize + 'px' }"
            >{{ rank }}</div>
          </div>

          <!-- Board -->
          <div
            class="board relative rounded-lg overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/60"
            :class="{ 'board--busy': aiThinking || gameOver }"
            :style="{ width: boardPx + 'px', height: boardPx + 'px' }"
          >
            <button
              v-for="sq in boardSquares"
              :key="sq.row * 8 + sq.col"
              type="button"
              class="sq absolute"
              :class="squareClasses(sq)"
              :style="squareStyle(sq)"
              :aria-label="squareLabel(sq)"
              :tabindex="turn === 'white' && !gameOver ? 0 : -1"
              @click="onSquareClick(sq)"
            >
              <!-- Piece -->
              <span
                v-if="sq.piece"
                class="piece absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                :class="[
                  sq.piece.color === 'white' ? 'piece--white' : 'piece--black',
                  isSelectedSq(sq) ? 'piece--lifted' : '',
                  inCheckSq(sq) ? 'piece--check' : '',
                ]"
                :style="{ fontSize: Math.round(squareSize * 0.68) + 'px' }"
              >{{ glyph(sq.piece) }}</span>

              <!-- Legal move markers -->
              <span
                v-if="isLegalMove(sq)"
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span
                  v-if="sq.piece"
                  class="w-full h-full rounded-[3px] border-[3px] border-brand-400/80"
                />
                <span
                  v-else
                  class="rounded-full bg-brand-400/70"
                  :style="{ width: squareSize * 0.28 + 'px', height: squareSize * 0.28 + 'px' }"
                />
              </span>
            </button>
          </div>
        </div>

        <p class="text-[11px] text-surface-500 mt-1">
          Anda bermain <span class="text-white font-semibold">Putih</span>. Klik buah, lalu klik kotak tujuan.
        </p>
      </div>

      <!-- Side Panel -->
      <div class="flex flex-col gap-4 w-full max-w-sm xl:w-72 shrink-0">
        <!-- Turn -->
        <div class="card-glass p-4 space-y-3">
          <h2 class="font-outfit font-bold text-[11px] text-surface-400 uppercase tracking-wider">Giliran</h2>
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center text-2xl border transition-all duration-300 piece"
              :class="turn === 'white' ? 'border-white/40 bg-white/10 piece--white' : 'border-brand-500/40 bg-brand-500/10 piece--black'"
            >♚</div>
            <div class="flex flex-col leading-tight">
              <span class="text-sm font-semibold text-white">{{ turn === 'white' ? 'Anda (Putih)' : 'AI (Hitam)' }}</span>
              <span class="text-[11px] text-surface-400">
                {{ gameOver ? 'Permainan selesai' : turn === 'white' ? 'Pilih buah dan klik tujuan' : 'AI sedang berpikir…' }}
              </span>
            </div>
          </div>
          <div v-if="lastSearch" class="text-[10px] font-mono text-surface-500 border-t border-white/5 pt-2 flex justify-between">
            <span>depth {{ lastSearch.depth }}</span>
            <span>{{ lastSearch.nodes.toLocaleString('id-ID') }} node</span>
            <span>{{ lastSearch.ms }} ms</span>
          </div>
        </div>

        <!-- Captured pieces -->
        <div class="card-glass p-4 space-y-3">
          <h2 class="font-outfit font-bold text-[11px] text-surface-400 uppercase tracking-wider">Buah Ditangkap</h2>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-surface-500 w-12 shrink-0">Anda</span>
              <div class="flex flex-wrap gap-0.5 min-h-[24px] items-center">
                <span v-for="(p, i) in capturedByWhite" :key="'w' + i" class="piece piece--black text-lg leading-none">{{ glyph(p) }}</span>
                <span v-if="capturedByWhite.length === 0" class="text-xs text-surface-600">–</span>
              </div>
              <span v-if="materialDiff > 0" class="ml-auto text-[11px] font-mono text-green-400">+{{ materialDiff }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-surface-500 w-12 shrink-0">AI</span>
              <div class="flex flex-wrap gap-0.5 min-h-[24px] items-center">
                <span v-for="(p, i) in capturedByBlack" :key="'b' + i" class="piece piece--white text-lg leading-none">{{ glyph(p) }}</span>
                <span v-if="capturedByBlack.length === 0" class="text-xs text-surface-600">–</span>
              </div>
              <span v-if="materialDiff < 0" class="ml-auto text-[11px] font-mono text-red-400">{{ materialDiff }}</span>
            </div>
          </div>
        </div>

        <!-- Move History -->
        <div class="card-glass p-4 space-y-3">
          <h2 class="font-outfit font-bold text-[11px] text-surface-400 uppercase tracking-wider">Riwayat Langkah</h2>
          <div ref="moveHistoryEl" class="overflow-y-auto max-h-44 pr-1 scrollbar-thin">
            <div v-if="history.length === 0" class="text-xs text-surface-600">Belum ada langkah.</div>
            <div
              v-for="(pair, i) in movePairs"
              :key="i"
              class="grid grid-cols-[2rem_1fr_1fr] items-center text-xs py-0.5 font-mono"
            >
              <span class="text-surface-500">{{ i + 1 }}.</span>
              <span class="text-white/90">{{ pair.white }}</span>
              <span class="text-brand-300">{{ pair.black ?? '' }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <PressableBtn
            @click="undoMove"
            :disabled="!canUndo"
            class="btn-ghost flex-1 justify-center text-sm px-3! py-2.5! font-semibold flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>↩</span><span>Undo</span>
          </PressableBtn>
          <PressableBtn
            @click="resetGame"
            class="btn-primary flex-1 justify-center text-sm px-3! py-2.5! font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>↻</span><span>Mulai Ulang</span>
          </PressableBtn>
        </div>
      </div>
    </div>

    <!-- Game Over Overlay -->
    <Transition name="fade">
      <div
        v-if="gameOver"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <div class="card-glass max-w-sm w-full mx-4 p-8 text-center space-y-6">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto border"
            :class="gameOverWinner === 'white' ? 'bg-amber-500/10 border-amber-500/30' : gameOverWinner === 'black' ? 'bg-brand-500/10 border-brand-500/30' : 'bg-surface-700/30 border-white/10'"
          >
            {{ gameOverWinner === 'white' ? '👑' : gameOverWinner === 'black' ? '🤖' : '🤝' }}
          </div>
          <div class="space-y-2">
            <h2 class="font-outfit font-black text-3xl text-white">
              {{ gameOverWinner === 'white' ? 'Anda Menang!' : gameOverWinner === 'black' ? 'AI Menang!' : 'Seri!' }}
            </h2>
            <p class="text-sm text-surface-400">{{ gameOverReason }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <PressableBtn @click="resetGame" class="btn-primary w-full justify-center text-sm py-2.5 font-bold">
              Main Lagi
            </PressableBtn>
            <NuxtLink to="/playground" class="btn-ghost w-full justify-center text-sm py-2.5 font-semibold text-center">
              Kembali ke Hub
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useHaptics } from '~/composables/useHaptics'
import {
  type Board, type Color, type Piece, type Pos, type CastlingRights, type SearchResult,
  initialBoard, initialCastlingRights, cloneBoard, opposite,
  getLegalMoves, getAllLegalMoves, isInCheck, findKing,
  applyMove, nextEnPassant, nextCastlingRights, moveNotation, findBestMove,
  PIECE_VALUES,
} from '~/utils/chess/engine'

useSeoMeta({
  title: 'Chess vs AI — PlayWithMe',
  description: 'Mainkan catur melawan AI di dalam browser. Minimax + alpha-beta di Web Worker, highlight langkah legal, undo, notasi, dan deteksi skak mat.',
})

const haptics = useHaptics()

// ── Constants ────────────────────────────────────────────────────────────────
// Both sides use the solid glyphs and are coloured with CSS — the hollow
// "white" glyphs (♙♘…) render too thin on a dark board.
const GLYPH: Record<Piece['type'], string> = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' }
const glyph = (p: Piece) => GLYPH[p.type]
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

// ── Board sizing ─────────────────────────────────────────────────────────────
const squareSize = ref(56)
const boardPx = computed(() => squareSize.value * 8)

const updateBoardSize = () => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const side = Math.min(vw < 1280 ? vw - 56 : Math.min(vw * 0.5, 600), vh - 200, 600)
  squareSize.value = Math.max(32, Math.floor(side / 8))
}

// ── Game state ───────────────────────────────────────────────────────────────
interface Square { row: number; col: number; piece: Piece | null }
interface HistoryEntry {
  notation: string
  color: Color
  // Snapshot of everything BEFORE the move, so undo is a plain restore.
  prev: { board: Board; ept: Pos | null; cr: CastlingRights; capW: number; capB: number; lastMove: LastMove | null }
}
type LastMove = { from: Pos; to: Pos }

const board = ref<Board>(initialBoard())
const turn = ref<Color>('white')
const enPassantTarget = ref<Pos | null>(null)
const castlingRights = ref<CastlingRights>(initialCastlingRights())
const selectedSq = ref<Pos | null>(null)
const legalMovesForSelected = ref<Pos[]>([])
const lastMove = ref<LastMove | null>(null)
const capturedByWhite = ref<Piece[]>([])
const capturedByBlack = ref<Piece[]>([])
const history = ref<HistoryEntry[]>([])
const moveHistoryEl = ref<HTMLElement | null>(null)
const gameOver = ref(false)
const gameOverWinner = ref<'white' | 'black' | 'draw' | null>(null)
const gameOverReason = ref('')
const aiThinking = ref(false)
const lastSearch = ref<{ depth: number; nodes: number; ms: number } | null>(null)

const boardSquares = computed<Square[]>(() => {
  const out: Square[] = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) out.push({ row, col, piece: board.value[row]?.[col] ?? null })
  }
  return out
})

const whiteInCheck = computed(() => isInCheck(board.value, 'white'))
const blackInCheck = computed(() => isInCheck(board.value, 'black'))
const checkedKing = computed<Pos | null>(() => {
  if (turn.value === 'white' && whiteInCheck.value) return findKing(board.value, 'white')
  if (turn.value === 'black' && blackInCheck.value) return findKing(board.value, 'black')
  return null
})

const materialDiff = computed(() => {
  const sum = (ps: Piece[]) => ps.reduce((s, p) => s + PIECE_VALUES[p.type], 0)
  return Math.round((sum(capturedByWhite.value) - sum(capturedByBlack.value)) / 100)
})

const movePairs = computed(() => {
  const pairs: { white: string; black?: string }[] = []
  for (let i = 0; i < history.value.length; i += 2) {
    pairs.push({ white: history.value[i]!.notation, black: history.value[i + 1]?.notation })
  }
  return pairs
})

const canUndo = computed(() => history.value.length > 0 && !aiThinking.value)

// ── Visual helpers ───────────────────────────────────────────────────────────
const squareStyle = (sq: Square) => ({
  left: sq.col * squareSize.value + 'px',
  top: sq.row * squareSize.value + 'px',
  width: squareSize.value + 'px',
  height: squareSize.value + 'px',
})
const isLightSquare = (row: number, col: number) => (row + col) % 2 === 0
const isSelectedSq = (sq: Square) => selectedSq.value?.row === sq.row && selectedSq.value?.col === sq.col
const isLastMoveSq = (sq: Square) => {
  const lm = lastMove.value
  if (!lm) return false
  return (lm.from.row === sq.row && lm.from.col === sq.col) || (lm.to.row === sq.row && lm.to.col === sq.col)
}
const isLegalMove = (sq: Square) => legalMovesForSelected.value.some(m => m.row === sq.row && m.col === sq.col)
const inCheckSq = (sq: Square) => checkedKing.value?.row === sq.row && checkedKing.value?.col === sq.col
const squareClasses = (sq: Square) => [
  isLightSquare(sq.row, sq.col) ? 'sq--light' : 'sq--dark',
  isSelectedSq(sq) ? 'sq--selected' : '',
  isLastMoveSq(sq) && !isSelectedSq(sq) ? 'sq--last' : '',
  inCheckSq(sq) ? 'sq--check' : '',
  turn.value === 'white' && !gameOver.value && !aiThinking.value && (sq.piece?.color === 'white' || isLegalMove(sq)) ? 'sq--clickable' : '',
]
const squareLabel = (sq: Square) => {
  const name = `${files[sq.col]}${ranks[sq.row]}`
  return sq.piece ? `${name}: ${sq.piece.color === 'white' ? 'putih' : 'hitam'} ${sq.piece.type}` : name
}

// ── Status ───────────────────────────────────────────────────────────────────
const statusText = computed(() => {
  if (gameOver.value) return gameOverWinner.value === 'white' ? '🏆 Anda Menang' : gameOverWinner.value === 'black' ? '🤖 AI Menang' : '🤝 Seri'
  if (turn.value === 'white' && whiteInCheck.value) return '⚠️ Anda dalam skak!'
  if (turn.value === 'black' && blackInCheck.value) return '⚠️ AI dalam skak!'
  if (aiThinking.value) return 'AI berpikir…'
  return turn.value === 'white' ? 'Giliran Anda' : 'Giliran AI'
})
const statusClass = computed(() => {
  if (gameOver.value) return 'bg-amber-500/15 border-amber-500/40 text-amber-300'
  if ((turn.value === 'white' && whiteInCheck.value) || (turn.value === 'black' && blackInCheck.value)) return 'bg-red-500/15 border-red-500/40 text-red-300'
  if (turn.value === 'black') return 'bg-brand-500/15 border-brand-500/40 text-brand-300'
  return 'bg-white/8 border-white/15 text-surface-200'
})

// ── AI worker ────────────────────────────────────────────────────────────────
let worker: Worker | null = null
let aiRequestId = 0
let aiFallbackTimer: ReturnType<typeof setTimeout> | null = null

const AI_OPTIONS = { maxDepth: 4, timeMs: 1200 }

const startWorker = () => {
  try {
    worker = new Worker(new URL('../../utils/chess/ai.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e: MessageEvent<{ id: number; result: SearchResult | null }>) => {
      if (e.data.id !== aiRequestId) return // stale reply after undo/reset
      finishAiMove(e.data.result, Date.now() - aiStartedAt)
    }
    worker.onerror = () => {
      // Worker broke — fall back to the main thread from now on.
      worker?.terminate()
      worker = null
      if (aiThinking.value) runAiOnMainThread()
    }
  } catch {
    worker = null
  }
}

let aiStartedAt = 0

/**
 * Plain-data copy of the position. Values read from refs are reactive Proxies,
 * which structured-clone (postMessage) refuses — so rebuild everything by hand.
 */
const plainState = () => {
  const ept = enPassantTarget.value
  const cr = castlingRights.value
  return {
    board: cloneBoard(board.value),
    ept: ept ? { row: ept.row, col: ept.col } : null,
    cr: { whiteK: cr.whiteK, whiteQ: cr.whiteQ, blackK: cr.blackK, blackQ: cr.blackQ },
  }
}

const requestAiMove = () => {
  aiThinking.value = true
  aiRequestId++
  aiStartedAt = Date.now()
  if (worker) {
    try {
      worker.postMessage({ id: aiRequestId, state: plainState(), options: AI_OPTIONS })
      return
    } catch {
      // Cloning failed for some reason — degrade to the main thread.
      worker.terminate()
      worker = null
    }
  }
  runAiOnMainThread()
}

const runAiOnMainThread = () => {
  const id = aiRequestId
  // Let the "AI berpikir" state paint before we block.
  aiFallbackTimer = setTimeout(() => {
    if (id !== aiRequestId) return
    const result = findBestMove(plainState(), AI_OPTIONS)
    finishAiMove(result, Date.now() - aiStartedAt)
  }, 60)
}

const cancelAi = () => {
  aiRequestId++ // any in-flight reply becomes stale
  if (aiFallbackTimer) { clearTimeout(aiFallbackTimer); aiFallbackTimer = null }
  aiThinking.value = false
}

const finishAiMove = (result: SearchResult | null, ms: number) => {
  aiThinking.value = false
  if (!result || gameOver.value || turn.value !== 'black') return
  lastSearch.value = { depth: result.depth, nodes: result.nodes, ms }
  executeMove('black', result.from, result.to)
}

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  updateBoardSize()
  window.addEventListener('resize', updateBoardSize)
  startWorker()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateBoardSize)
  cancelAi()
  worker?.terminate()
  worker = null
})

// ── Actions ──────────────────────────────────────────────────────────────────
const resetGame = () => {
  cancelAi()
  haptics.toggle()
  board.value = initialBoard()
  turn.value = 'white'
  enPassantTarget.value = null
  castlingRights.value = initialCastlingRights()
  selectedSq.value = null
  legalMovesForSelected.value = []
  lastMove.value = null
  capturedByWhite.value = []
  capturedByBlack.value = []
  history.value = []
  gameOver.value = false
  gameOverWinner.value = null
  gameOverReason.value = ''
  lastSearch.value = null
}

const onSquareClick = (sq: Square) => {
  if (turn.value !== 'white' || gameOver.value || aiThinking.value) return
  const { row, col } = sq

  if (selectedSq.value && isLegalMove(sq)) {
    executeMove('white', selectedSq.value, { row, col })
    return
  }
  if (sq.piece?.color === 'white') {
    if (isSelectedSq(sq)) {
      selectedSq.value = null
      legalMovesForSelected.value = []
      return
    }
    haptics.toggle()
    selectedSq.value = { row, col }
    legalMovesForSelected.value = getLegalMoves(board.value, row, col, enPassantTarget.value, castlingRights.value)
  } else {
    selectedSq.value = null
    legalMovesForSelected.value = []
  }
}

const executeMove = (color: Color, from: Pos, to: Pos) => {
  const piece = board.value[from.row]?.[from.col]
  if (!piece || piece.color !== color) return

  const prev: HistoryEntry['prev'] = {
    board: cloneBoard(board.value),
    ept: enPassantTarget.value,
    cr: { ...castlingRights.value },
    capW: capturedByWhite.value.length,
    capB: capturedByBlack.value.length,
    lastMove: lastMove.value,
  }

  const nb = cloneBoard(board.value)
  const res = applyMove(nb, from, to, enPassantTarget.value)
  board.value = nb
  enPassantTarget.value = nextEnPassant(piece, from, to)
  castlingRights.value = nextCastlingRights(castlingRights.value, piece, from, to)

  if (res.captured) {
    if (color === 'white') capturedByWhite.value.push(res.captured)
    else capturedByBlack.value.push(res.captured)
    haptics.success()
  }

  const next = opposite(color)
  const replies = getAllLegalMoves(board.value, next, enPassantTarget.value, castlingRights.value)
  const givesCheck = isInCheck(board.value, next)
  const isMate = givesCheck && replies.length === 0

  history.value.push({ notation: moveNotation(piece, from, to, res, givesCheck, isMate), color, prev })
  lastMove.value = { from, to }
  selectedSq.value = null
  legalMovesForSelected.value = []
  turn.value = next

  nextTick(() => {
    if (moveHistoryEl.value) moveHistoryEl.value.scrollTop = moveHistoryEl.value.scrollHeight
  })

  if (replies.length === 0) {
    gameOver.value = true
    if (givesCheck) {
      gameOverWinner.value = color
      gameOverReason.value = `Skak mat — ${color === 'white' ? 'Putih' : 'Hitam'} menang.`
      haptics.success()
    } else {
      gameOverWinner.value = 'draw'
      gameOverReason.value = 'Stalemate — tidak ada langkah legal tersisa.'
      haptics.warning()
    }
    return
  }

  if (next === 'black') requestAiMove()
}

/** Undo back to the player's previous turn (removes the AI reply too). */
const undoMove = () => {
  if (!canUndo.value) return
  cancelAi()
  haptics.toggle()

  // Pop until it's white's turn again: 1 entry if AI hadn't replied, else 2.
  let entry: HistoryEntry | undefined
  do {
    entry = history.value.pop()
    if (!entry) break
  } while (entry.color !== 'white' && history.value.length > 0)
  if (!entry) return

  board.value = entry.prev.board
  enPassantTarget.value = entry.prev.ept
  castlingRights.value = entry.prev.cr
  capturedByWhite.value = capturedByWhite.value.slice(0, entry.prev.capW)
  capturedByBlack.value = capturedByBlack.value.slice(0, entry.prev.capB)
  lastMove.value = entry.prev.lastMove
  turn.value = 'white'
  selectedSq.value = null
  legalMovesForSelected.value = []
  gameOver.value = false
  gameOverWinner.value = null
  gameOverReason.value = ''
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Board ─────────────────────────────────────────────────────────────── */
.board { background: oklch(18% 0.03 265); }
.board--busy .sq { cursor: default; }

.sq {
  border: 0;
  padding: 0;
  outline: none;
  transition: background-color 0.12s ease, box-shadow 0.12s ease;
}
.sq--light { background: oklch(38% 0.035 265); }
.sq--dark  { background: oklch(24% 0.04 265); }
.sq--clickable { cursor: pointer; }
.sq--clickable:hover { box-shadow: inset 0 0 0 999px oklch(100% 0 0 / 0.06); }
.sq:focus-visible { box-shadow: inset 0 0 0 3px var(--color-brand-400); z-index: 2; }

.sq--last { box-shadow: inset 0 0 0 999px oklch(78% 0.16 80 / 0.28); }
.sq--selected { box-shadow: inset 0 0 0 999px oklch(62% 0.2 265 / 0.55); }
.sq--check {
  box-shadow: inset 0 0 0 999px oklch(60% 0.22 25 / 0.45);
  animation: checkPulse 1s ease-in-out infinite;
}
@keyframes checkPulse {
  0%, 100% { box-shadow: inset 0 0 0 999px oklch(60% 0.22 25 / 0.35); }
  50%      { box-shadow: inset 0 0 0 999px oklch(60% 0.22 25 / 0.6); }
}

/* ── Pieces ────────────────────────────────────────────────────────────── */
.piece {
  font-family: "Noto Sans Symbols 2", "Segoe UI Symbol", "DejaVu Sans", "Apple Symbols", "Symbola", sans-serif;
  line-height: 1;
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease;
}
.piece--white {
  color: #f6f5ff;
  filter: drop-shadow(0 1px 0 oklch(20% 0.02 265)) drop-shadow(0 2px 6px oklch(0% 0 0 / 0.7));
}
.piece--black {
  color: oklch(74% 0.17 275);
  filter: drop-shadow(0 1px 0 oklch(14% 0.03 265)) drop-shadow(0 0 8px oklch(62% 0.2 265 / 0.55));
}
.piece--lifted { transform: translateY(-6%) scale(1.12); }
.piece--check  { filter: drop-shadow(0 0 10px oklch(65% 0.24 25)); }

@media (prefers-reduced-motion: reduce) {
  .sq, .piece { transition: none; }
  .sq--check { animation: none; }
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
}
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 4px; }
</style>
