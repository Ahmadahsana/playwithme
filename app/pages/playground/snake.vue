<template>
  <div 
    class="relative w-screen h-screen overflow-hidden bg-surface-950 text-white font-inter flex items-center justify-center"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
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
        <h1 class="font-outfit font-bold text-lg leading-none">Neon Snake</h1>
        <span class="text-xs text-surface-400">Cyberpunk Arcade Game</span>
      </div>
    </div>

    <!-- UI instructions -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none hidden sm:block">
      <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-surface-300">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Keyboard: WASD / Arrow Keys · Support Controller Gamepad · Swipe on mobile screen</span>
      </div>
    </div>

    <!-- Live Scores display -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none text-xs font-mono">
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">High Score:</span>
        <span class="font-bold text-brand-400">{{ store.getHighScore('snake') }}</span>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">Score:</span>
        <span class="font-bold text-emerald-400">{{ score }}</span>
      </div>
    </div>

    <!-- Game Over Screen Overlay -->
    <Transition name="fade">
      <div 
        v-if="isGameOver" 
        class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
      >
        <div class="card-glass max-w-sm p-8 text-center space-y-6">
          <div class="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mx-auto">
            💀
          </div>
          <div class="space-y-2">
            <h2 class="font-outfit font-black text-3xl text-white">GAME OVER</h2>
            <p class="text-xs text-surface-400">Crash detected. Snake structure dismantled.</p>
          </div>
          <div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-left font-mono text-sm">
            <div>
              <span class="text-surface-500 block text-xs">FINAL SCORE</span>
              <span class="font-bold text-emerald-400 text-lg">{{ score }}</span>
            </div>
            <div>
              <span class="text-surface-500 block text-xs">HIGH SCORE</span>
              <span class="font-bold text-brand-400 text-lg">{{ store.getHighScore('snake') }}</span>
            </div>
          </div>
          <PressableBtn @click="restartGame" class="btn-primary w-full justify-center text-xs py-2.5 font-bold">
            🔄 Main Lagi
          </PressableBtn>
        </div>
      </div>
    </Transition>

    <!-- Main Game Board Canvas -->
    <div class="relative p-4 border border-white/10 rounded-2xl bg-surface-900/60 shadow-2xl backdrop-blur-md z-20">
      <canvas ref="canvasEl" class="block bg-black rounded-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useHaptics } from '~/composables/useHaptics'
import { useAppStore } from '~/stores'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const haptics = useHaptics()
const store = useAppStore()

const score = ref(0)
const isGameOver = ref(false)

// Grid layout variables
const gridSize = 20
let cols = 25
let rows = 20

// Snake State
interface Point {
  x: number
  y: number
}
const snake = ref<Point[]>([])
const direction = ref<'up' | 'down' | 'left' | 'right'>('right')
const nextDirection = ref<'up' | 'down' | 'left' | 'right'>('right')

// Food State
const food = ref<Point>({ x: 5, y: 5 })

// Neon Explosions Particles (on eat)
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
}
const particles = ref<Particle[]>([])

// Timing values
let gameSpeed = 100 // update interval in ms
let lastGameTime = 0
let animationFrameId: number | null = null

// Mobile Swipe Controls variables
let touchStartX = 0
let touchStartY = 0

// Gamepad loop check
const checkGamepad = () => {
  if (typeof navigator === 'undefined' || !navigator.getGamepads) return
  const gamepads = navigator.getGamepads()
  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i]
    if (!gp) continue

    // Read axes (analogue stick)
    const axesX = gp.axes[0]
    const axesY = gp.axes[1]

    // Read D-pad indices (12: Up, 13: Down, 14: Left, 15: Right)
    if (gp.buttons[12]?.pressed || axesY < -0.5) {
      if (direction.value !== 'down') nextDirection.value = 'up'
    } else if (gp.buttons[13]?.pressed || axesY > 0.5) {
      if (direction.value !== 'up') nextDirection.value = 'down'
    } else if (gp.buttons[14]?.pressed || axesX < -0.5) {
      if (direction.value !== 'right') nextDirection.value = 'left'
    } else if (gp.buttons[15]?.pressed || axesX > 0.5) {
      if (direction.value !== 'left') nextDirection.value = 'right'
    }
  }
}

// Mobile swipe listeners
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY

  const minSwipeDistance = 30
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (Math.abs(dx) > minSwipeDistance) {
      if (dx > 0 && direction.value !== 'left') nextDirection.value = 'right'
      else if (dx < 0 && direction.value !== 'right') nextDirection.value = 'left'
    }
  } else {
    // Vertical swipe
    if (Math.abs(dy) > minSwipeDistance) {
      if (dy > 0 && direction.value !== 'up') nextDirection.value = 'down'
      else if (dy < 0 && direction.value !== 'down') nextDirection.value = 'up'
    }
  }
}

// Synth Sound generator (Web Audio API)
const playSynthAudio = (type: 'eat' | 'die') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return
  
  const ctx = new AudioContextClass()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.connect(gain)
  gain.connect(ctx.destination)

  if (type === 'eat') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } else {
    // Game over descending sound
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.35)
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  }
}

// Spawns neon explosions particles on food eat
const spawnParticles = (x: number, y: number) => {
  const count = 12
  const px = x * gridSize + gridSize / 2
  const py = y * gridSize + gridSize / 2
  
  const colors = ['#10b981', '#6366f1', '#d946ef', '#f59e0b']

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 4 + 2
    particles.value.push({
      x: px,
      y: py,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 2 + 1,
      life: 1.0
    })
  }
}

// Snake Grid Logic
const initGame = () => {
  // Spawn snake in middle of grid
  snake.value = [
    { x: 12, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 10 }
  ]
  direction.value = 'right'
  nextDirection.value = 'right'
  score.value = 0
  isGameOver.value = false
  spawnFood()
}

const spawnFood = () => {
  let attempts = 0
  let spawned = false

  while (!spawned && attempts < 100) {
    const fx = Math.floor(Math.random() * cols)
    const fy = Math.floor(Math.random() * rows)

    // Check if food coordinates touch snake body
    const touchesSnake = snake.value.some(p => p.x === fx && p.y === fy)
    if (!touchesSnake) {
      food.value = { x: fx, y: fy }
      spawned = true
    }
    attempts++
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (['KeyW', 'ArrowUp'].includes(e.code) && direction.value !== 'down') nextDirection.value = 'up'
  else if (['KeyS', 'ArrowDown'].includes(e.code) && direction.value !== 'up') nextDirection.value = 'down'
  else if (['KeyA', 'ArrowLeft'].includes(e.code) && direction.value !== 'right') nextDirection.value = 'left'
  else if (['KeyD', 'ArrowRight'].includes(e.code) && direction.value !== 'left') nextDirection.value = 'right'
}

const updateGame = () => {
  if (isGameOver.value) return

  direction.value = nextDirection.value

  const head = { ...snake.value[0] }

  // Adjust coordinates based on direction
  if (direction.value === 'up') head.y--
  else if (direction.value === 'down') head.y++
  else if (direction.value === 'left') head.x--
  else if (direction.value === 'right') head.x++

  // 1. Boundary check (Crash)
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    endGame()
    return
  }

  // 2. Self collision check (Crash)
  const selfCollision = snake.value.some(p => p.x === head.x && p.y === head.y)
  if (selfCollision) {
    endGame()
    return
  }

  // Add new head
  snake.value.unshift(head)

  // 3. Food Eat check
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    haptics.toggle()
    playSynthAudio('eat')
    spawnParticles(food.value.x, food.value.y)
    
    // Scale speed slightly as score increases (every 50 points)
    gameSpeed = Math.max(60, 100 - Math.floor(score.value / 50) * 8)
    
    spawnFood()
  } else {
    // Remove tail
    snake.value.pop()
  }
}

const endGame = () => {
  isGameOver.value = true
  haptics.destructive()
  playSynthAudio('die')
  store.updateHighScore('snake', score.value)
}

const restartGame = () => {
  initGame()
}

// Loop calculations
const gameLoop = (timestamp: number) => {
  checkGamepad()

  // 1. Fixed interval game logic updates
  if (!lastGameTime) lastGameTime = timestamp
  const elapsed = timestamp - lastGameTime
  if (elapsed >= gameSpeed) {
    updateGame()
    lastGameTime = timestamp
  }

  // 2. Render Loop (Runs at full monitor framerate for fluid particle effects)
  const canvas = canvasEl.value
  const c = canvas?.getContext('2d')
  if (canvas && c) {
    const w = canvas.width
    const h = canvas.height

    // Draw board
    c.fillStyle = '#050508'
    c.fillRect(0, 0, w, h)

    // Render Grid lines (subtle retro board)
    c.strokeStyle = 'rgba(255,255,255,0.015)'
    c.lineWidth = 0.5
    for (let i = 0; i < cols; i++) {
      c.beginPath()
      c.moveTo(i * gridSize, 0)
      c.lineTo(i * gridSize, h)
      c.stroke()
    }
    for (let j = 0; j < rows; j++) {
      c.beginPath()
      c.moveTo(0, j * gridSize)
      c.lineTo(w, j * gridSize)
      c.stroke()
    }

    // Render Food (Glowing circular neon orb)
    c.beginPath()
    c.shadowColor = '#f59e0b'
    c.shadowBlur = 12
    c.fillStyle = '#f59e0b'
    c.arc(
      food.value.x * gridSize + gridSize / 2,
      food.value.y * gridSize + gridSize / 2,
      gridSize / 2.5,
      0,
      Math.PI * 2
    )
    c.fill()
    c.shadowBlur = 0 // reset

    // Render Snake Body (Glowing rounded segments)
    snake.value.forEach((part, index) => {
      const isHead = index === 0
      const color = isHead ? '#10b981' : '#6366f1' // Emerald head, Indigo body
      
      c.beginPath()
      c.fillStyle = color
      c.shadowColor = color
      c.shadowBlur = isHead ? 15 : 6

      // Draw slightly smaller body segments
      const padding = isHead ? 0.8 : 2
      c.roundRect(
        part.x * gridSize + padding,
        part.y * gridSize + padding,
        gridSize - padding * 2,
        gridSize - padding * 2,
        isHead ? 6 : 4
      )
      c.fill()
      c.shadowBlur = 0
    })

    // Render Particles explosion trails
    particles.value = particles.value.filter(p => {
      p.life -= 0.035
      if (p.life <= 0) return false

      p.x += p.vx
      p.y += p.vy

      c.beginPath()
      c.fillStyle = p.color
      c.globalAlpha = p.life
      c.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      c.fill()
      c.globalAlpha = 1.0

      return true
    })
  }

  animationFrameId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  const canvas = canvasEl.value
  if (canvas) {
    // Set fixed board size
    canvas.width = cols * gridSize
    canvas.height = rows * gridSize
  }

  initGame()

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }

  animationFrameId = requestAnimationFrame(gameLoop)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
