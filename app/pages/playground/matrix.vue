<template>
  <div class="relative w-screen h-screen overflow-hidden bg-black text-green-500 font-mono select-none">
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
        <h1 class="font-outfit font-bold text-lg leading-none text-white">Matrix Digital Rain</h1>
        <span class="text-xs text-surface-400">Interactive Character Stream</span>
      </div>
    </div>

    <!-- Live Alerts / Badges (Bullet Time / Easter Egg) -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-3 pointer-events-none">
      <Transition name="fade">
        <div v-if="isBulletTime" class="flex items-center gap-2 bg-blue-950/80 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-bold text-blue-400 backdrop-blur-md animate-pulse">
          ⚡ BULLET TIME ACTIVE (SLOW MOTION)
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="isAhmadActive" class="flex items-center gap-2 bg-red-950/80 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold text-red-400 backdrop-blur-md animate-pulse">
          🔓 DEVELOPER LEVEL ACCESS GRANTED
        </div>
      </Transition>
    </div>

    <!-- Bottom Keyboard Instruction Prompt -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none">
      <div class="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-surface-300">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Type characters to insert them into rain. Try typing <strong class="text-white">"neo"</strong> or <strong class="text-white">"ahmad"</strong>.</span>
      </div>
    </div>

    <!-- Fullscreen Canvas -->
    <div class="w-full h-full pointer-events-auto">
      <canvas ref="canvasEl" class="w-full h-full block" />
    </div>

    <!-- Developer Greeting overlay -->
    <Transition name="fade">
      <div 
        v-if="isAhmadActive" 
        class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm pointer-events-none"
      >
        <div class="text-center space-y-6">
          <div class="text-xs uppercase tracking-widest text-red-500 font-bold border border-red-500/20 px-3 py-1 rounded-full w-max mx-auto">
            SYSTEM CRACKED
          </div>
          <!-- Stereoscopic Red-Cyan Glitch Title -->
          <h2 class="font-outfit font-black text-6xl sm:text-7xl md:text-8xl text-white glitch-text tracking-wider">
            HELLO AHMAD
          </h2>
          <p class="font-mono text-sm text-surface-400 max-w-md mx-auto leading-relaxed">
            Welcome back Creator. Visual diagnostics: Optimal. Frame execution: 60fps. Running developer level operations...
          </p>
        </div>
      </div>
    </Transition>

    <!-- Floating Settings panel -->
    <Transition name="slide-panel">
      <div 
        v-if="showControls" 
        class="absolute right-6 top-24 bottom-6 w-80 z-40 bg-surface-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto text-white"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 class="font-outfit font-bold text-md text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 STREAM SETTINGS</span>
            </h2>
          </div>

          <!-- Color Preset -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Stream Color</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="preset in colorPresets" 
                :key="preset.name"
                @click="colorPreset = preset.name"
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-2"
                :class="colorPreset === preset.name ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span :class="preset.textClass">●</span>
                <span>{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <!-- Speed Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Drop Speed</span>
              <span class="font-mono text-brand-400">{{ speedMultiplier }}x</span>
            </div>
            <input 
              v-model.number="speedMultiplier" 
              type="range" 
              min="0.2" 
              max="2.5" 
              step="0.1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <!-- Font Size Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Character Size</span>
              <span class="font-mono text-brand-400">{{ fontSize }}px</span>
            </div>
            <input 
              v-model.number="fontSize" 
              type="range" 
              min="10" 
              max="30" 
              step="1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              @change="initRain"
            />
          </div>

          <!-- Broadcast Message Input -->
          <div class="space-y-2 pt-2 border-t border-white/5">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Broadcast Message</label>
            <div class="flex gap-2">
              <input 
                v-model="broadcastText"
                type="text" 
                placeholder="Type a message..."
                class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-surface-500 outline-none focus:border-brand-500/50"
                @keyup.enter="sendBroadcast"
              />
              <button 
                @click="sendBroadcast"
                class="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <!-- Action Tools -->
        <div class="space-y-3 pt-6 border-t border-white/5">
          <PressableBtn 
            @click="clearBroadcast"
            v-if="activeBroadcast"
            class="btn-primary w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 border-none"
          >
            <span>Clear Message</span>
          </PressableBtn>
          <PressableBtn 
            @click="takeScreenshot"
            class="btn-ghost w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 border border-white/10 hover:border-white/20 text-white"
          >
            <svg class="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Screenshot Rain</span>
          </PressableBtn>
        </div>
      </div>
    </Transition>

    <!-- Settings Trigger Button -->
    <PressableBtn 
      @click="showControls = !showControls"
      class="absolute bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center backdrop-blur-md text-white"
      aria-label="Toggle settings panel"
    >
      <svg class="w-5 h-5 text-white transition-transform duration-300" :class="{ 'rotate-90': showControls }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </PressableBtn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCanvas } from '~/composables/useCanvas'
import { useAnimationFrame } from '~/composables/useAnimationFrame'
import { useHaptics } from '~/composables/useHaptics'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const haptics = useHaptics()

const { ctx, width, height, initCanvas } = useCanvas(canvasEl)
const { start } = useAnimationFrame()

const showControls = ref(true)
const colorPreset = ref('green') // green, pink, cyan, amber
const speedMultiplier = ref(1.0)
const fontSize = ref(16)
const isBulletTime = ref(false)
const isAhmadActive = ref(false)
const broadcastText = ref('')
const activeBroadcast = ref<string | null>(null)

// Buffer to track typed letters for easter eggs
const typedBuffer = ref('')

const colorPresets = [
  { name: 'green', label: 'Matrix Green', textClass: 'text-green-500' },
  { name: 'pink', label: 'Cyber Pink', textClass: 'text-pink-500' },
  { name: 'cyan', label: 'Liquid Cyan', textClass: 'text-cyan-400' },
  { name: 'amber', label: 'Retro Amber', textClass: 'text-amber-500' },
]

// Characters array (Katakana + Latin alphanumeric)
const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Drop {
  x: number
  y: number
  speed: number
  opacity: number
  history: string[] // Character history to render trails
  maxLength: number
  typedChar?: string // Kept for custom typed drops
  isCustom?: boolean
}

const drops = ref<Drop[]>([])
let columns = 0

const initRain = () => {
  const w = width.value || window.innerWidth
  columns = Math.floor(w / fontSize.value)
  
  drops.value = Array.from({ length: columns }, (_, index) => {
    return {
      x: index * fontSize.value,
      y: Math.random() * -height.value, // start above viewport
      speed: Math.random() * 80 + 40,  // pixels/second
      opacity: Math.random() * 0.7 + 0.3,
      history: [],
      maxLength: Math.floor(Math.random() * 15) + 5
    }
  })
}

// Keyboard input capture
const handleKeyDown = (e: KeyboardEvent) => {
  // Ignore modifier keys / inputs inside form elements
  if (e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLInputElement) return

  const key = e.key.toLowerCase()

  // Track typed buffer for easter eggs
  if (key.length === 1 && /[a-z]/.test(key)) {
    typedBuffer.value = (typedBuffer.value + key).slice(-8) // keep last 8 characters
    
    // Check Easter Eggs
    if (typedBuffer.value.endsWith('neo')) {
      triggerBulletTime()
    } else if (typedBuffer.value.endsWith('ahmad')) {
      triggerAhmadEgg()
    }
  }

  // Insert typed character as a bright custom drop in a random column
  if (e.key.length === 1) {
    haptics.success()
    
    const randomCol = Math.floor(Math.random() * columns)
    const d = drops.value[randomCol]
    if (d) {
      d.y = 0 // Reset to top
      d.typedChar = e.key.toUpperCase()
      d.isCustom = true
      d.speed = 180 // falls fast
      d.maxLength = 22
    }
  }
}

// Trigger Bullet Time slow-mo
const triggerBulletTime = () => {
  isBulletTime.value = true
  haptics.toggle()
  setTimeout(() => {
    isBulletTime.value = false
    typedBuffer.value = ''
  }, 5000)
}

// Trigger Developer levels greeting
const triggerAhmadEgg = () => {
  isAhmadActive.value = true
  haptics.success()
  setTimeout(() => {
    isAhmadActive.value = false
    typedBuffer.value = ''
  }, 4500)
}

// Broadcast Message
const sendBroadcast = () => {
  if (!broadcastText.value.trim()) return
  haptics.success()
  activeBroadcast.value = broadcastText.value.trim().toUpperCase()
  broadcastText.value = ''
}

const clearBroadcast = () => {
  haptics.toggle()
  activeBroadcast.value = null
}

const takeScreenshot = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  haptics.success()
  
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `matrix-digital-rain-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}

// Color matching helper
const getRGBColor = (alpha: number, isBright = false) => {
  const o = isBright ? 1.0 : alpha
  switch (colorPreset.value) {
    case 'pink':
      return `rgba(217, 70, 239, ${o})` // Cyber Pink
    case 'cyan':
      return `rgba(6, 182, 212, ${o})`   // Liquid Cyan
    case 'amber':
      return `rgba(245, 158, 11, ${o})`  // Retro Amber
    case 'green':
    default:
      return `rgba(34, 197, 94, ${o})`   // Matrix Green
  }
}

// Main rendering engine
const render = (deltaTime: number) => {
  const c = ctx.value
  const w = width.value
  const h = height.value
  if (!c || w === 0 || h === 0) return

  // Standard semi-transparent black sweep for rain trail effect
  c.fillStyle = 'rgba(0, 0, 0, 0.08)'
  c.fillRect(0, 0, w, h)

  c.font = `bold ${fontSize.value}px monospace`

  // Speed modifiers (Bullet time vs regular multipliers)
  const dtSpeed = isBulletTime.value ? 0.08 : speedMultiplier.value
  const speedScale = deltaTime * dtSpeed

  // Render Broadcast Message overlay if active
  if (activeBroadcast.value) {
    c.fillStyle = 'rgba(0, 0, 0, 0.15)'
    c.fillRect(0, 0, w, h)

    c.shadowColor = getRGBColor(0.8)
    c.shadowBlur = 15
    c.fillStyle = '#ffffff'
    c.font = `bold ${Math.floor(fontSize.value * 2.5)}px monospace`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillText(activeBroadcast.value, w / 2, h / 2)

    c.shadowBlur = 0 // reset shadow
    c.textAlign = 'left' // reset text align
    c.font = `bold ${fontSize.value}px monospace`
  }

  // Update & Draw Drops
  drops.value.forEach((d) => {
    // 1. Append characters history
    let charToSpawn = chars[Math.floor(Math.random() * chars.length)]
    if (d.typedChar) {
      charToSpawn = d.typedChar
      d.typedChar = undefined // use once
    }

    d.history.push(charToSpawn)
    if (d.history.length > d.maxLength) {
      d.history.shift()
    }

    // 2. Draw the vertical column trail
    const len = d.history.length
    for (let i = 0; i < len; i++) {
      const isLead = i === len - 1
      const character = d.history[i]
      const charY = d.y - (len - 1 - i) * fontSize.value

      // Draw character
      c.beginPath()
      if (isLead) {
        c.fillStyle = '#ffffff' // Head of the rain is always bright white
        c.shadowColor = getRGBColor(1.0)
        c.shadowBlur = 10
      } else {
        c.fillStyle = getRGBColor(d.opacity * (i / len))
        c.shadowBlur = 0
      }
      
      c.fillText(character, d.x, charY)
    }

    // Reset shadow blur
    c.shadowBlur = 0

    // 3. Fall updates (delta-time controlled)
    d.y += d.speed * speedScale

    // 4. Reset drop at bottom boundary
    if (d.y - (d.maxLength * fontSize.value) > h) {
      d.y = Math.random() * -100
      d.history = []
      d.opacity = Math.random() * 0.7 + 0.3
      d.speed = Math.random() * 80 + 40
      d.isCustom = false
    }
  })
}

onMounted(() => {
  initCanvas(() => {
    initRain()
  })

  initRain()

  // Start Loop
  start((deltaTime) => {
    render(deltaTime)
  })

  // Global keyboard listener
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<style scoped>
/* Stereoscopic Red-Cyan text glitch for Hello Ahmad egg */
.glitch-text {
  text-shadow: 
    4px 0 0 oklch(72% 0.2 310),
    -4px 0 0 oklch(72% 0.16 265);
  animation: txtGlitch 0.4s infinite linear alternate-reverse;
}

@keyframes txtGlitch {
  0% { text-shadow: 4px 2px 0 oklch(72% 0.2 310), -4px -2px 0 oklch(72% 0.16 265); }
  100% { text-shadow: -4px 2px 0 oklch(72% 0.2 310), 4px -2px 0 oklch(72% 0.16 265); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
