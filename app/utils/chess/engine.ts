// Pure chess engine — no Vue, no DOM. Used by the page and by the AI worker.
// Coordinates: row 0 = rank 8 (black's back rank), row 7 = rank 1; col 0 = file a.

export type Color = 'white' | 'black'
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P'
export interface Piece { type: PieceType; color: Color }
export type Board = (Piece | null)[][]
export interface Pos { row: number; col: number }
export interface CastlingRights { whiteK: boolean; whiteQ: boolean; blackK: boolean; blackQ: boolean }
export interface GameState { board: Board; ept: Pos | null; cr: CastlingRights }
export interface MoveResult {
  captured: Piece | null
  enPassant: boolean
  castling: 'K' | 'Q' | null
  promotion: PieceType | null
}
export interface SearchResult { from: Pos; to: Pos; score: number; depth: number; nodes: number }

export const opposite = (c: Color): Color => (c === 'white' ? 'black' : 'white')

export const initialBoard = (): Board => {
  const b: Board = Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null))
  const backRank: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  backRank.forEach((type, col) => {
    b[0]![col] = { type, color: 'black' }
    b[7]![col] = { type, color: 'white' }
  })
  for (let col = 0; col < 8; col++) {
    b[1]![col] = { type: 'P', color: 'black' }
    b[6]![col] = { type: 'P', color: 'white' }
  }
  return b
}

export const initialCastlingRights = (): CastlingRights => ({ whiteK: true, whiteQ: true, blackK: true, blackQ: true })

export const cloneBoard = (b: Board): Board => b.map(row => row.map(cell => (cell ? { ...cell } : null)))

const inBounds = (r: number, c: number) => r >= 0 && r <= 7 && c >= 0 && c <= 7

/**
 * Pseudo-legal moves for the piece on (row, col) — ignores whether the mover's
 * own king is left in check. `forAttack` = we only want squares this piece
 * attacks (used by isSquareAttacked); it skips castling and pawn pushes, which
 * also breaks the isInCheck ↔ getPseudoLegalMoves recursion.
 */
export const getPseudoLegalMoves = (
  b: Board,
  row: number,
  col: number,
  ept: Pos | null,
  cr: CastlingRights,
  forAttack = false,
): Pos[] => {
  const piece = b[row]?.[col]
  if (!piece) return []
  const moves: Pos[] = []
  const { type, color } = piece
  const opp = opposite(color)

  const addIf = (r: number, c: number) => {
    if (!inBounds(r, c)) return
    const target = b[r]?.[c]
    if (target?.color === color) return
    moves.push({ row: r, col: c })
  }

  const slide = (dr: number, dc: number) => {
    let r = row + dr
    let c = col + dc
    while (inBounds(r, c)) {
      const target = b[r]?.[c]
      if (target?.color === color) break
      moves.push({ row: r, col: c })
      if (target?.color === opp) break
      r += dr
      c += dc
    }
  }

  if (type === 'P') {
    const dir = color === 'white' ? -1 : 1
    const startRow = color === 'white' ? 6 : 1
    if (!forAttack) {
      if (inBounds(row + dir, col) && !b[row + dir]?.[col]) {
        moves.push({ row: row + dir, col })
        if (row === startRow && !b[row + 2 * dir]?.[col]) moves.push({ row: row + 2 * dir, col })
      }
    }
    for (const dc of [-1, 1]) {
      const tr = row + dir
      const tc = col + dc
      if (!inBounds(tr, tc)) continue
      if (forAttack) {
        moves.push({ row: tr, col: tc })
        continue
      }
      const target = b[tr]?.[tc]
      if (target?.color === opp) moves.push({ row: tr, col: tc })
      else if (ept && ept.row === tr && ept.col === tc) moves.push({ row: tr, col: tc })
    }
  }

  if (type === 'N') {
    for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]] as const) {
      addIf(row + dr, col + dc)
    }
  }
  if (type === 'B' || type === 'Q') {
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]] as const) slide(dr, dc)
  }
  if (type === 'R' || type === 'Q') {
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) slide(dr, dc)
  }

  if (type === 'K') {
    for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] as const) {
      addIf(row + dr, col + dc)
    }
    if (!forAttack) {
      const kingRow = color === 'white' ? 7 : 0
      const kRight = color === 'white' ? cr.whiteK : cr.blackK
      const qRight = color === 'white' ? cr.whiteQ : cr.blackQ
      // Only evaluate check when a castling right actually exists — this is
      // what prevents the mutual recursion with isSquareAttacked.
      if ((kRight || qRight) && row === kingRow && col === 4 && !isInCheck(b, color)) {
        if (kRight && !b[kingRow]?.[5] && !b[kingRow]?.[6] && b[kingRow]?.[7]?.type === 'R') {
          if (!isSquareAttacked(b, kingRow, 5, opp) && !isSquareAttacked(b, kingRow, 6, opp)) {
            moves.push({ row: kingRow, col: 6 })
          }
        }
        if (qRight && !b[kingRow]?.[3] && !b[kingRow]?.[2] && !b[kingRow]?.[1] && b[kingRow]?.[0]?.type === 'R') {
          if (!isSquareAttacked(b, kingRow, 3, opp) && !isSquareAttacked(b, kingRow, 2, opp)) {
            moves.push({ row: kingRow, col: 2 })
          }
        }
      }
    }
  }
  return moves
}

const NO_RIGHTS: CastlingRights = { whiteK: false, whiteQ: false, blackK: false, blackQ: false }

export const isSquareAttacked = (b: Board, row: number, col: number, byColor: Color): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = b[r]?.[c]
      if (!p || p.color !== byColor) continue
      const attacks = getPseudoLegalMoves(b, r, c, null, NO_RIGHTS, true)
      for (const m of attacks) if (m.row === row && m.col === col) return true
    }
  }
  return false
}

export const findKing = (b: Board, color: Color): Pos | null => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = b[r]?.[c]
      if (p?.type === 'K' && p.color === color) return { row: r, col: c }
    }
  }
  return null
}

export const isInCheck = (b: Board, color: Color): boolean => {
  const k = findKing(b, color)
  return k ? isSquareAttacked(b, k.row, k.col, opposite(color)) : false
}

/** Mutates `b`. Handles en passant, castling rook hop and auto-queen promotion. */
export const applyMove = (b: Board, from: Pos, to: Pos, ept: Pos | null): MoveResult => {
  const piece = b[from.row]?.[from.col]
  if (!piece) return { captured: null, enPassant: false, castling: null, promotion: null }

  let captured = b[to.row]?.[to.col] ?? null
  let enPassant = false
  let castling: 'K' | 'Q' | null = null
  let promotion: PieceType | null = null

  b[to.row]![to.col] = piece
  b[from.row]![from.col] = null

  if (piece.type === 'P' && ept && to.row === ept.row && to.col === ept.col && !captured) {
    const captureRow = piece.color === 'white' ? to.row + 1 : to.row - 1
    captured = b[captureRow]?.[to.col] ?? null
    b[captureRow]![to.col] = null
    enPassant = true
  }

  if (piece.type === 'K' && Math.abs(to.col - from.col) === 2) {
    const kr = from.row
    if (to.col === 6) { b[kr]![5] = b[kr]![7]!; b[kr]![7] = null; castling = 'K' }
    if (to.col === 2) { b[kr]![3] = b[kr]![0]!; b[kr]![0] = null; castling = 'Q' }
  }

  if (piece.type === 'P' && (to.row === 0 || to.row === 7)) {
    b[to.row]![to.col] = { type: 'Q', color: piece.color }
    promotion = 'Q'
  }

  return { captured, enPassant, castling, promotion }
}

export const nextEnPassant = (piece: Piece, from: Pos, to: Pos): Pos | null =>
  piece.type === 'P' && Math.abs(to.row - from.row) === 2
    ? { row: (from.row + to.row) / 2, col: to.col }
    : null

export const nextCastlingRights = (cr: CastlingRights, piece: Piece, from: Pos, to: Pos): CastlingRights => {
  const n = { ...cr }
  if (piece.type === 'K') {
    if (piece.color === 'white') { n.whiteK = false; n.whiteQ = false }
    else { n.blackK = false; n.blackQ = false }
  }
  // A rook leaving its corner, or anything landing on a corner (capturing the rook), kills that right.
  const touches = (r: number, c: number) => (from.row === r && from.col === c) || (to.row === r && to.col === c)
  if (touches(7, 7)) n.whiteK = false
  if (touches(7, 0)) n.whiteQ = false
  if (touches(0, 7)) n.blackK = false
  if (touches(0, 0)) n.blackQ = false
  return n
}

export const getLegalMoves = (b: Board, row: number, col: number, ept: Pos | null, cr: CastlingRights): Pos[] => {
  const piece = b[row]?.[col]
  if (!piece) return []
  return getPseudoLegalMoves(b, row, col, ept, cr).filter(to => {
    const nb = cloneBoard(b)
    applyMove(nb, { row, col }, to, ept)
    return !isInCheck(nb, piece.color)
  })
}

export interface FullMove { from: Pos; to: Pos }

export const getAllLegalMoves = (b: Board, color: Color, ept: Pos | null, cr: CastlingRights): FullMove[] => {
  const out: FullMove[] = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (b[r]?.[c]?.color !== color) continue
      for (const to of getLegalMoves(b, r, c, ept, cr)) out.push({ from: { row: r, col: c }, to })
    }
  }
  return out
}

// ── Evaluation ───────────────────────────────────────────────────────────────
export const PIECE_VALUES: Record<PieceType, number> = { K: 20000, Q: 900, R: 500, B: 330, N: 320, P: 100 }

const PAWN = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
]
const KNIGHT = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
]
const BISHOP = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
]
const ROOK = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
]
const QUEEN = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
]
const KING_MID = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
]
const TABLES: Record<PieceType, number[][]> = { P: PAWN, N: KNIGHT, B: BISHOP, R: ROOK, Q: QUEEN, K: KING_MID }

// Tables are written from white's point of view (row 7 = white's home rank).
const tableValue = (p: Piece, row: number, col: number) =>
  TABLES[p.type][p.color === 'white' ? row : 7 - row]?.[col] ?? 0

/** Positive = good for black (the AI). */
export const evaluate = (b: Board): number => {
  let score = 0
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = b[r]?.[c]
      if (!p) continue
      const v = PIECE_VALUES[p.type] + tableValue(p, r, c)
      score += p.color === 'black' ? v : -v
    }
  }
  return score
}

// ── Search: alpha-beta with capture-first ordering and iterative deepening ───
const MATE = 100000

const orderMoves = (b: Board, moves: FullMove[]): FullMove[] =>
  moves
    .map(m => {
      const victim = b[m.to.row]?.[m.to.col]
      const attacker = b[m.from.row]?.[m.from.col]
      // MVV-LVA: most valuable victim first, least valuable attacker as tiebreak.
      const key = victim ? PIECE_VALUES[victim.type] * 10 - (attacker ? PIECE_VALUES[attacker.type] : 0) / 100 : 0
      return { m, key }
    })
    .sort((a, b2) => b2.key - a.key)
    .map(x => x.m)

interface SearchCtx { nodes: number; deadline: number; aborted: boolean }

const alphaBeta = (
  st: GameState,
  depth: number,
  alpha: number,
  beta: number,
  color: Color, // side to move
  ctx: SearchCtx,
): number => {
  ctx.nodes++
  if ((ctx.nodes & 1023) === 0 && Date.now() > ctx.deadline) ctx.aborted = true
  if (ctx.aborted) return 0
  if (depth === 0) return evaluate(st.board)

  const moves = getAllLegalMoves(st.board, color, st.ept, st.cr)
  if (moves.length === 0) {
    if (isInCheck(st.board, color)) return color === 'black' ? -MATE - depth : MATE + depth
    return 0
  }

  const isMax = color === 'black'
  let best = isMax ? -Infinity : Infinity
  for (const mv of orderMoves(st.board, moves)) {
    const nb = cloneBoard(st.board)
    const piece = nb[mv.from.row]![mv.from.col]!
    applyMove(nb, mv.from, mv.to, st.ept)
    const child: GameState = {
      board: nb,
      ept: nextEnPassant(piece, mv.from, mv.to),
      cr: nextCastlingRights(st.cr, piece, mv.from, mv.to),
    }
    const score = alphaBeta(child, depth - 1, alpha, beta, opposite(color), ctx)
    if (ctx.aborted) return 0
    if (isMax) {
      if (score > best) best = score
      if (best > alpha) alpha = best
    } else {
      if (score < best) best = score
      if (best < beta) beta = best
    }
    if (beta <= alpha) break
  }
  return best
}

export interface SearchOptions { maxDepth?: number; timeMs?: number }

/**
 * Best move for BLACK. Iterative deepening: searches depth 1, 2, 3… until
 * `timeMs` runs out and returns the deepest fully-completed result.
 */
export const findBestMove = (state: GameState, opts: SearchOptions = {}): SearchResult | null => {
  const maxDepth = opts.maxDepth ?? 4
  const timeMs = opts.timeMs ?? 1200
  const rootMoves = getAllLegalMoves(state.board, 'black', state.ept, state.cr)
  if (rootMoves.length === 0) return null

  const deadline = Date.now() + timeMs
  let best: SearchResult = { ...rootMoves[0]!, score: -Infinity, depth: 0, nodes: 0 }
  let ordered = orderMoves(state.board, rootMoves)

  for (let depth = 1; depth <= maxDepth; depth++) {
    const ctx: SearchCtx = { nodes: 0, deadline, aborted: false }
    let iterBest: SearchResult | null = null
    let alpha = -Infinity
    const scored: { mv: FullMove; score: number }[] = []

    for (const mv of ordered) {
      const nb = cloneBoard(state.board)
      const piece = nb[mv.from.row]![mv.from.col]!
      applyMove(nb, mv.from, mv.to, state.ept)
      const child: GameState = {
        board: nb,
        ept: nextEnPassant(piece, mv.from, mv.to),
        cr: nextCastlingRights(state.cr, piece, mv.from, mv.to),
      }
      const score = alphaBeta(child, depth - 1, alpha, Infinity, 'white', ctx)
      if (ctx.aborted) break
      scored.push({ mv, score })
      if (!iterBest || score > iterBest.score) {
        iterBest = { ...mv, score, depth, nodes: ctx.nodes }
        if (score > alpha) alpha = score
      }
    }

    if (ctx.aborted || !iterBest) break
    best = { ...iterBest, nodes: ctx.nodes }
    // Re-order root moves by this iteration's scores for the next, deeper pass.
    ordered = scored.sort((a, b2) => b2.score - a.score).map(x => x.mv)
    if (Math.abs(best.score) >= MATE) break // mate found — no need to go deeper
  }
  return best
}

// ── Notation helper ──────────────────────────────────────────────────────────
export const toSquareName = (p: Pos) => `${'abcdefgh'[p.col]}${8 - p.row}`

export const moveNotation = (piece: Piece, from: Pos, to: Pos, res: MoveResult, givesCheck: boolean, isMate: boolean): string => {
  if (res.castling) return res.castling === 'K' ? 'O-O' : 'O-O-O'
  const cap = res.captured ? 'x' : ''
  const head = piece.type === 'P' ? (cap ? 'abcdefgh'[from.col] : '') : piece.type
  const promo = res.promotion ? `=${res.promotion}` : ''
  const suffix = isMate ? '#' : givesCheck ? '+' : ''
  return `${head}${cap}${toSquareName(to)}${promo}${suffix}`
}
