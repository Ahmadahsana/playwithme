<template>
  <div
    class="relative inline-block shrink-0"
    :style="{ width: `${size}px` }"
    aria-hidden="true"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Corner brackets, echoing the avatar frame on /about -->
    <div class="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
    <div class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
    <div class="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
    <div class="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />

    <canvas
      ref="canvasEl"
      class="block w-full rounded-sm"
      :style="{ height: `${canvasHeight}px` }"
    />

    <p
      v-if="caption"
      class="mt-2 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-surface-500"
    >
      {{ caption }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Renders an image as ASCII characters on a canvas, tinted with the site's
 * indigo → magenta → white palette. Rows reveal top-to-bottom on mount and
 * characters near the pointer "glitch" while hovered. Both animations are
 * skipped when the visitor prefers reduced motion.
 */
const props = defineProps({
  src: { type: String, default: '/avatar.png' },
  /** Display width in CSS pixels. Height follows the image's aspect ratio. */
  size: { type: Number, default: 240 },
  /** Character columns. More columns = finer detail, smaller glyphs. */
  cols: { type: Number, default: 64 },
  /** Luminance curve. >1 pushes mid-greys (studio backdrops) toward empty. */
  gamma: { type: Number, default: 3 },
  /** Sparse → dense character ramp. */
  ramp: { type: String, default: ' .:-=+*#%@' },
  /** Fade the corners so the subject stands out from a flat backdrop. */
  vignette: { type: Boolean, default: true },
  caption: { type: String, default: '' },
})

const canvasEl = ref<HTMLCanvasElement | null>(null)
const canvasHeight = ref(props.size) // square placeholder until the image loads

// Monospace glyphs are roughly 0.6× as wide as they are tall.
const CELL_ASPECT = 0.6

let rows = 0
let cellW = 0
let cellH = 0
let levels: Float32Array | null = null // brightness 0..1 per cell
let frameId: number | null = null
let revealStart = 0
let revealDone = false
let reducedMotion = false
let pointer: { x: number; y: number } | null = null
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Brand tint by brightness: dim indigo → indigo → magenta → near-white.
const STOPS: [number, [number, number, number]][] = [
  [0.0, [99, 102, 241]],
  [0.45, [129, 100, 246]],
  [0.75, [217, 70, 239]],
  [1.0, [240, 236, 255]],
]
const colorFor = (v: number, alpha: number) => {
  let i = 0
  while (i < STOPS.length - 2 && v > STOPS[i + 1]![0]) i++
  const [a, ca] = STOPS[i]!
  const [b, cb] = STOPS[i + 1]!
  const t = (v - a) / (b - a)
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t)
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t)
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t)
  return `rgba(${r},${g},${bl},${alpha})`
}

const sampleImage = (img: HTMLImageElement) => {
  const cols = props.cols
  rows = Math.max(1, Math.round(cols * (img.naturalHeight / img.naturalWidth) * CELL_ASPECT))

  const off = document.createElement('canvas')
  off.width = cols
  off.height = rows
  const octx = off.getContext('2d', { willReadFrequently: true })
  if (!octx) return
  octx.imageSmoothingEnabled = true
  octx.imageSmoothingQuality = 'high'
  octx.drawImage(img, 0, 0, cols, rows)
  const { data } = octx.getImageData(0, 0, cols, rows)

  // Raw luminance
  const raw = new Float32Array(cols * rows)
  for (let i = 0; i < cols * rows; i++) {
    const r = data[i * 4]!, g = data[i * 4 + 1]!, b = data[i * 4 + 2]!
    raw[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  }

  // Auto-contrast: stretch between the 1st and 99th percentile.
  const sorted = Array.from(raw).sort((a, b) => a - b)
  const lo = sorted[Math.floor(sorted.length * 0.01)] ?? 0
  const hi = sorted[Math.floor(sorted.length * 0.99)] ?? 1
  const span = Math.max(1e-4, hi - lo)

  levels = new Float32Array(cols * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let v = (raw[y * cols + x]! - lo) / span
      v = Math.min(1, Math.max(0, v))
      if (props.vignette) {
        // Centre slightly above the middle — where a portrait's face sits.
        const dx = (x + 0.5) / cols - 0.5
        const dy = (y + 0.5) / rows - 0.38
        const d = Math.sqrt(dx * dx + dy * dy)
        v *= 1 - smoothstep(0.5, 0.9, d)
      }
      levels[y * cols + x] = Math.pow(v, props.gamma)
    }
  }
}

const setupCanvas = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  cellW = props.size / props.cols
  cellH = cellW / CELL_ASPECT
  canvasHeight.value = Math.round(rows * cellH)

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(props.size * dpr)
  canvas.height = Math.round(rows * cellH * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)
}

const draw = (now: number) => {
  const canvas = canvasEl.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || !levels) return

  const cols = props.cols
  const ramp = props.ramp
  const maxIdx = ramp.length - 1

  // Reveal progress (rows shown), eased.
  let visibleRows = rows
  if (!revealDone) {
    const t = Math.min(1, (now - revealStart) / 900)
    const eased = 1 - Math.pow(1 - t, 3)
    visibleRows = Math.ceil(eased * rows)
    if (t >= 1) revealDone = true
  }

  ctx.clearRect(0, 0, props.size, rows * cellH)
  ctx.font = `700 ${Math.floor(cellH * 0.95)}px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const glitchRadius = 5 // cells
  for (let y = 0; y < visibleRows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = levels[y * cols + x]!
      if (v < 0.02) continue // empty cell — skip the draw call

      let idx = Math.round(v * maxIdx)
      let alpha = 1
      if (pointer && !reducedMotion) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < glitchRadius) {
          // Scramble nearby glyphs; stronger nearer the pointer.
          const strength = 1 - dist / glitchRadius
          if (Math.random() < strength * 0.8) {
            idx = Math.min(maxIdx, Math.max(1, idx + Math.round((Math.random() - 0.5) * 6)))
          }
          alpha = 0.7 + strength * 0.3
        }
      }

      // The freshly revealed edge glows a touch brighter.
      if (!revealDone && y >= visibleRows - 2) alpha = 1

      ctx.fillStyle = colorFor(v, alpha)
      ctx.fillText(ramp[idx]!, x * cellW + cellW / 2, y * cellH + cellH / 2)
    }
  }
}

const tick = (now: number) => {
  draw(now)
  const animating = !revealDone || (pointer !== null && !reducedMotion)
  frameId = animating ? requestAnimationFrame(tick) : null
}

const kick = () => {
  if (frameId === null) frameId = requestAnimationFrame(tick)
}

const onPointerMove = (e: PointerEvent) => {
  const canvas = canvasEl.value
  if (!canvas || reducedMotion) return
  const rect = canvas.getBoundingClientRect()
  pointer = {
    x: (e.clientX - rect.left) / cellW,
    y: (e.clientY - rect.top) / cellH,
  }
  if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null }
  kick()
}

const onPointerLeave = () => {
  // Let the last scrambled frame settle, then draw the clean portrait once.
  leaveTimer = setTimeout(() => {
    pointer = null
    kick()
  }, 120)
}

let currentImg: HTMLImageElement | null = null

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const img = new Image()
  currentImg = img
  img.decoding = 'async'
  img.onload = () => {
    if (currentImg !== img) return
    sampleImage(img)
    setupCanvas()
    revealStart = performance.now()
    revealDone = reducedMotion
    kick()
  }
  img.onerror = () => {
    // Nothing to render — leave the canvas blank rather than throw.
  }
  img.src = props.src
})

onUnmounted(() => {
  currentImg = null
  if (frameId !== null) cancelAnimationFrame(frameId)
  if (leaveTimer) clearTimeout(leaveTimer)
})
</script>
