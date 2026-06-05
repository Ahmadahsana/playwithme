<template>
  <div class="relative w-screen h-screen overflow-hidden bg-surface-950 text-white font-inter">
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
        <h1 class="font-outfit font-bold text-lg leading-none">Particle Galaxy</h1>
        <span class="text-xs text-surface-400">Interactive Gravity Simulator</span>
      </div>
    </div>

    <!-- UI Overlays & Prompts -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none">
      <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-surface-300">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
        </span>
        <span>Drag mouse: Gravitational Pull · Scroll wheel: Zoom · Click: Supernova</span>
      </div>
    </div>

    <!-- Stats & Live FPS counter -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none">
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3  py-1.5 rounded-xl border border-white/5 font-mono text-xs text-surface-300">
        <span class="text-surface-500">FPS:</span>
        <span class="font-bold text-green-400">{{ fps }}</span>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3  py-1.5 rounded-xl border border-white/5 font-mono text-xs text-surface-300">
        <span class="text-surface-500">Zoom:</span>
        <span class="font-bold text-brand-400">{{ (zoom * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <!-- Fullscreen Interactive Canvas -->
    <div 
      class="w-full h-full cursor-crosshair pointer-events-auto"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @wheel="onWheel"
    >
      <canvas ref="canvasEl" class="w-full h-full block" />
    </div>

    <!-- Floating Control Panel Sidebar -->
    <Transition name="slide-panel">
      <div 
        v-if="showControls" 
        class="absolute right-6 top-24 bottom-6 w-80 z-40 bg-surface-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 class="font-outfit font-bold text-md text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 SIMULATOR SETTINGS</span>
            </h2>
          </div>

          <!-- Color Mode Toggles -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Nebula Color Preset</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="preset in colorPresets" 
                :key="preset.name"
                @click="colorPreset = preset.name"
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-2"
                :class="colorPreset === preset.name ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span>{{ preset.emoji }}</span>
                <span>{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <!-- Particle Count Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Particles count</span>
              <span class="font-mono text-brand-400">{{ particleCount }}</span>
            </div>
            <input 
              v-model.number="particleCount" 
              type="range" 
              min="200" 
              max="4000" 
              step="100"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              @change="createGalaxy"
            />
          </div>

          <!-- Gravity Constant Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Gravity Force</span>
              <span class="font-mono text-brand-400">{{ gravityForce }}</span>
            </div>
            <input 
              v-model.number="gravityForce" 
              type="range" 
              min="0" 
              max="150" 
              step="5"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <!-- Rotation Speed Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Rotation Speed</span>
              <span class="font-mono text-brand-400">{{ rotationSpeed }}</span>
            </div>
            <input 
              v-model.number="rotationSpeed" 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        </div>

        <!-- Action Tools -->
        <div class="space-y-3 pt-6 border-t border-white/5">
          <PressableBtn 
            @click="takeScreenshot"
            class="btn-ghost w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 border border-white/10 hover:border-white/20"
          >
            <svg class="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Screenshot Canvas</span>
          </PressableBtn>
          <PressableBtn 
            @click="resetGalaxy"
            class="btn-primary w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 shadow-lg shadow-red-900/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
            </svg>
            <span>Reset Galaxy</span>
          </PressableBtn>
        </div>
      </div>
    </Transition>

    <!-- Sidebar Trigger Button -->
    <PressableBtn 
      @click="showControls = !showControls"
      class="absolute bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
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
import { ref, onMounted, computed } from 'vue'
import { useCanvas } from '~/composables/useCanvas'
import { useAnimationFrame } from '~/composables/useAnimationFrame'
import { useAppStore } from '~/stores'
import { useHaptics } from '~/composables/useHaptics'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const store = ref(useAppStore())
const haptics = useHaptics()

const { ctx, width, height, initCanvas } = useCanvas(canvasEl)
const { start } = useAnimationFrame()

const showControls = ref(true)
const fps = ref(0)
const zoom = ref(1.0)
const particleCount = ref(1800)
const gravityForce = ref(60)
const rotationSpeed = ref(1.0)
const colorPreset = ref('neon') // neon, fire, ice, rainbow

const colorPresets = [
  { name: 'neon', label: 'Indigo Neon', emoji: '🌌' },
  { name: 'fire', label: 'Fire Galaxy', emoji: '🔥' },
  { name: 'ice', label: 'Cosmic Ice', emoji: '❄️' },
  { name: 'rainbow', label: 'Spectrum', emoji: '🌈' },
]

interface GalaxyParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  distance: number // distance from center
  angle: number    // current angle
  speed: number    // orbit speed modifier
  isBurst?: boolean
  life?: number     // burst life
}

const galaxyParticles = ref<GalaxyParticle[]>([])
const mousePosition = ref<{ x: number; y: number } | null>(null)
const isPointerDown = ref(false)

// FPS Counter Variables
let fpsCount = 0
let fpsTime = 0

// Color Generator Helper
const getParticleColor = (dist: number, maxDist: number) => {
  const ratio = dist / maxDist
  switch (colorPreset.value) {
    case 'fire':
      // Red to Gold
      return `rgba(${Math.floor(255 - ratio * 100)}, ${Math.floor(80 + ratio * 150)}, 0, ${0.4 + Math.random() * 0.4})`
    case 'ice':
      // Deep Blue to Cyan
      return `rgba(0, ${Math.floor(100 + ratio * 155)}, 255, ${0.4 + Math.random() * 0.4})`
    case 'rainbow':
      // Full spectrum
      const hue = Math.floor(ratio * 360)
      return `hsla(${hue}, 85%, 65%, ${0.5 + Math.random() * 0.3})`
    case 'neon':
    default:
      // Indigo to Pink
      return `rgba(${Math.floor(99 + ratio * 118)}, ${Math.floor(102 - ratio * 32)}, ${Math.floor(241 + ratio * 14)}, ${0.4 + Math.random() * 0.4})`
  }
}

const createGalaxy = () => {
  const w = width.value || window.innerWidth
  const h = height.value || window.innerHeight
  const centerX = w / 2
  const centerY = h / 2
  const maxDist = Math.min(w, h) * 0.5

  galaxyParticles.value = Array.from({ length: particleCount.value }, () => {
    // Generate particles in spiral arms
    const numArms = 3
    const armIndex = Math.floor(Math.random() * numArms)
    
    // Golden spiral angle distribution
    const distance = Math.pow(Math.random(), 1.5) * maxDist + 10
    const angle = (armIndex * (Math.PI * 2) / numArms) + (distance / maxDist) * Math.PI * 2.5 + (Math.random() - 0.5) * 0.4

    // Calculate circular orbital velocity
    const speed = (Math.random() * 0.4 + 0.8)

    // Orbital speeds: v = sqrt(GM/r). Closer particles orbit faster
    const baseV = Math.sqrt(1000 / distance)

    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      vx: -Math.sin(angle) * baseV * speed,
      vy: Math.cos(angle) * baseV * speed,
      size: Math.random() * 1.5 + 0.6,
      color: getParticleColor(distance, maxDist),
      distance,
      angle,
      speed
    }
  })
}

// Mouse controls
const onPointerDown = (e: PointerEvent) => {
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  
  isPointerDown.value = true
  mousePosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }

  // Trigger Haptic & Supernova on Click
  haptics.toggle()
  triggerSupernova(mousePosition.value.x, mousePosition.value.y)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isPointerDown.value) return
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mousePosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

const onPointerUp = () => {
  isPointerDown.value = false
  mousePosition.value = null
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  // Zoom logic
  const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92
  zoom.value = Math.min(2.5, Math.max(0.4, zoom.value * zoomFactor))
}

// Supernova explosion
const triggerSupernova = (clickX: number, clickY: number) => {
  const burstCount = 180
  const w = width.value
  const h = height.value
  const maxDist = Math.min(w, h) * 0.5

  for (let i = 0; i < burstCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 180 + 60 // radial velocity pixels/second
    
    galaxyParticles.value.push({
      x: clickX,
      y: clickY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2 + 1,
      color: getParticleColor(Math.random() * maxDist, maxDist),
      distance: 0,
      angle: 0,
      speed: 0,
      isBurst: true,
      life: 1.0
    })
  }
}

// Reset
const resetGalaxy = () => {
  haptics.destructive()
  zoom.value = 1.0
  createGalaxy()
}

// Screenshot helper
const takeScreenshot = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  haptics.success()
  
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `particle-galaxy-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}

// Main update and render loop
const render = (deltaTime: number) => {
  const c = ctx.value
  const w = width.value
  const h = height.value
  if (!c || w === 0 || h === 0) return

  // Performance FPS counter
  fpsTime += deltaTime
  fpsCount++
  if (fpsTime >= 1.0) {
    fps.value = fpsCount
    fpsCount = 0
    fpsTime = 0
  }

  // Draw space background (semi-transparent for trail effects)
  c.fillStyle = 'rgba(5, 5, 8, 0.22)' // var(--color-surface-950) with alpha for motion blur trail
  c.fillRect(0, 0, w, h)

  const centerX = w / 2
  const centerY = h / 2
  const activeMouse = mousePosition.value
  const gPower = gravityForce.value
  const rotVal = rotationSpeed.value * deltaTime * 0.2

  // Update & Draw Particles
  galaxyParticles.value = galaxyParticles.value.filter((p) => {
    // 1. If particle is click explosion burst
    if (p.isBurst) {
      if (p.life === undefined) p.life = 1.0
      p.life -= deltaTime * 1.2
      if (p.life <= 0) return false // remove dead particles

      // Apply drag resistance
      p.vx *= 0.98
      p.vy *= 0.98

      // Update position
      p.x += p.vx * deltaTime
      p.y += p.vy * deltaTime

      // Render
      c.beginPath()
      c.arc(p.x, p.y, p.size * zoom.value, 0, Math.PI * 2)
      c.fillStyle = p.color
      c.fill()
      return true
    }

    // 2. Default galaxy orbital calculation
    // Update angle for circular orbit
    p.angle += (Math.pow(120 / p.distance, 1.2) * 0.05 * rotVal) * p.speed

    // Target orbital position relative to center, scaled by zoom
    const targetX = centerX + Math.cos(p.angle) * p.distance * zoom.value
    const targetY = centerY + Math.sin(p.angle) * p.distance * zoom.value

    // Apply basic inertia towards orbital target
    p.vx += (targetX - p.x) * deltaTime * 5
    p.vy += (targetY - p.y) * deltaTime * 5

    // 3. Gravitational pull toward mouse if active
    if (activeMouse) {
      const dx = activeMouse.x - p.x
      const dy = activeMouse.y - p.y
      const distSq = dx * dx + dy * dy
      const dist = Math.sqrt(distSq)

      if (dist > 15) {
        // Force F = G * m1*m2 / r^2 (simplified)
        const pull = (gPower * 50) / (distSq + 200)
        p.vx += (dx / dist) * pull * deltaTime * 60
        p.vy += (dy / dist) * pull * deltaTime * 60
      }
    }

    // Apply general damping (prevents extreme chaotic speeds)
    p.vx *= 0.96
    p.vy *= 0.96

    // Update position
    p.x += p.vx * deltaTime
    p.y += p.vy * deltaTime

    // Render Particle
    c.beginPath()
    c.arc(p.x, p.y, p.size * zoom.value, 0, Math.PI * 2)
    c.fillStyle = p.color
    c.fill()

    return true
  })
}

onMounted(() => {
  // Init Canvas context
  initCanvas(() => {
    // Callback on resize: re-create galaxy to center it properly
    createGalaxy()
  })

  // Populate particles
  createGalaxy()

  // Start Animation Loop
  start((deltaTime) => {
    render(deltaTime)
  })
})
</script>

<style scoped>
/* Zoom and custom slider styling */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-brand-400);
  cursor: pointer;
  box-shadow: 0 0 10px oklch(62% 0.2 265 / 0.5);
  transition: transform 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* Control Panel Slide Transition */
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
