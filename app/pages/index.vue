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

      <!-- 3D Parallax Title Section -->
      <div class="w-full flex flex-col items-center mb-16 select-none">
        <!-- Title + ASCII portrait side by side on wide screens, stacked below that -->
        <div class="w-full flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-14">
          <Portal3DText size-class="text-6xl sm:text-7xl lg:text-8xl" />
          <AsciiPortrait
            src="/avatar.png"
            :size="240"
            caption="ascii · ahmad ahsan"
            class="animate-fade-in"
          />
        </div>

        <p class="max-w-xl text-center text-base sm:text-lg text-surface-400 leading-relaxed mt-4 animate-fade-in tracking-wide">
          {{ profile.tagline }}
        </p>

        <!-- Owner Identity Card -->
        <NuxtLink
          to="/about"
          class="group mt-6 inline-flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500/40 backdrop-blur-md transition-all duration-300 animate-fade-in"
        >
          <span class="relative w-9 h-9 rounded-full p-px bg-linear-to-tr from-brand-500 via-accent-500 to-cyan-500 shrink-0">
            <img
              src="/avatar.png"
              alt="Foto Ahmad Ahsan"
              class="w-full h-full rounded-full object-cover bg-surface-900"
            />
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-surface-950" aria-hidden="true" />
          </span>
          <span class="flex flex-col leading-tight text-left">
            <span class="text-sm font-semibold text-white">{{ profile.name }}</span>
            <span class="text-[11px] text-surface-400 group-hover:text-brand-300 transition-colors">{{ profile.roleShort }} · Lihat profil →</span>
          </span>
        </NuxtLink>
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

    <!-- 5. Floating Settings Dock — sticky di kanan bawah -->
    <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 select-none">
      <!-- Audio Toggle (Guidelines #3 & useAudio) -->
      <PressableBtn
        @click="store.toggleAudio(); store.saveAudioToStorage()"
        class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-900/85 border border-white/10 hover:bg-surface-800/85 hover:border-white/20 text-xs font-medium backdrop-blur-md shadow-lg shadow-black/40 transition-all duration-300"
        id="audio-toggle-btn"
        :aria-label="store.audioEnabled ? 'Matikan suara ambient' : 'Nyalakan suara ambient'"
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
      <div class="flex items-center gap-1.5 rounded-xl bg-surface-900/85 border border-white/10 p-1 backdrop-blur-md shadow-lg shadow-black/40">
        <span class="text-[10px] text-surface-400 uppercase tracking-wider pl-1.5 hidden sm:inline">Partikel</span>
        <div class="flex items-center gap-0.5">
          <button
            v-for="q in ['low', 'medium', 'high']"
            :key="q"
            @click="store.setParticleQuality(q as any); store.saveQualityToStorage()"
            class="px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-300"
            :class="store.particleQuality === q ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-surface-400 hover:text-white'"
          >
            {{ q }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores'
import { useAudio } from '~/composables/useAudio'
import { profile } from '~/data/profile'
import HeroCanvas from '~/components/portal/HeroCanvas.vue'
import Portal3DText from '~/components/portal/Portal3DText.vue'
import AsciiPortrait from '~/components/portal/AsciiPortrait.vue'
import PlaygroundCard from '~/components/portal/PlaygroundCard.vue'

useSeoMeta({
  title: `${profile.name} — PlayWithMe | Portfolio Web Interaktif`,
  description: `Portfolio interaktif ${profile.name}, ${profile.role} asal ${profile.location}. Taman bermain web untuk mengeksplorasi batas kemampuan browser secara real-time. Dibuat dengan Nuxt 4 dan Tailwind CSS 4.`,
  ogTitle: `${profile.name} — PlayWithMe | Portfolio Web Interaktif`,
  ogDescription: `Portfolio interaktif ${profile.name}: eksperimen Canvas, WebGL, Web Audio, dan fisika real-time di browser.`,
  ogImage: '/avatar.png',
  twitterCard: 'summary',
})

const store = useAppStore()
// Initialize Audio Synthesis Composable
useAudio()

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
</style>
