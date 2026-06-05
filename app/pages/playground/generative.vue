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
        <h1 class="font-outfit font-bold text-lg leading-none">Generative Art Engine</h1>
        <span class="text-xs text-surface-400">Algorithmic Procedural Canvas</span>
      </div>
    </div>

    <!-- UI instructions -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none">
      <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-surface-300">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span>Every seed creates a unique artwork. Adjust options and click "Generate New".</span>
      </div>
    </div>

    <!-- Live parameters display -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none text-xs font-mono">
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">Active Seed:</span>
        <span class="font-bold text-amber-400">{{ activeSeed }}</span>
      </div>
    </div>

    <!-- Fullscreen canvas container -->
    <div class="w-full h-full block bg-surface-950 pointer-events-auto flex items-center justify-center">
      <canvas ref="canvasEl" class="max-w-full max-h-full block shadow-2xl rounded-lg border border-white/5 bg-[#050508]" />
    </div>

    <!-- Floating settings controls panel -->
    <Transition name="slide-panel">
      <div 
        v-if="showControls" 
        class="absolute right-6 top-24 bottom-6 w-80 z-40 bg-surface-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 class="font-outfit font-bold text-md text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 ENGINE CONTROLS</span>
            </h2>
          </div>

          <!-- Algorithm Picker -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Algorithm</label>
            <select 
              v-model="selectedAlgo"
              class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-500/50"
              @change="generateNew"
            >
              <option value="flowfield" class="bg-surface-900 text-white">🌌 Perlin Flow Field</option>
              <option value="spirograph" class="bg-surface-900 text-white">💮 Harmonograph Orbit</option>
              <option value="fractal" class="bg-surface-900 text-white">🌿 Recursive Fractal Tree</option>
            </select>
          </div>

          <!-- Seed Inputs -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Seed Value</label>
            <div class="flex gap-2">
              <input 
                v-model="seedInput"
                type="text" 
                placeholder="Custom seed..."
                class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-surface-500 outline-none focus:border-brand-500/50"
              />
              <button 
                @click="randomizeSeed"
                class="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors shrink-0"
                title="Random Seed"
              >
                🎲
              </button>
            </div>
          </div>

          <!-- Color Presets -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Color Palette Preset</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="preset in colorPresets" 
                :key="preset.name"
                @click="colorPreset = preset.name; generateNew()"
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-2"
                :class="colorPreset === preset.name ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span>{{ preset.emoji }}</span>
                <span>{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <!-- Complexity Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Complexity / Depth</span>
              <span class="font-mono text-brand-400">{{ complexity }}</span>
            </div>
            <input 
              v-model.number="complexity" 
              type="range" 
              min="1" 
              max="14" 
              step="1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              @change="generateNew"
            />
          </div>

          <!-- Density Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Density / Size</span>
              <span class="font-mono text-brand-400">{{ density }}</span>
            </div>
            <input 
              v-model.number="density" 
              type="range" 
              min="100" 
              max="2000" 
              step="50"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              @change="generateNew"
            />
          </div>
        </div>

        <!-- Action Tools -->
        <div class="space-y-3 pt-6 border-t border-white/5">
          <PressableBtn 
            @click="shareSeed"
            class="btn-ghost w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 border border-white/10 hover:border-white/20"
          >
            <span>🔗 Copy Shareable Seed Link</span>
          </PressableBtn>
          <PressableBtn 
            @click="downloadArt"
            class="btn-ghost w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 border border-white/10 hover:border-white/20"
          >
            <span>📥 Save Artwork as PNG</span>
          </PressableBtn>
          <PressableBtn 
            @click="generateNew"
            class="btn-primary w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 bg-gradient-to-r from-amber-500 to-accent-500 border-none"
          >
            <span>✨ Generate New Art</span>
          </PressableBtn>
        </div>
      </div>
    </Transition>

    <!-- Settings Trigger Button -->
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useHaptics } from '~/composables/useHaptics'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const haptics = useHaptics()

const showControls = ref(true)
const selectedAlgo = ref('flowfield') // flowfield, spirograph, fractal
const seedInput = ref('PLAYWITHME')
const activeSeed = ref('PLAYWITHME')
const colorPreset = ref('neon') // neon, fire, ice, rainbow
const complexity = ref(8)       // scale factor / iteration limit
const density = ref(1200)       // particle count / circle count

const colorPresets = [
  { name: 'neon', label: 'Indigo Neon', emoji: '🌌' },
  { name: 'fire', label: 'Magma Glow', emoji: '🔥' },
  { name: 'ice', label: 'Glacial Ice', emoji: '❄️' },
  { name: 'rainbow', label: 'Spectrum', emoji: '🌈' },
]

// Simple seeded LCG pseudorandom number generator
let seedVal = 0
const setSeed = (seedStr: string) => {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash)
  }
  seedVal = Math.abs(hash)
}

const random = () => {
  const x = Math.sin(seedVal++) * 10000
  return x - Math.floor(x)
}

const randomizeSeed = () => {
  haptics.toggle()
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  seedInput.value = result
  generateNew()
}

// Color palettes helper based on presets
const getColorFromPalette = (t: number) => {
  switch (colorPreset.value) {
    case 'fire':
      // Red, Orange, Amber gradient
      return `hsla(${t * 40 + 5}, 95%, ${40 + t * 45}%, 0.15)`
    case 'ice':
      // Blue, Cyan, Teal gradient
      return `hsla(${180 + t * 50}, 90%, ${45 + t * 35}%, 0.15)`
    case 'rainbow':
      // Full Spectrum wheel
      return `hsla(${t * 360}, 85%, 60%, 0.15)`
    case 'neon':
    default:
      // Indigo to Hot Pink gradient
      return `hsla(${240 + t * 80}, 90%, 65%, 0.15)`
  }
}

// 1. Flow Field (Perlin Noise simulated using Sine/Cosine harmonics)
const drawFlowField = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  setSeed(activeSeed.value)
  ctx.fillStyle = '#050508'
  ctx.fillRect(0, 0, w, h)

  const count = density.value
  const numSteps = 120 + complexity.value * 25

  // Generate initial particle points
  const points = Array.from({ length: count }, () => ({
    x: random() * w,
    y: random() * h,
    age: 0
  }))

  ctx.lineWidth = 1.0
  
  for (let step = 0; step < numSteps; step++) {
    points.forEach((p) => {
      // Calculate angle from simulated vector noise field
      const noiseX = p.x * 0.003 * (complexity.value * 0.25)
      const noiseY = p.y * 0.003 * (complexity.value * 0.25)

      // Vektor fields math
      const angle = (Math.sin(noiseX) + Math.cos(noiseY)) * Math.PI * 2.0

      const nextX = p.x + Math.cos(angle) * 3.5
      const nextY = p.y + Math.sin(angle) * 3.5

      // Draw vector segment
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(nextX, nextY)
      
      const colorRatio = (p.x / w + p.y / h) * 0.5
      ctx.strokeStyle = getColorFromPalette(colorRatio)
      ctx.stroke()

      // Wrap boundary
      p.x = nextX < 0 ? w : nextX > w ? 0 : nextX
      p.y = nextY < 0 ? h : nextY > h ? 0 : nextY
    })
  }
}

// 2. Harmonograph Orbit (Parametric Sine orbits with decay)
const drawSpirograph = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  setSeed(activeSeed.value)
  ctx.fillStyle = '#050508'
  ctx.fillRect(0, 0, w, h)

  const steps = density.value * 4
  const cx = w / 2
  const cy = h / 2

  // Generate harmonograph frequency/amplitude parameters from seed
  const f1 = Math.floor(random() * 5) + 1
  const f2 = Math.floor(random() * 5) + 1
  const f3 = Math.floor(random() * 5) + 1
  const f4 = Math.floor(random() * 5) + 1

  const d1 = random() * 0.001
  const d2 = random() * 0.001
  const d3 = random() * 0.001
  const d4 = random() * 0.001

  const p1 = random() * Math.PI * 2
  const p2 = random() * Math.PI * 2
  const p3 = random() * Math.PI * 2
  const p4 = random() * Math.PI * 2

  const rMax = Math.min(w, h) * 0.42

  ctx.lineWidth = 1.0
  ctx.beginPath()

  for (let t = 0; t < steps; t++) {
    const time = t * 0.006

    // Harmonograph equations
    const x = Math.sin(f1 * time + p1) * Math.exp(-d1 * time) + Math.sin(f2 * time + p2) * Math.exp(-d2 * time)
    const y = Math.sin(f3 * time + p3) * Math.exp(-d3 * time) + Math.sin(f4 * time + p4) * Math.exp(-d4 * time)

    const drawX = cx + (x / 2) * rMax
    const drawY = cy + (y / 2) * rMax

    if (t === 0) {
      ctx.moveTo(drawX, drawY)
    } else {
      ctx.lineTo(drawX, drawY)
    }

    // Draw segment in chunks to vary stroke style coloring
    if (t % 200 === 0) {
      ctx.strokeStyle = getColorFromPalette(t / steps)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(drawX, drawY)
    }
  }
  ctx.strokeStyle = getColorFromPalette(1.0)
  ctx.stroke()
}

// 3. Recursive Fractal Tree (L-System branching)
const drawFractalTree = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  setSeed(activeSeed.value)
  ctx.fillStyle = '#050508'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const startY = h - 60
  
  // Custom branch parameters from seed
  const maxDepth = Math.min(12, complexity.value)
  const baseLength = Math.min(w, h) * 0.2
  const angleSpread = 0.3 + random() * 0.6 // radians

  ctx.shadowColor = 'rgba(99, 102, 241, 0.2)'
  ctx.shadowBlur = 10

  const drawBranch = (x1: number, y1: number, length: number, angle: number, depth: number) => {
    if (depth > maxDepth) return

    const x2 = x1 + Math.cos(angle) * length
    const y2 = y1 + Math.sin(angle) * length

    // Draw line segment
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    
    // Line width gets thinner at branches
    ctx.lineWidth = Math.max(1, maxDepth - depth)
    ctx.strokeStyle = getColorFromPalette(depth / maxDepth)
    ctx.stroke()

    // Randomize slight variations based on seed
    const l1 = length * (0.7 + random() * 0.15)
    const l2 = length * (0.7 + random() * 0.15)

    const a1 = angle - angleSpread + (random() - 0.5) * 0.1
    const a2 = angle + angleSpread + (random() - 0.5) * 0.1

    // Recurse branch splits
    drawBranch(x2, y2, l1, a1, depth + 1)
    drawBranch(x2, y2, l2, a2, depth + 1)
  }

  // Draw core trunk
  drawBranch(cx, startY, baseLength, -Math.PI / 2, 1)
  ctx.shadowBlur = 0 // reset shadow
}

const generateNew = () => {
  const canvas = canvasEl.value
  const ctx2d = canvas?.getContext('2d')
  if (!canvas || !ctx2d) return

  activeSeed.value = seedInput.value.trim() || 'PLAYWITHME'
  haptics.toggle()

  const w = canvas.width
  const h = canvas.height

  if (selectedAlgo.value === 'spirograph') {
    drawSpirograph(ctx2d, w, h)
  } else if (selectedAlgo.value === 'fractal') {
    drawFractalTree(ctx2d, w, h)
  } else {
    drawFlowField(ctx2d, w, h)
  }
}

const shareSeed = () => {
  haptics.success()
  const link = `${window.location.origin}${window.location.pathname}?seed=${activeSeed.value}`
  navigator.clipboard.writeText(link)
  alert(`Share link copied: ${activeSeed.value}`)
}

const downloadArt = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  haptics.success()

  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `generative-art-${activeSeed.value}-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}

const handleResize = () => {
  const canvas = canvasEl.value
  if (!canvas) return

  const containerW = window.innerWidth
  const containerH = window.innerHeight

  // Generate high resolution canvas bounding container
  const size = Math.min(containerW, containerH) * 0.8
  canvas.width = size
  canvas.height = size

  generateNew()
}

onMounted(() => {
  // Read seed from URL if present
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const seedParam = urlParams.get('seed')
    if (seedParam) {
      seedInput.value = seedParam
    }
  }

  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
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
