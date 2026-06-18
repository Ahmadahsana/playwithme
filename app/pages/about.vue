<template>
  <div class="relative min-h-screen bg-surface-950 text-white font-inter">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-30 pointer-events-none" />

    <!-- Ambient Glow Orbs -->
    <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
    <div class="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-500/10 rounded-full blur-[110px] pointer-events-none mix-blend-screen" />

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors duration-200 mb-10 group"
      >
        <svg class="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Beranda</span>
      </NuxtLink>

      <!-- 1. Hero Profile Section -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-20">
        <!-- Avatar Wrapper with 3D-Tilt & Neon Ring -->
        <div class="md:col-span-4 flex justify-center">
          <div 
            ref="avatarRef"
            @pointermove="onAvatarMove"
            @pointerleave="onAvatarLeave"
            class="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl p-1 bg-linear-to-tr from-brand-500 via-accent-500 to-cyan-500 shadow-2xl transition-all duration-300 group cursor-pointer"
            :style="avatarStyle"
          >
            <!-- Background Pulse Glow -->
            <div class="absolute -inset-1.5 rounded-[28px] bg-linear-to-tr from-brand-500 via-accent-500 to-cyan-500 opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
            
            <!-- Real Avatar Image -->
            <div class="w-full h-full rounded-[20px] overflow-hidden bg-surface-900 border border-white/10 relative">
              <img 
                src="/avatar.png" 
                alt="Developer Avatar" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-linear-to-t from-surface-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            <!-- Frame Corners decoration -->
            <div class="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div class="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div class="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div class="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
          </div>
        </div>

        <!-- Bio & Typing effect -->
        <div class="md:col-span-8 space-y-5 text-center md:text-left">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            About The Creator
          </div>

          <div class="space-y-1">
            <h1 class="font-outfit font-black text-4xl sm:text-5xl text-white">
              Ahmad <span class="text-gradient">Ahsan</span>
            </h1>
            <!-- Typing effect role description -->
            <div class="h-8 flex items-center justify-center md:justify-start font-mono text-base sm:text-lg text-accent-400">
              <span class="font-semibold">{{ currentText }}</span>
              <span class="w-1 h-5 ml-1 bg-accent-400 animate-pulse" aria-hidden="true">|</span>
            </div>
          </div>

          <p class="text-surface-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Saya adalah seorang pengembang web interaktif yang berfokus pada performa grafis, animasi fluid, dan synthesis audio. Saya senang bereksperimen untuk melampaui batasan browser tradisional dan menciptakan antarmuka digital yang terasa hidup, responsif, dan menyenangkan untuk dimainkan.
          </p>

          <!-- Action buttons -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <PressableBtn 
              @click="navigateTo('/playground')" 
              class="btn-primary px-5! py-2.5! text-sm! font-semibold flex items-center gap-2"
            >
              <span>Taman Bermain</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </PressableBtn>
            <PressableBtn 
              @click="navigateTo('/contact')" 
              class="btn-ghost px-5! py-2.5! text-sm! font-semibold flex items-center gap-2"
            >
              <span>Hubungi Saya</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </PressableBtn>
          </div>
        </div>
      </div>

      <!-- 2. Interactive Skills Timeline -->
      <div class="mb-20 space-y-8">
        <div>
          <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white mb-2">
            Keahlian <span class="text-gradient">Teknis</span>
          </h2>
          <p class="text-surface-400 text-sm max-w-xl">
            Arahkan kursor Anda ke setiap keahlian di bawah untuk melihat detail pengimplementasian dan hubungannya dengan demo game di playground.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Timeline bars -->
          <div class="lg:col-span-7 space-y-5">
            <div 
              v-for="(skill, idx) in skills" 
              :key="skill.name"
              @mouseenter="hoveredSkillIdx = idx"
              @mouseleave="hoveredSkillIdx = null"
              class="card-glass p-4 cursor-pointer relative overflow-hidden transition-all duration-300"
              :class="{ 'border-brand-500/40 bg-brand-500/5 shadow-lg shadow-brand-500/5': hoveredSkillIdx === idx }"
            >
              <!-- Sparkle indicator on hover -->
              <div 
                v-if="hoveredSkillIdx === idx" 
                class="absolute top-0 right-0 w-24 h-full bg-linear-to-l from-brand-500/10 to-transparent pointer-events-none" 
              />
              
              <div class="flex justify-between items-center mb-2">
                <span class="font-outfit font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span 
                    class="w-1.5 h-1.5 rounded-full"
                    :class="hoveredSkillIdx === idx ? 'bg-cyan-400 animate-ping' : 'bg-surface-500'"
                  />
                  {{ skill.name }}
                </span>
                <span class="font-mono text-xs font-bold text-cyan-400">{{ skill.value }}%</span>
              </div>
              
              <!-- Progress Track -->
              <div class="w-full h-2 bg-surface-900 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  class="h-full bg-linear-to-r from-brand-500 to-cyan-400 transition-all duration-1000 ease-out"
                  :style="{ width: isMounted ? `${skill.value}%` : '0%' }"
                />
              </div>

              <p class="text-surface-400 text-xs mt-2 font-medium">
                {{ skill.desc }}
              </p>
            </div>
          </div>

          <!-- Dynamic Detail Box -->
          <div class="lg:col-span-5 flex items-stretch">
            <div class="card-glass p-6 w-full flex flex-col justify-between relative overflow-hidden border-brand-500/20 bg-surface-950/40">
              <div class="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
              
              <!-- When a skill is hovered -->
              <Transition name="fade-detail" mode="out-in">
                <div v-if="hoveredSkill" :key="hoveredSkill.name" class="space-y-4 relative z-10">
                  <div class="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-brand-500/20">
                    💡
                  </div>
                  <div class="space-y-1">
                    <h3 class="font-outfit font-black text-lg text-white">
                      Detail Keahlian
                    </h3>
                    <span class="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      {{ hoveredSkill.name }}
                    </span>
                  </div>
                  <p class="text-surface-300 text-sm leading-relaxed">
                    {{ hoveredSkill.details }}
                  </p>
                </div>

                <!-- Default Explainer state -->
                <div v-else class="space-y-4 flex flex-col items-center justify-center text-center py-10 my-auto relative z-10">
                  <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl animate-bounce">
                    ✨
                  </div>
                  <h3 class="font-outfit font-bold text-lg text-white">Eksplorasi Keahlian</h3>
                  <p class="text-surface-400 text-xs max-w-xs leading-relaxed">
                    Sentuh atau arahkan mouse pada daftar keahlian teknis di samping untuk menyingkap catatan implementasi kode playground.
                  </p>
                </div>
              </Transition>

              <div class="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-[11px] text-surface-500 font-mono relative z-10">
                <span>SYSTEM STATUS: OK</span>
                <span>INTERACTIVE LABS v2.6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Tech Stack Grid (3D Tilt Cards) -->
      <div class="mb-20 space-y-8">
        <div>
          <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white mb-2">
            Arsitektur <span class="text-gradient">Teknologi</span>
          </h2>
          <p class="text-surface-400 text-sm max-w-xl">
            Tumpukan library utama yang digunakan untuk membangun situs portofolio dan mesin game playground ini.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div 
            v-for="(tech, idx) in techStacks" 
            :key="tech.name"
            :ref="el => { if (el) cardRefs[idx] = el }"
            @pointermove="(e) => onCardMove(e, idx)"
            @pointerleave="() => onCardLeave(idx)"
            class="card-glass p-5 flex flex-col justify-between relative select-none cursor-default overflow-hidden outline-none"
            :style="cardStyles[idx]"
          >
            <!-- Highlight Spot Glow -->
            <div 
              class="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none spotlight-glow" 
              :class="{ 'opacity-100': activeCardIdx === idx }"
              :style="spotlightStyles[idx]"
            />

            <!-- Card Header -->
            <div class="space-y-4">
              <div 
                class="w-11 h-11 rounded-xl bg-linear-to-br flex items-center justify-center text-xl font-bold border border-white/5"
                :class="tech.color"
              >
                {{ tech.emoji }}
              </div>
              <div>
                <h3 class="font-outfit font-bold text-base text-white">
                  {{ tech.name }}
                </h3>
                <span class="text-[10px] font-bold text-surface-400 tracking-widest uppercase">
                  {{ tech.role }}
                </span>
              </div>
              <p class="text-surface-400 text-xs leading-relaxed">
                {{ tech.desc }}
              </p>
            </div>

            <!-- Mini pill link indicating where it is used -->
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span 
                v-for="use in tech.usedIn" 
                :key="use"
                class="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-surface-400"
              >
                {{ use }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. What I Love Section -->
      <div class="card-glass p-8 relative overflow-hidden border-brand-500/20 bg-brand-950/10">
        <div class="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div class="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <div class="space-y-2">
            <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white">
              Prinsip <span class="text-gradient">Eksperimen</span>
            </h2>
            <p class="text-surface-400 text-xs sm:text-sm">
              Di balik setiap visual interaktif, saya memegang teguh prinsip-prinsip berikut.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200">
              <span class="text-2xl mt-0.5">🚀</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Kinerja 60 FPS</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Menjaga loop requestAnimationFrame tetap bersih, mengoptimalkan rendering Canvas, dan meminimalkan garbage collection.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200">
              <span class="text-2xl mt-0.5">🎵</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Suara Prosedural</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Memanfaatkan Web Audio API untuk mensintesis gelombang sinus, persegi, dan noise secara real-time daripada mengunduh file aset MP3 yang berat.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200">
              <span class="text-2xl mt-0.5">🎨</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Seni Generatif & Matematika</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Memakai noise Perlin, fraktal rekursif, dan L-system deterministik berbasis random seed untuk menciptakan keindahan visual dari angka acak.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200">
              <span class="text-2xl mt-0.5">🫧</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Fisika Interaktif</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Mendekatkan kursor ke partikel, simulasi fluida Navier-Stokes WebGL, dan tabrakan dinamis Matter.js agar web terasa memiliki bobot dan gesekan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PressableBtn from '~/components/ui/PressableBtn.vue'
import { useHaptics } from '~/composables/useHaptics'

useSeoMeta({
  title: 'Tentang Ahmad Ahsan — PlayWithMe',
  description: 'Mengenal Ahmad Ahsan, Creative Technologist di balik PlayWithMe. Detail keahlian pemrograman, visualisasi WebGL/Canvas, dan sintesis audio.',
  ogTitle: 'About Ahmad Ahsan — PlayWithMe',
  ogDescription: 'Profil dan keahlian teknis Ahmad Ahsan dalam Web Audio, WebGL, Matter.js, dan Nuxt 4.',
})

const router = useRouter()
const haptics = useHaptics()
const isMounted = ref(false)

const navigateTo = (path: string) => {
  haptics.toggle()
  router.push(path)
}

// 1. Avatar 3D Tilt Logic
const avatarRef = ref<HTMLElement | null>(null)
const avatarRotation = reactive({ rx: 0, ry: 0 })
const avatarHovered = ref(false)

const onAvatarMove = (e: PointerEvent) => {
  const el = avatarRef.value
  if (!el) return
  avatarHovered.value = true
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  // Max tilt: 15deg
  avatarRotation.ry = ((x - centerX) / centerX) * 15
  avatarRotation.rx = ((centerY - y) / centerY) * -15
}

const onAvatarLeave = () => {
  avatarHovered.value = false
  avatarRotation.rx = 0
  avatarRotation.ry = 0
}

const avatarStyle = computed(() => {
  const transform = avatarHovered.value
    ? `perspective(800px) rotateX(${avatarRotation.rx}deg) rotateY(${avatarRotation.ry}deg) scale3d(1.02, 1.02, 1.02)`
    : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  return {
    transform,
    transition: avatarHovered.value ? 'transform 0.05s ease-out' : 'transform 0.5s ease-out'
  }
})

// 2. Typing Effect Logic
const words = [
  'Creative Technologist',
  'Frontend Developer',
  'Interactivity explorer',
  'Canvas & Sound Enthusiast'
]
const currentWordIdx = ref(0)
const currentText = ref('')
const isDeleting = ref(false)

let typeTimeout: any = null

const handleType = () => {
  const fullWord = words[currentWordIdx.value] || ''
  if (isDeleting.value) {
    currentText.value = fullWord.substring(0, currentText.value.length - 1)
  } else {
    currentText.value = fullWord.substring(0, currentText.value.length + 1)
  }
  
  let speed = isDeleting.value ? 40 : 80
  
  if (!isDeleting.value && currentText.value === fullWord) {
    speed = 2000 // Pause at end of word
    isDeleting.value = true
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false
    currentWordIdx.value = (currentWordIdx.value + 1) % words.length
    speed = 400 // Pause before starting new word
  }
  
  // Accessibility check: prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    currentText.value = fullWord
    typeTimeout = setTimeout(() => {
      currentWordIdx.value = (currentWordIdx.value + 1) % words.length
      handleType()
    }, 3000)
    return
  }
  
  typeTimeout = setTimeout(handleType, speed)
}

// 3. Interactive Skills Timeline Data
const skills = ref([
  { 
    name: 'JavaScript & TypeScript', 
    value: 92, 
    desc: 'Bahasa pemrograman utama untuk logika interaktif dan simulasi.', 
    details: 'Menyusun state game loop berkinerja tinggi, manipulasi matriks, implementasi pointer tracking, dan optimasi runtime JavaScript di semua 8 game playground.' 
  },
  { 
    name: 'Vue & Nuxt 4', 
    value: 88, 
    desc: 'Framework reaktif untuk struktur komponen modular.', 
    details: 'Membangun dashboard, integrasi Pinia global store untuk sinkronisasi audio/highscore, mengelola transisi rute, serta layout modular yang sepenuhnya responsif.' 
  },
  { 
    name: 'Canvas 2D & WebGL Shaders', 
    value: 85, 
    desc: 'Menggambar grafis performa tinggi 60 FPS langsung di layar browser.', 
    details: 'Mengimplementasikan partikel konstelasi, supernova galaksi, matrix rain buffer, neon snake, dan fragment shader WebGL kustom untuk Fluid Dynamics.' 
  },
  { 
    name: 'Web Audio API', 
    value: 80, 
    desc: 'Sintesis suara prosedural langsung dari frekuensi matematika.', 
    details: 'Menggunakan AudioContext untuk mensintesis gelombang audio secara real-time, gain nodes untuk fade, FFT analyzer untuk visualisator mic, dan beat detection.' 
  },
  { 
    name: 'Physics & Math Simulations', 
    value: 78, 
    desc: 'Pemodelan gaya, gravitasi, momentum, dan tabrakan dinamis.', 
    details: 'Integrasi rigid-body physics Matter.js, vector math untuk gravitasi partikel, flow-field Perlin noise untuk karya seni generatif, dan L-system fractal branching.' 
  }
])
const hoveredSkillIdx = ref<number | null>(null)
const hoveredSkill = computed(() => {
  return hoveredSkillIdx.value !== null ? skills.value[hoveredSkillIdx.value] : null
})

// 4. Tech Stacks 3D Tilt Logic
const techStacks = [
  { 
    name: 'Nuxt 4', 
    role: 'Framework', 
    emoji: '🟢', 
    desc: 'Core arsitektur reaktif dengan SSR hybrid, auto-routing modular, dan clean state lifecycle.', 
    usedIn: ['Playground Hub', 'About', 'Contact'],
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-400'
  },
  { 
    name: 'Tailwind CSS 4', 
    role: 'Styling', 
    emoji: '🎨', 
    desc: 'Sistem styling CSS-first baru dengan performa ultra cepat dan custom variables bertema neon.', 
    usedIn: ['App Theme', 'Glassmorphism', 'Grid Layout'],
    color: 'from-sky-500/10 to-blue-500/10 text-sky-400'
  },
  { 
    name: 'Matter.js', 
    role: 'Physics Engine', 
    emoji: '🎱', 
    desc: 'Rigid body engine 2D untuk simulasi tabrakan, elastisitas, gesekan, dan interaksi lemparan benda.', 
    usedIn: ['Physics Sandbox'],
    color: 'from-amber-500/10 to-orange-500/10 text-amber-400'
  },
  { 
    name: 'Pinia', 
    role: 'State Store', 
    emoji: '🍍', 
    desc: 'State management ringan untuk menyimpan volume audio global, score tersimpan, dan setelan grafis.', 
    usedIn: ['Audio Switch', 'Highscores', 'Particle Limit'],
    color: 'from-yellow-500/10 to-amber-600/10 text-yellow-400'
  },
  { 
    name: 'GSAP', 
    role: 'Animations', 
    emoji: '✨', 
    desc: 'Engine animasi tween super mulus untuk transisi halaman dan stagger visual yang memanjakan mata.', 
    usedIn: ['Page Transitions', 'Bio Fade-In'],
    color: 'from-pink-500/10 to-purple-500/10 text-pink-400'
  }
]

const cardRefs = ref<any[]>([])
const activeCardIdx = ref<number | null>(null)
const cardRotation = reactive(techStacks.map(() => ({ rx: 0, ry: 0, x: 0, y: 0 })))

const onCardMove = (e: PointerEvent, idx: number) => {
  const el = cardRefs.value[idx]
  if (!el) return
  activeCardIdx.value = idx
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const rot = cardRotation[idx]
  if (rot) {
    rot.x = x
    rot.y = y
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Max tilt: 10deg
    rot.ry = ((x - centerX) / centerX) * 10
    rot.rx = ((centerY - y) / centerY) * -10
  }
}

const onCardLeave = (idx: number) => {
  activeCardIdx.value = null
  const rot = cardRotation[idx]
  if (rot) {
    rot.rx = 0
    rot.ry = 0
  }
}

const cardStyles = computed(() => {
  return techStacks.map((_, idx) => {
    const isHovered = activeCardIdx.value === idx
    const rot = cardRotation[idx]
    const transform = (isHovered && rot)
      ? `perspective(600px) rotateX(${rot.rx}deg) rotateY(${rot.ry}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    
    return {
      transform,
      transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.5s ease-out',
    }
  })
})

const spotlightStyles = computed(() => {
  return techStacks.map((_, idx) => {
    const rot = cardRotation[idx]
    return {
      '--x': rot ? `${rot.x}px` : '0px',
      '--y': rot ? `${rot.y}px` : '0px'
    }
  })
})

onMounted(() => {
  isMounted.value = true
  handleType()
})

onUnmounted(() => {
  if (typeTimeout) clearTimeout(typeTimeout)
})
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(to right, var(--color-brand-400), var(--color-accent-400), var(--color-cyan-400));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Slide/fade animation for detail cards */
.fade-detail-enter-active,
.fade-detail-leave-active {
  transition: all 0.25s ease;
}
.fade-detail-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-detail-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.spotlight-glow {
  background: radial-gradient(
    circle 100px at var(--x, 0px) var(--y, 0px),
    oklch(62% 0.2 265 / 0.12) 0%,
    oklch(62% 0.25 310 / 0.05) 50%,
    transparent 100%
  );
}

/* Custom card-glass hover adjustments */
.card-glass {
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.15s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}
.card-glass:hover {
  border-color: oklch(100% 0 0 / 0.2);
}
</style>
