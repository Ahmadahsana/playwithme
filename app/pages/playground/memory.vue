<template>
  <div class="relative w-screen h-screen overflow-hidden bg-surface-950 text-white font-inter flex flex-col items-center justify-center">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-30 pointer-events-none" />

    <!-- Back to Hub button -->
    <div class="absolute top-6 left-6 z-40 flex items-center gap-4">
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
        <h1 class="font-outfit font-bold text-lg leading-none">3D Card Memory</h1>
        <span class="text-xs text-surface-400">CSS 3D Flip Game</span>
      </div>
    </div>

    <!-- Stats & Live stats -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none text-xs font-mono">
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">Best Time:</span>
        <span class="font-bold text-brand-400">{{ formatTime(store.getHighScore('memory_time') || 999) }}</span>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">Timer:</span>
        <span class="font-bold text-emerald-400">{{ formatTime(timerSeconds) }}</span>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">Moves:</span>
        <span class="font-bold text-amber-400">{{ moves }}</span>
      </div>
    </div>

    <!-- Win Screen Overlay -->
    <Transition name="fade">
      <div 
        v-if="isGameWon" 
        class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        <div class="card-glass max-w-sm p-8 text-center space-y-6">
          <div class="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl mx-auto animate-bounce">
            🎉
          </div>
          <div class="space-y-2">
            <h2 class="font-outfit font-black text-3xl text-white">CONGRATULATIONS!</h2>
            <p class="text-xs text-surface-400">All matching card patterns solved.</p>
          </div>
          <div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-left font-mono text-sm">
            <div>
              <span class="text-surface-500 block text-xs">TIME SPENT</span>
              <span class="font-bold text-emerald-400 text-lg">{{ formatTime(timerSeconds) }}</span>
            </div>
            <div>
              <span class="text-surface-500 block text-xs">TOTAL MOVES</span>
              <span class="font-bold text-brand-400 text-lg">{{ moves }}</span>
            </div>
          </div>
          <PressableBtn @click="restartGame" class="btn-primary w-full justify-center text-xs py-2.5 font-bold">
            🔄 Main Lagi
          </PressableBtn>
        </div>
      </div>
    </Transition>

    <!-- Game Board -->
    <div class="flex flex-col items-center gap-6 z-20">
      <!-- Grid card Container -->
      <div 
        class="grid gap-4 max-w-full p-4 bg-surface-900/40 border border-white/10 rounded-2xl backdrop-blur-md"
        :class="gridSizeClass"
      >
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          class="card w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer perspective-1000 select-none group"
          :class="{ 'flipped': card.isFlipped || card.isMatched }"
          @click="flipCard(index)"
        >
          <div class="card-inner relative w-full h-full transform-style-3d transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            
            <!-- Card Front (Backside displaying card icon wrapper) -->
            <div class="card-front absolute inset-0 rounded-xl bg-surface-800 border border-white/10 flex items-center justify-center text-2xl backface-hidden group-hover:border-brand-500/50 group-hover:bg-surface-700 transition-all duration-300">
              <span class="text-surface-500 font-bold">?</span>
            </div>

            <!-- Card Back (Frontside showing matched emoji) -->
            <div class="card-back absolute inset-0 rounded-xl bg-gradient-to-br from-brand-600/30 to-accent-600/30 border border-brand-500/50 flex items-center justify-center text-3xl sm:text-4xl backface-hidden rotate-y-180">
              {{ card.emoji }}
            </div>

          </div>
        </div>
      </div>

      <!-- Controls below grid -->
      <div class="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
        <span class="text-xs text-surface-400 font-bold uppercase tracking-wider">Difficulty:</span>
        <button 
          @click="setDifficulty(4)"
          class="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
          :class="gridSize === 4 ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-surface-400 hover:text-white'"
        >
          4x4 (Easy)
        </button>
        <button 
          @click="setDifficulty(6)"
          class="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
          :class="gridSize === 6 ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-surface-400 hover:text-white'"
        >
          6x6 (Medium)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useHaptics } from '~/composables/useHaptics'
import { useAppStore } from '~/stores'

const store = useAppStore()
const haptics = useHaptics()

const gridSize = ref(4) // 4x4 (16 cards) or 6x6 (36 cards)
const moves = ref(0)
const timerSeconds = ref(0)
const isGameWon = ref(false)

interface Card {
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const cards = ref<Card[]>([])
const flippedIndices = ref<number[]>([])

const emojis = ['👽', '🚀', '🔮', '🧬', '🤖', '🌌', '🌋', '💎', '🎨', '🍕', '🐱', '🐼', '🦊', '🦖', '⚽', '🎯', '🎸', '🍿']

let timerInterval: any = null

const gridSizeClass = computed(() => {
  return gridSize.value === 6 ? 'grid-cols-6' : 'grid-cols-4'
})

const formatTime = (totalSeconds: number) => {
  if (totalSeconds >= 999) return 'None'
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const setDifficulty = (size: number) => {
  haptics.toggle()
  gridSize.value = size
  restartGame()
}

// Audio synth chime generator (Web Audio API)
const playSynthAudio = (type: 'flip' | 'match' | 'fail' | 'win') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return
  
  const ctx = new AudioContextClass()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.connect(gain)
  gain.connect(ctx.destination)

  if (type === 'flip') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } else if (type === 'match') {
    // Fast arpeggio chord chime E5 -> G#5 -> B5
    osc.type = 'sine'
    const now = ctx.currentTime
    osc.frequency.setValueAtTime(659.25, now) // E5
    osc.frequency.setValueAtTime(830.61, now + 0.08) // G#5
    osc.frequency.setValueAtTime(987.77, now + 0.16) // B5
    
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
    
    osc.start()
    osc.stop(now + 0.35)
  } else if (type === 'fail') {
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.22)
  } else if (type === 'win') {
    // Symmetrical happy arpeggio chord
    osc.type = 'sine'
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5] // C5, E5, G5, C6, E6
    notes.forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, now + i * 0.08)
    })
    
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7)
    
    osc.start()
    osc.stop(now + 0.7)
  }
}

// Memory game initializer
const initGame = () => {
  const numPairs = (gridSize.value * gridSize.value) / 2
  
  // Slice correct number of emojis and double them
  const selectedEmojis = emojis.slice(0, numPairs)
  const pool = [...selectedEmojis, ...selectedEmojis]
  
  // Seeded Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }

  cards.value = pool.map(emoji => ({
    emoji,
    isFlipped: false,
    isMatched: false
  }))

  moves.value = 0
  timerSeconds.value = 0
  isGameWon.value = false
  flippedIndices.value = []
  
  startTimer()
}

const startTimer = () => {
  stopTimer()
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const flipCard = (index: number) => {
  const card = cards.value[index]
  if (card.isFlipped || card.isMatched || flippedIndices.value.length >= 2 || isGameWon.value) return

  haptics.toggle()
  playSynthAudio('flip')

  // Flip card
  card.isFlipped = true
  flippedIndices.value.push(index)

  if (flippedIndices.value.length === 2) {
    moves.value++
    checkMatch()
  }
}

const checkMatch = () => {
  const [firstIdx, secondIdx] = flippedIndices.value
  const firstCard = cards.value[firstIdx]
  const secondCard = cards.value[secondIdx]

  if (firstCard.emoji === secondCard.emoji) {
    // Match
    setTimeout(() => {
      firstCard.isMatched = true
      secondCard.isMatched = true
      flippedIndices.value = []
      haptics.success()
      playSynthAudio('match')

      // Check win condition
      const won = cards.value.every(c => c.isMatched)
      if (won) {
        winGame()
      }
    }, 450)
  } else {
    // Fail match: flip back cards after delay
    setTimeout(() => {
      firstCard.isFlipped = false
      secondCard.isFlipped = false
      flippedIndices.value = []
      haptics.warning()
      playSynthAudio('fail')
    }, 900)
  }
}

const winGame = () => {
  isGameWon.value = true
  stopTimer()
  haptics.success()
  playSynthAudio('win')

  // Update best time score in storage
  const currentBest = store.getHighScore('memory_time') || 999
  if (timerSeconds.value < currentBest) {
    store.updateHighScore('memory_time', timerSeconds.value)
  }
}

const restartGame = () => {
  initGame()
}

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.flipped .card-inner {
  transform: rotateY(180deg);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
