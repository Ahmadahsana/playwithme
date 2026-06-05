<template>
  <div class="absolute inset-0 pointer-events-auto" @pointermove="onPointerMove" @pointerleave="onPointerLeave" @click="onClick">
    <canvas ref="canvasEl" class="w-full h-full block" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useCanvas } from '~/composables/useCanvas'
import { useAnimationFrame } from '~/composables/useAnimationFrame'
import { useAppStore } from '~/stores'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const store = useAppStore()

const { ctx, width, height, initCanvas } = useCanvas(canvasEl)
const { start } = useAnimationFrame()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  baseAlpha: number
  isClickBurst?: boolean
  life?: number // for click particles
}

const particles = ref<Particle[]>([])
const mouse = ref<{ x: number; y: number } | null>(null)

// Brand colors matching the OKLCH theme in main.css
const colors = [
  'rgba(99, 102, 241, 0.45)',  // Indigo
  'rgba(217, 70, 239, 0.45)',  // Magenta
  'rgba(6, 182, 212, 0.45)',   // Cyan
  'rgba(245, 158, 11, 0.45)'    // Gold/Amber
]

const getParticleCount = () => {
  switch (store.particleQuality) {
    case 'low': return 60
    case 'medium': return 120
    case 'high':
    default:
      return 180
  }
}

const createParticles = () => {
  const count = getParticleCount()
  const w = width.value || window.innerWidth
  const h = height.value || window.innerHeight
  
  particles.value = Array.from({ length: count }, () => {
    const radius = Math.random() * 2 + 1.2
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 24, // velocity in pixels/second
      vy: (Math.random() - 0.5) * 24,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3
    }
  })
}

const onPointerMove = (e: PointerEvent) => {
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouse.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

const onPointerLeave = () => {
  mouse.value = null
}

const onClick = (e: PointerEvent) => {
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  // Spawn 20 burst particles at click coordinates
  const burstCount = 20
  for (let i = 0; i < burstCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 80 + 40 // pixels/second
    particles.value.push({
      x: clickX,
      y: clickY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 3 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1.0,
      baseAlpha: 1.0,
      isClickBurst: true,
      life: 1.0 // 100% life, decays over time
    })
  }
}

const updateAndRender = (deltaTime: number) => {
  const c = ctx.value
  const w = width.value
  const h = height.value
  if (!c || w === 0 || h === 0) return

  // Clear canvas
  c.clearRect(0, 0, w, h)

  const activeParticles = particles.value
  const activeMouse = mouse.value

  // 1. Update and Draw Particles
  particles.value = activeParticles.filter((p) => {
    // Decay and remove burst particles
    if (p.isClickBurst) {
      if (p.life === undefined) p.life = 1.0
      p.life -= deltaTime * 1.5 // fades out completely in ~0.66s
      if (p.life <= 0) return false
      p.alpha = p.life
    }

    // Apply velocities (scaled by deltaTime for refresh rate consistency)
    p.x += p.vx * deltaTime
    p.y += p.vy * deltaTime

    // Interactive Attraction / Repulsion (repel away from cursor slightly)
    if (activeMouse) {
      const dx = p.x - activeMouse.x
      const dy = p.y - activeMouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const forceDist = 120 // area of influence

      if (dist < forceDist) {
        const force = (forceDist - dist) / forceDist
        const forcePower = 12 // pixels/second force
        // Push particles away from mouse
        p.x += (dx / dist) * forcePower * force * deltaTime * 10
        p.y += (dy / dist) * forcePower * force * deltaTime * 10
      }
    }

    // Bounce off walls
    const bounceBorder = 2
    if (p.x < bounceBorder || p.x > w - bounceBorder) {
      p.vx = -p.vx
      p.x = Math.max(bounceBorder, Math.min(w - bounceBorder, p.x))
    }
    if (p.y < bounceBorder || p.y > h - bounceBorder) {
      p.vy = -p.vy
      p.y = Math.max(bounceBorder, Math.min(h - bounceBorder, p.y))
    }

    // Draw particle dot
    c.beginPath()
    c.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    c.fillStyle = p.color.replace('0.45', String(p.alpha))
    c.fill()

    return true
  })

  // 2. Draw Constellation lines between close particles
  const len = particles.value.length
  const maxDistance = 90

  for (let i = 0; i < len; i++) {
    const pi = particles.value[i]
    for (let j = i + 1; j < len; j++) {
      const pj = particles.value[j]

      // Do not connect click burst particles to prevent clutter
      if (pi.isClickBurst || pj.isClickBurst) continue

      const dx = pi.x - pj.x
      const dy = pi.y - pj.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < maxDistance) {
        // Draw line with opacity based on distance (closer = more opaque)
        const alpha = (1 - dist / maxDistance) * 0.15
        c.beginPath()
        c.moveTo(pi.x, pi.y)
        c.lineTo(pj.x, pj.y)
        c.strokeStyle = `rgba(99, 102, 241, ${alpha})` // Brand primary color hue
        c.lineWidth = 0.8
        c.stroke()
      }
    }

    // Draw line from mouse to close particles
    if (activeMouse && !pi.isClickBurst) {
      const dx = pi.x - activeMouse.x
      const dy = pi.y - activeMouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxMouseDist = 140

      if (dist < maxMouseDist) {
        const alpha = (1 - dist / maxMouseDist) * 0.22
        c.beginPath()
        c.moveTo(pi.x, pi.y)
        c.lineTo(activeMouse.x, activeMouse.y)
        c.strokeStyle = `rgba(217, 70, 239, ${alpha})` // Accent pink color hue
        c.lineWidth = 1.0
        c.stroke()
      }
    }
  }
}

onMounted(() => {
  // Initialize canvas context
  initCanvas(() => {
    // Callback when canvas resizes
    if (particles.value.length === 0) {
      createParticles()
    } else {
      // Re-constrain particles inside new bounds
      const w = width.value
      const h = height.value
      particles.value.forEach(p => {
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))
      })
    }
  })

  // Create initial particles
  createParticles()

  // Start Animation Frame loop
  start((deltaTime) => {
    updateAndRender(deltaTime)
  })
})

// Re-create particles if store settings change
watch(() => store.particleQuality, () => {
  createParticles()
})
</script>
