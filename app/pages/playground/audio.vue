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
        <h1 class="font-outfit font-bold text-lg leading-none">Audio Visualizer</h1>
        <span class="text-xs text-surface-400">Web Audio API Analyser</span>
      </div>
    </div>

    <!-- Active status / Beat detection badge -->
    <div class="absolute top-6 right-6 z-30 flex items-center gap-4 pointer-events-none text-xs font-mono">
      <div 
        class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border transition-colors duration-300"
        :class="isBeat ? 'border-pink-500/50 text-pink-400' : 'border-white/5 text-surface-300'"
      >
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" v-if="isBeat"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
        </span>
        <span>{{ isBeat ? 'BASS BEAT ACTIVE' : 'NO BEAT DETECTED' }}</span>
      </div>
    </div>

    <!-- Background beat ambient glow -->
    <div 
      class="absolute inset-0 bg-radial-gradient z-0 pointer-events-none transition-all duration-150"
      :style="ambientGlowStyle"
    />

    <!-- Main Visualizer Canvas -->
    <div 
      class="w-full h-full block flex items-center justify-center relative z-10 transition-transform duration-75"
      :class="{ 'animate-shake': isBeat }"
    >
      <canvas ref="canvasEl" class="w-full h-full block bg-transparent" />

      <!-- Centered Prompt if not playing -->
      <div 
        v-if="!isActive" 
        class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/35 backdrop-blur-xs pointer-events-none z-20"
      >
        <div class="card-glass max-w-sm p-8 space-y-4 pointer-events-auto">
          <div class="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-3xl mx-auto">
            🎵
          </div>
          <h2 class="font-outfit font-bold text-xl text-white">Mulai Visualisasi</h2>
          <p class="text-xs text-surface-400 leading-relaxed">
            Aktifkan mikrofon atau unggah file musik (.mp3) untuk memulai visualisasi frekuensi audio real-time.
          </p>
          <div class="flex flex-col gap-2 pt-2">
            <PressableBtn @click="requestMicAccess" class="btn-primary justify-center text-xs py-2">
              🎤 Gunakan Mikrofon
            </PressableBtn>
            <label class="btn-ghost justify-center text-xs py-2 cursor-pointer select-none">
              📁 Unggah File Lagu
              <input type="file" accept="audio/*" class="hidden" @change="handleFileUpload" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden audio element for files -->
    <audio ref="audioEl" crossOrigin="anonymous" @ended="onAudioEnded" />

    <!-- Explainer Modal before mic access request (Guidelines #5a) -->
    <PermissionModal
      :is-open="showPermissionModal"
      permission-key="microphone"
      approve-text="Ya, Izinkan Mic"
      decline-text="Batal"
      @approve="grantPermission"
      @decline="declinePermission"
    >
      <template #icon>🎤</template>
      <template #title>Izin Mikrofon Diperlukan</template>
      <template #description>
        Kami memerlukan akses ke mikrofon Anda untuk menganalisis frekuensi suara sekitar dan memvisualisasikannya secara langsung di layar. Suara Anda tidak akan disimpan maupun dikirim ke server manapun.
      </template>
    </PermissionModal>

    <!-- Floating controls panel -->
    <Transition name="slide-panel">
      <div 
        v-if="showControls" 
        class="absolute right-6 top-24 bottom-6 w-80 z-40 bg-surface-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 class="font-outfit font-bold text-md text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 VISUAL SETTINGS</span>
            </h2>
          </div>

          <!-- Active Source Picker -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Audio Source</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="switchSource('mic')"
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center justify-center gap-1.5"
                :class="audioSource === 'mic' ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span>🎤</span>
                <span>Microphone</span>
              </button>
              <label 
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                :class="audioSource === 'file' ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span>📁</span>
                <span>File Audio</span>
                <input type="file" accept="audio/*" class="hidden" @change="handleFileUpload" />
              </label>
            </div>
            <div v-if="audioSource === 'file' && fileName" class="text-[10px] text-brand-400 font-mono truncate max-w-full">
              Playing: {{ fileName }}
            </div>
          </div>

          <!-- Visualization style selector -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Visual Mode</label>
            <select 
              v-model="visualMode"
              class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-500/50"
            >
              <option value="radial" class="bg-surface-900 text-white">💮 Radial Ring Visualizer</option>
              <option value="linear" class="bg-surface-900 text-white">📊 Neon Equalizer Bars</option>
              <option value="wave" class="bg-surface-900 text-white">〰️ Oscilloscope Waveform</option>
            </select>
          </div>

          <!-- Color theme -->
          <div class="space-y-2">
            <label class="text-xs text-surface-400 font-bold uppercase tracking-wider">Visual Palette</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="preset in colorPresets" 
                :key="preset.name"
                @click="colorTheme = preset.name"
                class="px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-2"
                :class="colorTheme === preset.name ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
              >
                <span>{{ preset.emoji }}</span>
                <span>{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <!-- Sensitivity Slider -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-surface-400 font-bold uppercase tracking-wider">Sensitivity</span>
              <span class="font-mono text-brand-400">{{ (sensitivity * 100).toFixed(0) }}%</span>
            </div>
            <input 
              v-model.number="sensitivity" 
              type="range" 
              min="0.2" 
              max="2.5" 
              step="0.1"
              class="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        </div>

        <!-- Action Tools -->
        <div class="space-y-3 pt-6 border-t border-white/5">
          <PressableBtn 
            @click="stopVisualization"
            class="btn-primary w-full justify-center text-xs py-2.5 font-bold flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 border-none"
          >
            <span>🛑 Stop Visualization</span>
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
import { useCanvas } from '~/composables/useCanvas'
import { useAnimationFrame } from '~/composables/useAnimationFrame'
import { useHaptics } from '~/composables/useHaptics'
import PermissionModal from '~/components/ui/PermissionModal.vue'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const audioEl = ref<HTMLAudioElement | null>(null)
const haptics = useHaptics()

const { ctx, width, height, initCanvas } = useCanvas(canvasEl)
const { start } = useAnimationFrame()

const showControls = ref(true)
const isActive = ref(false)
const showPermissionModal = ref(false)
const audioSource = ref<'mic' | 'file'>('mic')
const visualMode = ref('radial') // radial, linear, wave
const colorTheme = ref('pink') // pink, cyan, gold, rainbow
const sensitivity = ref(1.0)
const isBeat = ref(false)
const fileName = ref('')

const colorPresets = [
  { name: 'pink', label: 'Neon Pink', emoji: '🌸' },
  { name: 'cyan', label: 'Liquid Cyan', emoji: '💧' },
  { name: 'gold', label: 'Electric Gold', emoji: '⚡' },
  { name: 'rainbow', label: 'Spectrum', emoji: '🌈' },
]

// Web Audio API Elements
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let sourceNode: MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null = null
let micStream: MediaStream | null = null
let dataArray = new Uint8Array(0)
let bufferLength = 0

// Beat detection variables
let beatThreshold = 180

// Ambient background glow dynamic colors
const ambientGlowStyle = computed(() => {
  if (!isBeat.value) return 'background: radial-gradient(circle 350px at center, rgba(0,0,0,0) 0%, rgba(5,5,8,1) 100%)'
  
  let glowColor = 'rgba(217, 70, 239, 0.08)' // pink
  if (colorTheme.value === 'cyan') glowColor = 'rgba(6, 182, 212, 0.08)'
  else if (colorTheme.value === 'gold') glowColor = 'rgba(245, 158, 11, 0.08)'
  else if (colorTheme.value === 'rainbow') glowColor = 'rgba(99, 102, 241, 0.08)'

  return `background: radial-gradient(circle 450px at center, ${glowColor} 0%, rgba(5,5,8,1) 100%)`
})

const getThemeHSL = (i: number, len: number) => {
  const ratio = i / len
  switch (colorTheme.value) {
    case 'cyan':
      return `hsla(${180 + ratio * 40}, 90%, 55%, 0.8)`
    case 'gold':
      return `hsla(${40 + ratio * 20}, 95%, 55%, 0.8)`
    case 'rainbow':
      return `hsla(${ratio * 360}, 90%, 60%, 0.8)`
    case 'pink':
    default:
      return `hsla(${300 + ratio * 40}, 90%, 60%, 0.8)`
  }
}

// Switching audio sources
const switchSource = (source: 'mic' | 'file') => {
  stopVisualization()
  audioSource.value = source
  if (source === 'mic') {
    requestMicAccess()
  }
}

// Permission management
const requestMicAccess = () => {
  audioSource.value = 'mic'
  showPermissionModal.value = true
}

const grantPermission = async () => {
  showPermissionModal.value = false
  haptics.success()

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    initAudioApi(micStream)
  } catch (e) {
    alert('Akses mikrofon ditolak oleh browser.')
    stopVisualization()
  }
}

const declinePermission = () => {
  showPermissionModal.value = false
  stopVisualization()
}

// File Upload Handler
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !audioEl.value) return

  stopVisualization()
  audioSource.value = 'file'
  fileName.value = file.name
  
  const fileUrl = URL.createObjectURL(file)
  audioEl.value.src = fileUrl
  audioEl.value.load()
  
  initAudioApi(audioEl.value)
  audioEl.value.play()
}

const onAudioEnded = () => {
  stopVisualization()
}

// Audio API initializer
const initAudioApi = (source: MediaStream | HTMLAudioElement) => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return

  audioCtx = new AudioContextClass()
  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 512
  
  bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)

  if (source instanceof MediaStream) {
    sourceNode = audioCtx.createMediaStreamSource(source)
    sourceNode.connect(analyser)
    // Do NOT connect mic to audioContext.destination to avoid feedback squealing loop!
  } else if (source instanceof HTMLAudioElement) {
    sourceNode = audioCtx.createMediaElementSource(source)
    sourceNode.connect(analyser)
    analyser.connect(audioCtx.destination) // Connect file to speaker output
  }

  isActive.value = true
}

const stopVisualization = () => {
  isActive.value = false
  fileName.value = ''
  
  // Stop mic tracks
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop())
    micStream = null
  }

  // Stop audio tag
  if (audioEl.value) {
    audioEl.value.pause()
    audioEl.value.src = ''
  }

  // Disconnect web audio
  if (sourceNode) {
    sourceNode.disconnect()
    sourceNode = null
  }
  if (analyser) {
    analyser.disconnect()
    analyser = null
  }
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
}

// Visualizer draw logic in RAF
const render = () => {
  const c = ctx.value
  const w = width.value
  const h = height.value
  if (!c || w === 0 || h === 0) return

  // Clear Canvas (subtle tail overlay)
  c.fillStyle = 'rgba(5, 5, 8, 0.28)'
  c.fillRect(0, 0, w, h)

  if (!isActive.value || !analyser) return

  // Read data
  if (visualMode.value === 'wave') {
    analyser.getByteTimeDomainData(dataArray)
  } else {
    analyser.getByteFrequencyData(dataArray)
  }

  // 1. Beat detection (Bass frequencies sum)
  let bassSum = 0
  const bassBands = 8 // First 8 frequency bins represent sub-bass/bass
  for (let i = 0; i < bassBands; i++) {
    bassSum += dataArray[i]
  }
  const averageBass = bassSum / bassBands
  const triggerVal = averageBass * sensitivity.value

  if (triggerVal > beatThreshold) {
    if (!isBeat.value) {
      isBeat.value = true
      haptics.success()
    }
  } else {
    isBeat.value = false
  }

  // 2. Render modes
  if (visualMode.value === 'radial') {
    // A. RADIAL CONSTELATIONAL WAVE RING
    const cx = w / 2
    const cy = h / 2
    const baseRadius = Math.min(w, h) * 0.18 + (isBeat.value ? 12 : 0)

    // Outer glow
    c.shadowBlur = isBeat.value ? 25 : 8
    c.shadowColor = getThemeHSL(0.5, 1)

    c.beginPath()
    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 2
      const val = dataArray[i] * 0.65 * sensitivity.value
      
      const r = baseRadius + val
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r

      if (i === 0) {
        c.moveTo(x, y)
      } else {
        c.lineTo(x, y)
      }
    }
    c.closePath()
    c.strokeStyle = getThemeHSL(0.5, 1)
    c.lineWidth = 3.5
    c.stroke()
    c.shadowBlur = 0 // reset

  } else if (visualMode.value === 'linear') {
    // B. NEON EQUALIZER BARS (Left to Right mirrored)
    const barWidth = (w / bufferLength) * 1.5
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const val = dataArray[i] * 1.2 * sensitivity.value
      const barHeight = Math.min(h * 0.7, val)

      c.fillStyle = getThemeHSL(i, bufferLength)
      
      // Draw mirrored bottom bars
      c.fillRect(x, h - barHeight, barWidth - 2, barHeight)
      c.fillRect(w - x - barWidth, h - barHeight, barWidth - 2, barHeight)

      x += barWidth
    }

  } else if (visualMode.value === 'wave') {
    // C. OSCILLOSCOPE TIME DOMAIN WAVEFORM
    c.beginPath()
    c.lineWidth = 3.0
    c.strokeStyle = getThemeHSL(0.5, 1)
    c.shadowColor = getThemeHSL(0.5, 1)
    c.shadowBlur = isBeat.value ? 20 : 6

    const sliceWidth = w / bufferLength
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0 // normalized center
      const y = (v * h) / 2

      if (i === 0) {
        c.moveTo(x, y)
      } else {
        c.lineTo(x, y)
      }

      x += sliceWidth
    }

    c.lineTo(w, h / 2)
    c.stroke()
    c.shadowBlur = 0 // reset
  }
}

onMounted(() => {
  initCanvas(() => {
    // Canvas dimensions automatically handled
  })

  // Start Visualizer Loop
  start(() => {
    render()
  })
})

onUnmounted(() => {
  stopVisualization()
})
</script>

<style scoped>
/* Shake animation triggered on bass beat */
.animate-shake {
  animation: shake 0.1s infinite;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  20% { transform: translate(-1px, -1px) rotate(0.2deg); }
  40% { transform: translate(-1px, 1px) rotate(0deg); }
  60% { transform: translate(1px, -1px) rotate(-0.2deg); }
  80% { transform: translate(-1px, 1px) rotate(0deg); }
  100% { transform: translate(1px, 1px) rotate(0.2deg); }
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
