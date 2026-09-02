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
                :alt="`Foto ${profile.name}`"
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
            Tentang Saya
          </div>

          <div class="space-y-1">
            <h1 class="font-outfit font-black text-4xl sm:text-5xl text-white">
              {{ firstName }} <span class="text-gradient">{{ lastName }}</span>
            </h1>
            <!-- Typing effect role description -->
            <div class="h-8 flex items-center justify-center md:justify-start font-mono text-base sm:text-lg text-accent-400">
              <span class="font-semibold">{{ currentText }}</span>
              <span class="w-1 h-5 ml-1 bg-accent-400 animate-pulse" aria-hidden="true">|</span>
            </div>
          </div>

          <!-- Quick facts -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-surface-300">
              <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {{ profile.location }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Tersedia untuk freelance
            </span>
          </div>

          <p class="text-surface-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Saya seorang <span class="text-white font-semibold">Software Developer</span> yang terbiasa menangani aplikasi web
            dari sisi antarmuka hingga server. Di depan saya memakai Vue dan Nuxt; di belakang Laravel, Express.js, atau NestJS.
            Pengalaman saya mencakup sistem perizinan pemerintah, platform tiket event, e-learning, sampai aplikasi manajemen untuk UMKM.
            PlayWithMe adalah ruang eksperimen pribadi saya di luar pekerjaan klien — tempat menguji Canvas, WebGL, Web Audio, dan fisika secara real-time.
          </p>

          <!-- Action buttons -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <PressableBtn
              @click="navigate('/playground')"
              class="btn-primary px-5! py-2.5! text-sm! font-semibold flex items-center gap-2"
            >
              <span>Taman Bermain</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </PressableBtn>
            <PressableBtn
              @click="navigate('/contact')"
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

      <!-- 2. Experience Timeline -->
      <div class="mb-20 space-y-8">
        <div>
          <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white mb-2">
            Pengalaman <span class="text-gradient">Kerja</span>
          </h2>
          <p class="text-surface-400 text-sm max-w-xl">
            Perjalanan profesional saya membangun perangkat lunak untuk perusahaan, instansi, dan klien freelance.
          </p>
        </div>

        <ol class="relative border-l border-white/10 ml-2 space-y-8">
          <li
            v-for="exp in experiences"
            :key="exp.company"
            class="relative pl-8"
          >
            <span class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-surface-950" />
            <div class="card-glass p-5 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 class="font-outfit font-bold text-base sm:text-lg text-white">
                  {{ exp.role }}
                  <span class="text-surface-400 font-medium">· {{ exp.company }}</span>
                </h3>
                <span class="font-mono text-xs text-brand-400 shrink-0">{{ exp.period }}</span>
              </div>
              <p v-if="exp.location" class="text-[11px] uppercase tracking-wider text-surface-500 font-semibold">
                {{ exp.location }}
              </p>
              <p class="text-surface-400 text-sm leading-relaxed">{{ exp.summary }}</p>
              <div v-if="exp.stack?.length" class="flex flex-wrap gap-1.5 pt-1">
                <span
                  v-for="tech in exp.stack"
                  :key="tech"
                  class="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-surface-400"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </li>
        </ol>
        <p class="text-xs text-surface-500 font-mono pl-2">
          * Beberapa periode masih menunggu konfirmasi dari saya.
        </p>
      </div>

      <!-- 3. Selected Projects -->
      <div class="mb-20 space-y-8">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white mb-2">
              Karya <span class="text-gradient">Terpilih</span>
            </h2>
            <p class="text-surface-400 text-sm max-w-xl">
              Sebagian proyek yang saya kerjakan bersama tim Inovra — dari instansi pemerintah hingga produk digital.
            </p>
          </div>
          <a
            href="https://inovra.id/portofolio"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5"
          >
            Lihat portofolio lengkap
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <component
            :is="project.link ? 'a' : 'div'"
            v-for="project in projects"
            :key="project.name"
            :href="project.link"
            :target="project.link ? '_blank' : undefined"
            :rel="project.link ? 'noopener noreferrer' : undefined"
            class="card-glass p-5 flex flex-col gap-3 group"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-outfit font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                {{ project.name }}
              </h3>
              <svg v-if="project.link" class="w-4 h-4 text-surface-500 group-hover:text-brand-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-brand-400/80">{{ project.category }}</span>
            <p class="text-surface-400 text-xs leading-relaxed">{{ project.description }}</p>
          </component>
        </div>
      </div>

      <!-- 4. Tech Stack Grid (3D Tilt Cards) -->
      <div class="mb-20 space-y-8">
        <div>
          <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white mb-2">
            Keahlian <span class="text-gradient">Teknis</span>
          </h2>
          <p class="text-surface-400 text-sm max-w-xl">
            Alat dan bahasa yang saya pakai sehari-hari. Arahkan kursor ke tiap kartu untuk efek 3D.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(tech, idx) in techStacks"
            :key="tech.name"
            :ref="el => { if (el) cardRefs[idx] = (el as HTMLElement) }"
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

        <!-- Full skill list grouped -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="group in skillGroups"
            :key="group.label"
            class="card-glass p-4 space-y-3"
          >
            <h3 class="text-[11px] font-bold uppercase tracking-wider text-brand-400">{{ group.label }}</h3>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="item in group.items"
                :key="item"
                class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-surface-300"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. What I Love Section -->
      <div class="card-glass p-8 relative overflow-hidden border-brand-500/20 bg-brand-950/10 mb-16">
        <div class="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div class="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <div class="space-y-2">
            <h2 class="font-outfit font-black text-2xl sm:text-3xl text-white">
              Prinsip <span class="text-gradient">Kerja</span>
            </h2>
            <p class="text-surface-400 text-xs sm:text-sm">
              Hal-hal yang saya pegang saat membangun produk, baik untuk klien maupun eksperimen pribadi.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200">
              <span class="text-2xl mt-0.5">🧩</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Full Stack, Bukan Setengah</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Memahami alur data dari database, API, sampai komponen di layar — supaya keputusan di satu sisi tidak menyusahkan sisi lain.
                </p>
              </div>
            </div>
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
              <span class="text-2xl mt-0.5">♿</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Aksesibilitas Sejak Awal</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Menghormati prefers-reduced-motion, fokus keyboard, dan kontras warna — pengalaman yang layak untuk semua pengguna.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200">
              <span class="text-2xl mt-0.5">🌱</span>
              <div>
                <h4 class="font-outfit font-bold text-sm text-white">Small Steps, Big Dreams</h4>
                <p class="text-surface-400 text-xs mt-1 leading-relaxed">
                  Membangun sedikit demi sedikit, konsisten, dan terus belajar hal baru lewat proyek sampingan seperti situs ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Contact / Socials -->
      <div class="card-glass p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="text-center sm:text-left">
          <h2 class="font-outfit font-bold text-lg text-white">Mari terhubung</h2>
          <p class="text-surface-400 text-sm mt-1">Terbuka untuk proyek freelance, kolaborasi, atau sekadar berbagi ide.</p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            :href="`mailto:${profile.email}`"
            class="btn-ghost px-4! py-2! text-xs! font-semibold"
          >
            Email
          </a>
          <a
            :href="profile.socials.github"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-ghost px-4! py-2! text-xs! font-semibold"
          >
            GitHub
          </a>
          <a
            :href="profile.socials.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-ghost px-4! py-2! text-xs! font-semibold"
          >
            LinkedIn
          </a>
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
import { profile, skillGroups, experiences, projects } from '~/data/profile'

useSeoMeta({
  title: `Tentang ${profile.name} — PlayWithMe`,
  description: `Mengenal ${profile.name}, ${profile.role} asal ${profile.location}. Pengalaman kerja, karya terpilih bersama Inovra, dan keahlian teknis di Vue, Nuxt, Laravel, Express, dan NestJS.`,
  ogTitle: `Tentang ${profile.name} — PlayWithMe`,
  ogDescription: `Profil, pengalaman, dan karya ${profile.name}: Full Stack Web Developer (Vue, Nuxt, Laravel, Express, NestJS).`,
  ogImage: '/avatar.png',
})

const router = useRouter()
const haptics = useHaptics()

const nameParts = profile.name.split(' ')
const firstName = nameParts[0]
const lastName = nameParts.slice(1).join(' ')

const navigate = (path: string) => {
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
  'Software Developer',
  'Vue & Nuxt di Frontend',
  'Laravel · Express · NestJS di Backend',
  'Interactivity Explorer',
]
const currentWordIdx = ref(0)
const currentText = ref('')
const isDeleting = ref(false)

let typeTimeout: ReturnType<typeof setTimeout> | null = null

const handleType = () => {
  const fullWord = words[currentWordIdx.value] || ''
  if (isDeleting.value) {
    currentText.value = fullWord.substring(0, currentText.value.length - 1)
  } else {
    currentText.value = fullWord.substring(0, currentText.value.length + 1)
  }

  let speed = isDeleting.value ? 40 : 80

  if (!isDeleting.value && currentText.value === fullWord) {
    speed = 2000
    isDeleting.value = true
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false
    currentWordIdx.value = (currentWordIdx.value + 1) % words.length
    speed = 400
  }

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

// 3. Tech Stacks 3D Tilt Logic
const techStacks = [
  {
    name: 'Vue & Nuxt',
    role: 'Frontend Framework',
    emoji: '🟢',
    desc: 'Framework reaktif pilihan saya untuk membangun antarmuka modular, SSR hybrid, dan aplikasi single-page.',
    usedIn: ['PlayWithMe', 'Explore Kudus', 'DK Group'],
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-400'
  },
  {
    name: 'Laravel',
    role: 'Backend / PHP',
    emoji: '🐘',
    desc: 'Backend utama untuk sistem perizinan, e-commerce, dan aplikasi manajemen — lengkap dengan auth, queue, dan API.',
    usedIn: ['DPMPTSP Kudus', 'TIXU', 'Koperasi Desa'],
    color: 'from-red-500/10 to-orange-500/10 text-red-400'
  },
  {
    name: 'Express & NestJS',
    role: 'Backend / Node.js',
    emoji: '⬡',
    desc: 'REST API berbasis Node.js — Express untuk servis ringan, NestJS saat butuh struktur modular yang tegas.',
    usedIn: ['REST API', 'Microservice', 'Realtime'],
    color: 'from-sky-500/10 to-blue-500/10 text-sky-400'
  },
  {
    name: 'Tailwind CSS',
    role: 'Styling',
    emoji: '🎨',
    desc: 'Sistem styling utility-first untuk membangun UI konsisten dengan cepat, termasuk tema neon situs ini.',
    usedIn: ['App Theme', 'Glassmorphism', 'Layout'],
    color: 'from-cyan-500/10 to-blue-500/10 text-cyan-400'
  },
  {
    name: 'JavaScript & Canvas',
    role: 'Bahasa Inti',
    emoji: '⚡',
    desc: 'Logika interaktif, game loop, manipulasi Canvas 2D, dan sedikit WebGL untuk demo di playground.',
    usedIn: ['Galaxy', 'Matrix Rain', 'Neon Snake'],
    color: 'from-yellow-500/10 to-amber-600/10 text-yellow-400'
  },
  {
    name: 'MySQL / PostgreSQL',
    role: 'Database',
    emoji: '🗄️',
    desc: 'Perancangan skema relasional, query optimization, dan migrasi data untuk aplikasi produksi.',
    usedIn: ['Perizinan', 'Ticketing', 'Manajemen'],
    color: 'from-indigo-500/10 to-purple-500/10 text-indigo-400'
  }
]

const cardRefs = ref<HTMLElement[]>([])
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

.spotlight-glow {
  background: radial-gradient(
    circle 100px at var(--x, 0px) var(--y, 0px),
    oklch(62% 0.2 265 / 0.12) 0%,
    oklch(62% 0.25 310 / 0.05) 50%,
    transparent 100%
  );
}

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
