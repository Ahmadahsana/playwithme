<template>
  <div class="relative min-h-screen overflow-hidden bg-surface-950 text-white font-inter">
    <!-- 1. Interactive Particle Background -->
    <HeroCanvas />

    <!-- 2. Scanline & Film Grain Overlay (Subtle CRT Retro Vibe) -->
    <div class="absolute inset-0 scanline-overlay pointer-events-none z-30" />
    <div class="absolute inset-0 noise-texture pointer-events-none z-30 opacity-40" />

    <!-- 3. Ambient Glow Orbs -->
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
    <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

    <!-- 4. Main Portal Content -->
    <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 flex flex-col items-center">
      
      <!-- Top Actions Bar (Audio and Graphic Quality Settings) -->
      <div class="w-full flex items-center justify-between gap-4 mb-8 sm:mb-12">
        <!-- Audio Toggle (Guidelines #3 & useAudio) -->
        <PressableBtn
          @click="store.toggleAudio(); store.saveAudioToStorage()"
          class="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-sm font-medium backdrop-blur-md transition-all duration-300"
          id="audio-toggle-btn"
        >
          <IconCrossFade :state-key="store.audioEnabled">
            <!-- Mute Icon (Crossfade) -->
            <svg v-if="!store.audioEnabled" class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <!-- Audio Playing Icon (Crossfade) -->
            <svg v-else class="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </IconCrossFade>
          <span class="hidden sm:inline transition-colors" :class="store.audioEnabled ? 'text-accent-400' : 'text-surface-300'">
            {{ store.audioEnabled ? 'Sound ON' : 'Sound OFF' }}
          </span>
        </PressableBtn>

        <!-- Particle Quality Selector -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-surface-400 hidden md:inline">Particles:</span>
          <div class="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5 backdrop-blur-md">
            <button
              v-for="q in ['low', 'medium', 'high']"
              :key="q"
              @click="store.setParticleQuality(q as any); store.saveQualityToStorage()"
              class="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              :class="store.particleQuality === q ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-surface-400 hover:text-white'"
            >
              {{ q }}
            </button>
          </div>
        </div>
      </div>

      <!-- 3D Parallax Title Section -->
      <div class="w-full flex flex-col items-center mb-16 select-none">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium tracking-wide mb-4 animate-fade-in">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          ✨ PORTFOLIO TAMAN BERMAIN WEB
        </div>
        
        <Portal3DText />

        <p class="max-w-xl text-center text-sm sm:text-base text-surface-400 leading-relaxed mt-4 animate-fade-in">
          Sebuah ruang eksperimen interaktif untuk membuktikan batas maksimal kemampuan web browser secara real-time. Klik salah satu portal di bawah untuk memulai!
        </p>
      </div>

      <!-- Playground Grid -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-0">
        <PlaygroundCard
          v-for="card in cards"
          :key="card.title"
          v-bind="card"
        />
      </div>
    </div>

    <!-- 5. Shimmer Loading Screen Overlay (Guidelines #5b) -->
    <Transition name="fade-overlay">
      <div 
        v-if="isLoading" 
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950 bg-grid"
      >
        <div class="absolute inset-0 noise-texture opacity-30" />
        
        <!-- Loading UI Container -->
        <div class="relative w-full max-w-sm px-6 text-center space-y-6 flex flex-col items-center">
          <!-- Logo Animation -->
          <div class="w-20 h-20 rounded-2xl bg-linear-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-brand-500/30 animate-pulse-glow">
            <span class="text-white font-black text-4xl font-outfit select-none">P</span>
          </div>

          <div class="space-y-2">
            <h2 class="font-outfit font-black text-2xl tracking-wider text-white">PLAYWITHME</h2>
            <p class="text-xs text-brand-400 font-semibold tracking-widest uppercase">Initializing Canvas & Audio Synth...</p>
          </div>

          <!-- Custom Shimmer Progress Bar -->
          <div class="w-full h-1 bg-surface-800 rounded-full overflow-hidden relative border border-white/5">
            <div 
              class="h-full bg-linear-to-r from-brand-500 to-accent-500 transition-all duration-300 ease-out shimmer-progress" 
              :style="{ width: `${progress}%` }"
            />
          </div>
          <span class="text-xs text-surface-400 font-mono">{{ Math.floor(progress) }}%</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '~/stores'
import { useAudio } from '~/composables/useAudio'
import HeroCanvas from '~/components/portal/HeroCanvas.vue'
import Portal3DText from '~/components/portal/Portal3DText.vue'
import PlaygroundCard from '~/components/portal/PlaygroundCard.vue'

useSeoMeta({
  title: 'PlayWithMe — Portfolio Taman Bermain Web',
  description: 'Taman bermain interaktif untuk membuktikan batas maksimal kemampuan web browser secara real-time. Dibuat dengan Nuxt 4 dan Tailwind CSS 4.',
  ogTitle: 'PlayWithMe — Portfolio Taman Bermain Web',
  ogDescription: 'Eksperimen interaktif web browser real-time. Nuxt 4 + Tailwind CSS 4.',
})

const store = useAppStore()
// Initialize Audio Synthesis Composable
useAudio()

const isLoading = ref(true)
const progress = ref(0)

onMounted(() => {
  // Simulate loading sequence up to 100% to let assets load and trigger smooth intro
  const interval = setInterval(() => {
    progress.value += Math.random() * 20 + 8
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 120)
})

const cards = [
  {
    title: '🌌 Particle Galaxy',
    description: 'Ciptakan galaksi partikel tersendiri. Kursor berfungsi sebagai pusat gravitasi interaktif.',
    to: '/playground/galaxy',
    icon: '🌌',
    difficulty: 'Easy',
    tag: 'Popular',
    themeColor: 'indigo'
  },
  {
    title: '🎱 Physics Sandbox',
    description: 'Simulasi tabrakan fisika 2D secara real-time menggunakan Matter.js di dalam browser.',
    to: '/playground/physics',
    icon: '🎱',
    difficulty: 'Medium',
    tag: 'MatterJS',
    themeColor: 'cyan'
  },
  {
    title: '🎨 Generative Art',
    description: 'Hasilkan karya seni abstrak geometris unik berdasarkan algoritma Perlin noise dan seed random.',
    to: '/playground/generative',
    icon: '🎨',
    difficulty: 'Medium',
    tag: 'Custom',
    themeColor: 'gold'
  },
  {
    title: '🎵 Audio Visualizer',
    description: 'Visualisasi musik / mikrofon secara real-time menjadi grafik frekuensi gelombang cahaya.',
    to: '/playground/audio',
    icon: '🎵',
    difficulty: 'Hard',
    tag: 'AudioAPI',
    themeColor: 'pink'
  },
  {
    title: '💻 Matrix Rain',
    description: 'Hujan karakter matrix interaktif yang berinteraksi dengan input ketikan keyboard Anda.',
    to: '/playground/matrix',
    icon: '💻',
    difficulty: 'Easy',
    tag: 'New',
    themeColor: 'indigo'
  },
  {
    title: '🌊 Fluid Cursor',
    description: 'Kursor dengan jejak cairan warna-warni yang mengalir dinamis menggunakan simulasi fluida WebGL.',
    to: '/playground/fluid',
    icon: '🌊',
    difficulty: 'Hard',
    tag: 'WebGL',
    themeColor: 'cyan'
  },
  {
    title: '🐍 Neon Snake',
    description: 'Game ular klasik dengan visual neon bersinar, efek partikel, dan dukungan gamepad.',
    to: '/playground/snake',
    icon: '🐍',
    difficulty: 'Easy',
    tag: 'Classic',
    themeColor: 'gold'
  },
  {
    title: '🃏 3D Card Memory',
    description: 'Uji daya ingat Anda dengan kartu emoji yang dibalik secara 3D dan memiliki spring haptic.',
    to: '/playground/memory',
    icon: '🃏',
    difficulty: 'Easy',
    tag: 'CSS3D',
    themeColor: 'pink'
  }
]
</script>

<style scoped>
/* Scanline overlay styling to mimic CRT monitor */
.scanline-overlay {
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.12) 50%
  );
  background-size: 100% 4px;
  z-index: 28;
}

/* Slide out transition for loading screen overlay */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
              transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-overlay-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.shimmer-progress {
  background-size: 200% 100%;
  animation: barShimmer 1.5s infinite linear;
}

@keyframes barShimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
</style>
