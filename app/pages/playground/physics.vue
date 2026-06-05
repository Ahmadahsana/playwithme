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
        <h1 class="font-outfit font-bold text-lg leading-none">Physics Sandbox</h1>
        <span class="text-xs text-surface-400">Matter.js Rigid Body Simulator</span>
      </div>
    </div>

    <!-- User prompts -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none">
      <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-surface-300">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span>Click empty space: Spawn object · Drag objects to throw them · Scroll wheel: Change size</span>
      </div>
    </div>

    <!-- Active bodies counter -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none font-mono text-xs">
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-surface-300">
        <span class="text-surface-500">Objects:</span>
        <span class="font-bold text-amber-400">{{ objectCount }}</span>
      </div>
    </div>

    <!-- MatterJS canvas container -->
    <div 
      ref="canvasContainer" 
      class="w-full h-full block bg-surface-950 pointer-events-auto"
      @click="onCanvasClick"
    />

    <!-- Settings control sidebar -->
    <Transition name="slide-panel">
      <div 
        v-if="showControls" 
        class="absolute right-6 top-24 bottom-6 w-80 z-40 bg-surface-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 class="font-outfit font-bold text-md text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 PHYSICS ENGINE</span>
            </h2>
          </div>

          <!-- Active Shape Picker -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Spawn Shape</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="shape in shapes" 
                :key="shape.name"
                @click="selectedShape = shape.name"
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-2"
                :class="selectedShape === shape.name ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span>{{ shape.emoji }}</span>
                <span>{{ shape.label }}</span>
              </button>
            </div>
          </div>

          <!-- Material Selection -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Material Preset</label>
            <div class="grid grid-cols-3 gap-1.5">
              <button 
                v-for="mat in materials" 
                :key="mat.name"
                @click="selectedMaterial = mat.name"
                class="px-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 text-center"
                :class="selectedMaterial === mat.name ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                {{ mat.label }}
              </button>
            </div>
          </div>

          <!-- Gravity Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">World Gravity</span>
              <span class="font-mono text-brand-400">{{ gravityY }}</span>
            </div>
            <input 
              v-model.number="gravityY" 
              type="range" 
              min="-1.5" 
              max="2.5" 
              step="0.1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              @input="updateGravity"
            />
          </div>

          <!-- Elasticity (Bounce) Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Default Bounce</span>
              <span class="font-mono text-brand-400">{{ defaultRestitution }}</span>
            </div>
            <input 
              v-model.number="defaultRestitution" 
              type="range" 
              min="0.0" 
              max="1.0" 
              step="0.05"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <!-- Size range indicator -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Shape Size</span>
              <span class="font-mono text-brand-400">{{ spawnSize }}px</span>
            </div>
            <input 
              v-model.number="spawnSize" 
              type="range" 
              min="15" 
              max="70" 
              step="1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <!-- Wrecking Ball toggle -->
          <div class="flex items-center justify-between pt-2">
            <span class="text-xs text-surface-400 font-bold uppercase tracking-wider">Spawn Wrecking Ball</span>
            <button 
              @click="toggleWreckingBall"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none"
              :class="hasWreckingBall ? 'bg-brand-500' : 'bg-surface-800'"
            >
              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="hasWreckingBall ? 'translate-x-5' : 'translate-x-0'" />
            </button>
          </div>
        </div>

        <!-- Action Tools -->
        <div class="space-y-3 pt-6 border-t border-white/5">
          <PressableBtn 
            @click="triggerExplosion"
            class="btn-ghost w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 border border-white/10 hover:border-white/20"
          >
            <span>💥 Kinetic Blast</span>
          </PressableBtn>
          <PressableBtn 
            @click="clearShapes"
            class="btn-primary w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 border-none"
          >
            <span>🗑️ Clear Sandbox</span>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Matter from 'matter-js'
import { useHaptics } from '~/composables/useHaptics'

const canvasContainer = ref<HTMLElement | null>(null)
const haptics = useHaptics()

const showControls = ref(true)
const selectedShape = ref('circle') // circle, box, triangle, polygon
const selectedMaterial = ref('normal') // normal, rubber, rock, balloon
const gravityY = ref(1.0)
const defaultRestitution = ref(0.6)
const spawnSize = ref(30)
const hasWreckingBall = ref(false)
const objectCount = ref(0)

const shapes = [
  { name: 'circle', label: 'Sphere', emoji: '⚽' },
  { name: 'box', label: 'Box', emoji: '📦' },
  { name: 'triangle', label: 'Pyramid', emoji: '🔺' },
  { name: 'polygon', label: 'Pentagon', emoji: '💎' },
]

const materials = [
  { name: 'normal', label: 'Standard' },
  { name: 'rubber', label: 'Rubber (Bouncy)' },
  { name: 'rock', label: 'Heavy Rock' },
  { name: 'balloon', label: 'He Balloon' },
]

// MatterJS Core variables
let engine: Matter.Engine
let render: Matter.Render
let runner: Matter.Runner
let mouseConstraint: Matter.MouseConstraint

// Boundaries
let floor: Matter.Body
let ceiling: Matter.Body
let leftWall: Matter.Body
let rightWall: Matter.Body

// Spawner lists
let spawnList: Matter.Body[] = []
let balloonList: Matter.Body[] = []
let wreckingBallBodies: (Matter.Body | Matter.Constraint)[] = []

const updateGravity = () => {
  if (engine) {
    engine.gravity.y = gravityY.value
  }
}

// Spawning on click
const onCanvasClick = (e: MouseEvent) => {
  if (!canvasContainer.value || !engine) return
  
  // Do not spawn if click is on settings sidebar
  const target = e.target as HTMLElement
  if (target.closest('.absolute.right-6')) return

  // Do not spawn if user is active dragging an existing body
  if (mouseConstraint && mouseConstraint.body) return

  const rect = canvasContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  spawnShape(x, y)
}

// MatterJS Spawner Core
const spawnShape = (x: number, y: number) => {
  haptics.toggle()

  const size = spawnSize.value
  let options: Matter.IBodyDefinition = {
    restitution: defaultRestitution.value,
    friction: 0.1,
    density: 0.001
  }

  // Apply Material presets
  let color = '#6366f1' // default indigo
  if (selectedMaterial.value === 'rubber') {
    options.restitution = 0.95
    options.friction = 0.05
    options.density = 0.0008
    color = '#d946ef' // pink
  } else if (selectedMaterial.value === 'rock') {
    options.restitution = 0.05
    options.friction = 0.8
    options.density = 0.015 // very heavy
    color = '#64748b' // grey slate
  } else if (selectedMaterial.value === 'balloon') {
    options.restitution = 0.5
    options.friction = 0.1
    options.density = 0.0004
    color = '#06b6d4' // cyan
  }

  options.render = {
    fillStyle: color,
    strokeStyle: '#ffffff',
    lineWidth: 1
  }

  let body: Matter.Body
  if (selectedShape.value === 'box') {
    body = Matter.Bodies.rectangle(x, y, size * 2, size * 2, options)
  } else if (selectedShape.value === 'triangle') {
    body = Matter.Bodies.polygon(x, y, 3, size * 1.5, options)
  } else if (selectedShape.value === 'polygon') {
    body = Matter.Bodies.polygon(x, y, 5, size * 1.5, options)
  } else {
    // circle
    body = Matter.Bodies.circle(x, y, size, options)
  }

  // Register balloon list for upward float logic
  if (selectedMaterial.value === 'balloon') {
    balloonList.push(body)
  }

  spawnList.push(body)
  Matter.Composite.add(engine.world, body)
  updateCount()
}

// Wrecking Ball creator
const toggleWreckingBall = () => {
  if (!engine) return
  haptics.toggle()

  if (hasWreckingBall.value) {
    // Remove wrecking ball
    Matter.Composite.remove(engine.world, wreckingBallBodies)
    wreckingBallBodies = []
    hasWreckingBall.value = false
  } else {
    // Add wrecking ball
    const w = canvasContainer.value?.clientWidth || window.innerWidth
    const ceilingAnchor = Matter.Bodies.rectangle(w / 2, 40, 60, 20, { 
      isStatic: true, 
      render: { fillStyle: '#1e293b' } 
    })

    const heavyBall = Matter.Bodies.circle(w / 2, 220, 45, { 
      density: 0.08, 
      restitution: 0.4,
      render: { fillStyle: '#f59e0b', strokeStyle: '#ffffff', lineWidth: 1.5 } 
    })

    const rope = Matter.Constraint.create({
      bodyA: ceilingAnchor,
      bodyB: heavyBall,
      stiffness: 0.9,
      render: { strokeStyle: '#f59e0b', lineWidth: 3.5 }
    })

    wreckingBallBodies = [ceilingAnchor, heavyBall, rope]
    Matter.Composite.add(engine.world, wreckingBallBodies)
    hasWreckingBall.value = true
  }
}

// Apply kinetic blast radial force
const triggerExplosion = () => {
  if (spawnList.length === 0) return
  haptics.destructive()

  const w = canvasContainer.value?.clientWidth || window.innerWidth
  const h = canvasContainer.value?.clientHeight || window.innerHeight
  const centerX = w / 2
  const centerY = h / 2

  spawnList.forEach(body => {
    // Distance vector from center
    const dx = body.position.x - centerX
    const dy = body.position.y - centerY
    const dist = Math.sqrt(dx * dx + dy * dy) || 1

    // Apply outward force inversely proportional to distance
    const forceMagnitude = (1.5 / dist) * body.mass * 0.12
    Matter.Body.applyForce(body, body.position, {
      x: (dx / dist) * forceMagnitude,
      y: (dy / dist) * forceMagnitude - 0.08 * body.mass // push upwards too
    })
  })
}

const clearShapes = () => {
  if (!engine) return
  haptics.destructive()

  // Apply outward explosion effect first
  triggerExplosion()

  // Remove from world after short delay
  setTimeout(() => {
    Matter.Composite.remove(engine.world, spawnList)
    spawnList = []
    balloonList = []
    updateCount()
  }, 180)
}

const updateCount = () => {
  objectCount.value = spawnList.length
}

onMounted(() => {
  if (!canvasContainer.value) return

  const w = canvasContainer.value.clientWidth
  const h = canvasContainer.value.clientHeight

  // 1. Setup Matter Engine
  engine = Matter.Engine.create()
  engine.gravity.y = gravityY.value

  // 2. Setup Matter Renderer
  render = Matter.Render.create({
    element: canvasContainer.value,
    engine: engine,
    options: {
      width: w,
      height: h,
      wireframes: false,
      background: 'transparent', // CSS manages page background
      showVelocity: false,
      showAngleIndicator: false
    }
  })
  Matter.Render.run(render)

  // 3. Setup Runner
  runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)

  // 4. Create Boundaries
  const wallOptions = { 
    isStatic: true, 
    render: { fillStyle: 'rgba(255, 255, 255, 0.02)', strokeStyle: 'rgba(255, 255, 255, 0.08)', lineWidth: 1 } 
  }
  
  floor = Matter.Bodies.rectangle(w / 2, h + 25, w + 100, 50, wallOptions)
  ceiling = Matter.Bodies.rectangle(w / 2, -25, w + 100, 50, wallOptions)
  leftWall = Matter.Bodies.rectangle(-25, h / 2, 50, h + 100, wallOptions)
  rightWall = Matter.Bodies.rectangle(w + 25, h / 2, 50, h + 100, wallOptions)

  Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall])

  // 5. Setup Interactive Mouse Constraint
  const mouse = Matter.Mouse.create(render.canvas)
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.15,
      render: { visible: true, strokeStyle: 'rgba(99, 102, 241, 0.45)', lineWidth: 2 }
    }
  })
  Matter.Composite.add(engine.world, mouseConstraint)
  render.mouse = mouse

  // 6. Upward buoyancy logic for helium balloons in tick update
  Matter.Events.on(engine, 'beforeUpdate', () => {
    balloonList.forEach(body => {
      // Apply upward anti-gravity force proportional to mass
      // y-force should overcome default gravity
      const upwardForce = -0.0028 * body.mass * (gravityY.value > 0 ? gravityY.value : 0.5)
      Matter.Body.applyForce(body, body.position, { x: 0, y: upwardForce })
    })
  })

  // Listen to wheel events on mouse constraint to resize the spawn radius
  mouse.element.removeEventListener('mousewheel', (mouse as any).mousewheel)
  mouse.element.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel)

  const handleResize = () => {
    if (!canvasContainer.value || !render) return
    const newW = canvasContainer.value.clientWidth
    const newH = canvasContainer.value.clientHeight
    
    render.options.width = newW
    render.options.height = newH
    render.canvas.width = newW
    render.canvas.height = newH

    // Reposition boundaries
    Matter.Body.setPosition(floor, { x: newW / 2, y: newH + 25 })
    Matter.Body.setPosition(ceiling, { x: newW / 2, y: -25 })
    Matter.Body.setPosition(leftWall, { x: -25, y: newH / 2 })
    Matter.Body.setPosition(rightWall, { x: newW + 25, y: newH / 2 })
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    
    // Stop matter engine
    Matter.Render.stop(render)
    Matter.Runner.stop(runner)
    Matter.World.clear(engine.world, false)
    Matter.Engine.clear(engine)
  })
})
</script>

<style scoped>
/* Custom slider styles */
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
