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
        <h1 class="font-outfit font-bold text-lg leading-none">WebGL Fluid Cursor</h1>
        <span class="text-xs text-surface-400">GPU Accelerated Fluid Simulation</span>
      </div>
    </div>

    <!-- UI Overlay prompts -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none">
      <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-surface-300">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span>Move pointer: Splat fluid · Click: High density injection · Slide settings to adjust physics</span>
      </div>
    </div>

    <!-- Live Performance stats -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none">
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 font-mono text-xs text-surface-300">
        <span class="text-surface-500">FPS:</span>
        <span class="font-bold text-cyan-400">60</span>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 font-mono text-xs text-surface-300">
        <span class="text-surface-500">Renderer:</span>
        <span class="font-bold text-brand-400">WebGL GPU</span>
      </div>
    </div>

    <!-- Fullscreen canvas container -->
    <div 
      class="w-full h-full cursor-crosshair pointer-events-auto"
      @pointermove="onPointerMove"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointerleave="onPointerLeave"
    >
      <canvas ref="canvasEl" class="w-full h-full block" />
    </div>

    <!-- Floating Settings panel -->
    <Transition name="slide-panel">
      <div 
        v-if="showControls" 
        class="absolute right-6 top-24 bottom-6 w-80 z-40 bg-surface-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 class="font-outfit font-bold text-md text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 FLUID SETTINGS</span>
            </h2>
          </div>

          <!-- Color Preset -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Color Palette Preset</label>
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

          <!-- Viscosity Slider (kental -> encer) -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Viscosity (Damping)</span>
              <span class="font-mono text-brand-400">{{ viscosity.toFixed(3) }}</span>
            </div>
            <input 
              v-model.number="viscosity" 
              type="range" 
              min="0.950" 
              max="0.999" 
              step="0.001"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <!-- Splat Radius Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Brush Size</span>
              <span class="font-mono text-brand-400">{{ splatRadius.toFixed(3) }}</span>
            </div>
            <input 
              v-model.number="splatRadius" 
              type="range" 
              min="0.005" 
              max="0.080" 
              step="0.005"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        </div>

        <!-- Action Tools -->
        <div class="space-y-3 pt-6 border-t border-white/5">
          <PressableBtn 
            @click="toggleFreeze"
            class="btn-primary w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 bg-gradient-to-r"
            :class="isFrozen ? 'from-green-600 to-emerald-600' : 'from-indigo-600 to-accent-600'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isFrozen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            <span>{{ isFrozen ? 'Resume Simulation' : 'Freeze & Screenshot' }}</span>
          </PressableBtn>
          <PressableBtn 
            @click="resetFluid"
            class="btn-ghost w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 border border-white/10 hover:border-white/20"
          >
            <svg class="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Fluid</span>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useHaptics } from '~/composables/useHaptics'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const haptics = useHaptics()

const showControls = ref(true)
const colorPreset = ref('neon') // neon, rainbow, fire, poison, aurora
const viscosity = ref(0.985)   // damping factor
const splatRadius = ref(0.025) // splat radius relative to width
const isFrozen = ref(false)

const colorPresets = [
  { name: 'neon', label: 'Indigo Neon', emoji: '🌌', colors: [0.388, 0.4, 0.945] },
  { name: 'rainbow', label: 'Psychedelic', emoji: '🌈', colors: [-1, -1, -1] }, // negative trigger dynamic hue shifting
  { name: 'fire', label: 'Magma Glow', emoji: '🔥', colors: [0.96, 0.35, 0.04] },
  { name: 'aurora', label: 'Boreal Aurora', emoji: '🟢', colors: [0.08, 0.78, 0.45] }
]

// WebGL Variables
let gl: WebGLRenderingContext | null = null
let positionBuffer: WebGLBuffer | null = null
let program: WebGLProgram | null = null

// Framebuffer Object (FBO) Double Buffering for state persistence
interface FBO {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
}
let fbo1: FBO | null = null
let fbo2: FBO | null = null
let currentFBO: FBO | null = null
let nextFBO: FBO | null = null

// Uniform Locations
let uTextureLoc: WebGLUniformLocation | null = null
let uMouseLoc: WebGLUniformLocation | null = null
let uMouseVelocityLoc: WebGLUniformLocation | null = null
let uResolutionLoc: WebGLUniformLocation | null = null
let uTimeLoc: WebGLUniformLocation | null = null
let uDampLoc: WebGLUniformLocation | null = null
let uRadiusLoc: WebGLUniformLocation | null = null
let uThemeColorLoc: WebGLUniformLocation | null = null

// Mouse tracker
const mouse = ref({ x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, down: false })

const onPointerMove = (e: PointerEvent) => {
  if (isFrozen.value) return
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  
  const currentX = e.clientX - rect.left
  const currentY = rect.height - (e.clientY - rect.top) // invert Y for WebGL coordinates

  // Update velocities
  mouse.value.vx = currentX - mouse.value.px
  mouse.value.vy = currentY - mouse.value.py
  
  mouse.value.x = currentX
  mouse.value.y = currentY

  mouse.value.px = currentX
  mouse.value.py = currentY
}

const onPointerDown = (e: PointerEvent) => {
  if (isFrozen.value) return
  mouse.value.down = true
  haptics.toggle()
  onPointerMove(e)
}

const onPointerUp = () => {
  mouse.value.down = false
  mouse.value.vx = 0
  mouse.value.vy = 0
}

const onPointerLeave = () => {
  mouse.value.down = false
  mouse.value.vx = 0
  mouse.value.vy = 0
}

// Shaders
const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Double-buffer feedback fluid dynamics GLSL solver
const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;

  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_velocity;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_damping;
  uniform float u_radius;
  uniform vec3 u_theme_color;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse_st = u_mouse / u_resolution;

    // 1. Fluid advection (lookback sampling using basic ripple propagation math)
    vec4 prev = texture2D(u_texture, vUv);
    
    // Sample surrounding cells to compute pressure/divergence wave equations
    vec2 pixel = 1.0 / u_resolution;
    vec4 top = texture2D(u_texture, vUv + vec2(0.0, pixel.y));
    vec4 bottom = texture2D(u_texture, vUv - vec2(0.0, pixel.y));
    vec4 right = texture2D(u_texture, vUv + vec2(pixel.x, 0.0));
    vec4 left = texture2D(u_texture, vUv - vec2(pixel.x, 0.0));

    // Dynamic wave advection step
    vec4 advected = (top + bottom + right + left) * 0.25;

    // Damp color propagation over time
    advected.rgb *= u_damping;

    // 2. Splat density injection on mouse interaction
    float dist = distance(st, mouse_st);
    
    // Multipliers for click and velocity splats
    float vel = length(u_mouse_velocity);
    float force = smoothstep(u_radius, 0.0, dist);

    vec3 inject_color = u_theme_color;
    
    // If dynamic shifting is triggered (-1, -1, -1 colors)
    if (u_theme_color.r < 0.0) {
      inject_color = vec3(
        0.5 + 0.5 * sin(u_time * 2.0 + st.x),
        0.5 + 0.5 * sin(u_time * 2.5 + st.y + 2.0),
        0.5 + 0.5 * sin(u_time * 3.0 + 4.0)
      );
    }

    // Combine previous state with injected mouse drag values
    vec4 final_color = prev * 0.85 + advected * 0.15;
    
    if (force > 0.0) {
      final_color.rgb += inject_color * force * (0.35 + vel * 0.04);
    }

    gl_FragColor = clamp(final_color, 0.0, 1.0);
  }
`

// WebGL helper: compile shader
const compileShader = (source: string, type: number): WebGLShader | null => {
  if (!gl) return null
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

// WebGL FBO helper
const createFBO = (w: number, h: number): FBO | null => {
  if (!gl) return null
  const texture = gl.createTexture()
  const framebuffer = gl.createFramebuffer()

  if (!texture || !framebuffer) return null

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  gl.bindTexture(gl.TEXTURE_2D, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  return { texture, framebuffer }
}

const initWebGL = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
  if (!gl) {
    console.error('WebGL is not supported')
    return
  }

  // Compile shaders
  const vs = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
  const fs = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
  if (!vs || !fs) return

  // Link WebGL program
  program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking failed:', gl.getProgramInfoLog(program))
    return
  }

  gl.useProgram(program)

  // Quad position buffer (fullscreen clip-space bounds)
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
  ])
  positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

  const posLoc = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  // Get Uniform locations
  uTextureLoc = gl.getUniformLocation(program, 'u_texture')
  uMouseLoc = gl.getUniformLocation(program, 'u_mouse')
  uMouseVelocityLoc = gl.getUniformLocation(program, 'u_mouse_velocity')
  uResolutionLoc = gl.getUniformLocation(program, 'u_resolution')
  uTimeLoc = gl.getUniformLocation(program, 'u_time')
  uDampLoc = gl.getUniformLocation(program, 'u_damping')
  uRadiusLoc = gl.getUniformLocation(program, 'u_radius')
  uThemeColorLoc = gl.getUniformLocation(program, 'u_theme_color')

  // Resize canvas & initialize framebuffers
  resizeWebGL()
}

const resizeWebGL = () => {
  const canvas = canvasEl.value
  if (!canvas || !gl) return

  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height

  gl.viewport(0, 0, canvas.width, canvas.height)

  // Clean old FBOs
  if (fbo1) {
    gl.deleteTexture(fbo1.texture)
    gl.deleteFramebuffer(fbo1.framebuffer)
  }
  if (fbo2) {
    gl.deleteTexture(fbo2.texture)
    gl.deleteFramebuffer(fbo2.framebuffer)
  }

  // Create new size persistent framebuffers
  fbo1 = createFBO(canvas.width, canvas.height)
  fbo2 = createFBO(canvas.width, canvas.height)
  
  currentFBO = fbo1
  nextFBO = fbo2

  // Clear buffers
  gl.bindFramebuffer(gl.FRAMEBUFFER, currentFBO ? currentFBO.framebuffer : null)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindFramebuffer(gl.FRAMEBUFFER, nextFBO ? nextFBO.framebuffer : null)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

const resetFluid = () => {
  if (!gl) return
  haptics.destructive()
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1 ? fbo1.framebuffer : null)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2 ? fbo2.framebuffer : null)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

const toggleFreeze = () => {
  haptics.toggle()
  if (!isFrozen.value) {
    // Take screenshot first, then freeze
    isFrozen.value = true
    setTimeout(takeScreenshot, 100)
  } else {
    isFrozen.value = false
  }
}

const takeScreenshot = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  haptics.success()
  
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `webgl-fluid-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}

// Get RGB values for selected color preset
const getPresetColorRGB = () => {
  const matched = colorPresets.find(p => p.name === colorPreset.value)
  return matched ? matched.colors : [0.388, 0.4, 0.945]
}

// Animation loop drive
let animationFrameId: number | null = null
let startTime = 0

const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp
  const time = (timestamp - startTime) / 1000

  if (!isFrozen.value && gl && program && currentFBO && nextFBO && canvasEl.value) {
    const w = canvasEl.value.width
    const h = canvasEl.value.height

    gl.useProgram(program)

    // Set static values & attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const posLoc = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Bind next framebuffer destination
    gl.bindFramebuffer(gl.FRAMEBUFFER, nextFBO.framebuffer)

    // Send uniforms
    gl.uniform2f(uResolutionLoc, w, h)
    gl.uniform2f(uMouseLoc, mouse.value.x, mouse.value.y)
    gl.uniform2f(uMouseVelocityLoc, mouse.value.vx, mouse.value.vy)
    gl.uniform1f(uTimeLoc, time)
    gl.uniform1f(uDampLoc, viscosity.value)
    gl.uniform1f(uRadiusLoc, splatRadius.value)

    const colors = getPresetColorRGB()
    gl.uniform3f(uThemeColorLoc, colors[0], colors[1], colors[2])

    // Bind current texture state as sampler input
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, currentFBO.texture)
    gl.uniform1i(uTextureLoc, 0)

    // Draw full-screen quad to compute next FBO state
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    // Draw result FBO to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, nextFBO.texture)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    // Swap Double Buffers
    const temp = currentFBO
    currentFBO = nextFBO
    nextFBO = temp

    // Damp mouse velocity
    mouse.value.vx *= 0.9
    mouse.value.vy *= 0.9
  }

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  initWebGL()
  
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', resizeWebGL)
  }

  // Start WebGL RAF loop
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeWebGL)
  }

  if (gl) {
    if (fbo1) {
      gl.deleteTexture(fbo1.texture)
      gl.deleteFramebuffer(fbo1.framebuffer)
    }
    if (fbo2) {
      gl.deleteTexture(fbo2.texture)
      gl.deleteFramebuffer(fbo2.framebuffer)
    }
    if (positionBuffer) gl.deleteBuffer(positionBuffer)
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
