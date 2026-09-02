<template>
  <div class="relative min-h-screen bg-surface-950 text-white font-inter">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-30 pointer-events-none" />

    <!-- Ambient Glow Orbs -->
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
    <div class="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[90px] pointer-events-none mix-blend-screen" />

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      
      <!-- Back to Home -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors duration-200 mb-8 group"
      >
        <svg class="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Beranda</span>
      </NuxtLink>

      <!-- Page Header -->
      <div class="mb-12">
        <h1 class="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
          Web <span class="text-gradient">Playground</span> Hub
        </h1>
        <p class="text-surface-400 max-w-xl text-sm sm:text-base leading-relaxed">
          Pilih dan mainkan salah satu dari 8 demo eksperimental interaktif untuk menguji batas responsivitas, grafis, dan kemampuan browser Anda.
        </p>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari permainan..."
            class="w-full bg-white/5 border border-white/10 focus:border-brand-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-400 outline-none backdrop-blur-md transition-all duration-300"
          />
        </div>

        <!-- Filter difficulty tags -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            v-for="difficulty in ['Semua', 'Easy', 'Medium', 'Hard']"
            :key="difficulty"
            @click="selectedDifficulty = difficulty"
            class="px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 shrink-0 border"
            :class="selectedDifficulty === difficulty 
              ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' 
              : 'bg-white/5 text-surface-400 border-white/10 hover:text-white'"
          >
            {{ difficulty }}
          </button>
        </div>
      </div>

      <!-- Cards Grid -->
      <div 
        v-if="filteredCards.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <PlaygroundCard
          v-for="card in filteredCards"
          :key="card.title"
          v-bind="card"
        />
      </div>

      <!-- Empty State -->
      <div 
        v-else 
        class="card-glass p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto mt-12 space-y-4"
      >
        <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
          🔍
        </div>
        <h3 class="font-outfit font-bold text-xl text-white">Eksperimen Tidak Ditemukan</h3>
        <p class="text-surface-400 text-xs leading-relaxed">
          Tidak ada demo yang cocok dengan pencarian "{{ searchQuery }}". Coba gunakan kata kunci lain atau bersihkan filter Anda.
        </p>
        <PressableBtn 
          @click="searchQuery = ''; selectedDifficulty = 'Semua'" 
          class="btn-primary px-4! py-2! text-xs! font-semibold"
        >
          Reset Filter
        </PressableBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PlaygroundCard from '~/components/portal/PlaygroundCard.vue'

useSeoMeta({
  title: 'Web Playground Hub — PlayWithMe',
  description: 'Jelajahi galeri eksperimen web interaktif 3D, fisika, audio, dan WebGL di dalam browser Anda.',
})

const searchQuery = ref('')
const selectedDifficulty = ref('Semua')

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
  },
  {
    title: '♟️ Chess',
    description: 'Bermain catur melawan AI berbasis algoritma Minimax dengan Alpha-Beta pruning secara real-time.',
    to: '/playground/chess',
    icon: '♟️',
    difficulty: 'Hard',
    tag: 'New',
    themeColor: 'indigo'
  },
  {
    title: '🧠 Math Blitz',
    description: 'Uji kecepatan berhitung dengan soal matematika cepat! Mode Speed, Survival, dan Streak tersedia.',
    to: '/playground/mathblitz',
    icon: '🧠',
    difficulty: 'Medium',
    tag: 'New',
    themeColor: 'gold'
  }
]

const filteredCards = computed(() => {
  return cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          card.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesDifficulty = selectedDifficulty.value === 'Semua' || 
                              card.difficulty.toLowerCase() === selectedDifficulty.value.toLowerCase()
    
    return matchesSearch && matchesDifficulty
  })
})
</script>

<style scoped>
/* Scanline overlay styling to mimic CRT monitor */
.scanline-overlay {
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.12) 50%
  );
  background-size: 100% 4px;
}
</style>
