<template>
  <div 
    class="relative min-h-screen bg-surface-950 text-white font-inter flex flex-col justify-between overflow-x-hidden"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-30 pointer-events-none" />

    <!-- Ambient Glow Orbs -->
    <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
    <div class="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[90px] pointer-events-none mix-blend-screen" />

    <!-- Top Spacer for alignment -->
    <div class="flex-none pt-24" />

    <!-- Main Container -->
    <div 
      class="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      :style="{ paddingBottom: `${keyboardHeight + 24}px` }"
    >
      <div class="w-full max-w-lg transition-all duration-300">
        <!-- Back Link -->
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors duration-200 mb-6 group"
        >
          <svg class="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali</span>
        </NuxtLink>

        <!-- Form Card / Success Screen -->
        <div class="card-glass p-6 sm:p-8 relative overflow-hidden bg-surface-950/60 backdrop-blur-2xl">
          <!-- CRT noise / grid inside card -->
          <div class="absolute inset-0 bg-grid opacity-5 pointer-events-none" />

          <!-- Form Content State -->
          <Transition name="fade-form" mode="out-in">
            <div v-if="!isSuccess" class="space-y-6">
              <div class="space-y-2">
                <h1 class="font-outfit font-black text-3xl text-white">
                  Kirim <span class="text-gradient">Pesan</span>
                </h1>
                <p class="text-surface-400 text-xs sm:text-sm">
                  Punya pertanyaan, ide kolaborasi, atau sekadar ingin menyapa? Isi form di bawah ini.
                </p>
              </div>

              <!-- Contact Form -->
              <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
                <!-- Name Field -->
                <div class="space-y-1.5">
                  <label for="name" class="block text-xs font-bold uppercase tracking-wider text-surface-400">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    autocomplete="name"
                    enterkeyhint="next"
                    placeholder="Masukkan nama Anda"
                    class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all duration-300"
                    :class="errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-500/60 focus:bg-white/8'"
                    @focus="scrollIntoView"
                  />
                  <Transition name="slide-err">
                    <span v-if="errors.name" class="block text-[11px] font-medium text-red-400">
                      {{ errors.name }}
                    </span>
                  </Transition>
                </div>

                <!-- Email Field -->
                <div class="space-y-1.5">
                  <label for="email" class="block text-xs font-bold uppercase tracking-wider text-surface-400">
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    inputmode="email"
                    required
                    autocomplete="email"
                    enterkeyhint="next"
                    placeholder="nama@domain.com"
                    class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all duration-300"
                    :class="errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-500/60 focus:bg-white/8'"
                    @focus="scrollIntoView"
                  />
                  <Transition name="slide-err">
                    <span v-if="errors.email" class="block text-[11px] font-medium text-red-400">
                      {{ errors.email }}
                    </span>
                  </Transition>
                </div>

                <!-- Message Field -->
                <div class="space-y-1.5">
                  <label for="message" class="block text-xs font-bold uppercase tracking-wider text-surface-400">
                    Isi Pesan
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="4"
                    required
                    enterkeyhint="done"
                    placeholder="Tulis pesan Anda di sini..."
                    class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all duration-300 resize-none"
                    :class="errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-500/60 focus:bg-white/8'"
                    @focus="scrollIntoView"
                  />
                  <Transition name="slide-err">
                    <span v-if="errors.message" class="block text-[11px] font-medium text-red-400">
                      {{ errors.message }}
                    </span>
                  </Transition>
                </div>

                <!-- Submit Button -->
                <PressableBtn
                  type="submit"
                  :disabled="isSubmitting"
                  class="btn-primary w-full justify-center text-sm py-3 font-semibold relative overflow-hidden"
                >
                  <span v-if="!isSubmitting" class="flex items-center gap-2">
                    Kirim Pesan
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                  <span v-else class="flex items-center gap-2.5">
                    <!-- Spinning Loader -->
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Mengirim...</span>
                  </span>
                </PressableBtn>
              </form>
            </div>

            <!-- Success State -->
            <div v-else class="text-center py-8 space-y-6 flex flex-col items-center">
              <div class="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl animate-bounce">
                🚀
              </div>
              
              <div class="space-y-2">
                <h2 class="font-outfit font-black text-2xl text-white">PESAN TERKIRIM!</h2>
                <p class="text-surface-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                  Terima kasih! Pesan Anda telah sukses ditransmisikan. Saya akan menghubungi Anda kembali secepatnya.
                </p>
              </div>

              <div class="w-full border-t border-white/5 pt-4 flex flex-col items-center gap-3">
                <PressableBtn 
                  @click="resetForm" 
                  class="btn-primary px-5! py-2.5! text-xs! font-bold"
                >
                  Kirim Pesan Lain
                </PressableBtn>
                <PressableBtn 
                  @click="navigateTo('/')" 
                  class="btn-ghost px-5! py-2.5! text-xs! font-bold"
                >
                  Kembali ke Home
                </PressableBtn>
              </div>
            </div>
          </Transition>

          <!-- Confetti Canvas (renders above success content) -->
          <canvas 
            v-show="isSuccess"
            ref="confettiCanvas" 
            class="absolute inset-0 pointer-events-none z-40 w-full h-full" 
          />
        </div>
      </div>
    </div>

    <!-- Bottom footer placeholder -->
    <div class="flex-none pb-8 text-center text-[10px] text-surface-500 font-mono">
      <span>TRANSMISSION SECURE &bull; SHIFT-DOWN TO CLOSE KEYBOARD</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHaptics } from '~/composables/useHaptics'
import { useKeyboardAware } from '~/composables/useKeyboardAware'
import PressableBtn from '~/components/ui/PressableBtn.vue'

useSeoMeta({
  title: 'Hubungi Ahmad Ahsan — PlayWithMe',
  description: 'Hubungi Ahmad Ahsan. Kirim pesan, diskusikan proyek web kreatif, visual shader, atau kolaborasi game web interaktif.',
  ogTitle: 'Contact Ahmad Ahsan — PlayWithMe',
  ogDescription: 'Form kontak interaktif Ahmad Ahsan dengan validasi real-time dan notifikasi responsif.',
})

const router = useRouter()
const haptics = useHaptics()
const { keyboardHeight, isKeyboardVisible } = useKeyboardAware()

const isSubmitting = ref(false)
const isSuccess = ref(false)

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  message: ''
})

// 1. Touch gestures for Virtual Keyboard dismiss
let touchStartY = 0
const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (touch) {
    touchStartY = touch.clientY
  }
}

const onTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (touch) {
    const touchEndY = touch.clientY
    const deltaY = touchEndY - touchStartY
    // If keyboard is visible and swiped down > 50px on non-input, blur focus
    if (deltaY > 50 && isKeyboardVisible.value) {
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
  }
}

// 2. Focused input auto-scrolling
const scrollIntoView = (e: FocusEvent) => {
  const target = e.target as HTMLElement
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }
}

// 3. Validation helper
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.message = ''

  if (!form.name.trim()) {
    errors.name = 'Nama lengkap wajib diisi.'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Alamat email wajib diisi.'
    isValid = false
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Format alamat email tidak valid.'
    isValid = false
  }

  if (!form.message.trim()) {
    errors.message = 'Pesan tidak boleh kosong.'
    isValid = false
  }

  return isValid
}

// 4. Synth Success Audio synthesis
const playSuccessAudio = () => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return
  
  const ctx = new AudioContextClass()
  const now = ctx.currentTime
  
  // Happy arpeggio chord chime (C5 -> E5 -> G5 -> C6)
  const notes = [523.25, 659.25, 783.99, 1046.50]
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + idx * 0.08)
    
    gainNode.gain.setValueAtTime(0, now + idx * 0.08)
    gainNode.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.04)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35)
    
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    osc.start(now + idx * 0.08)
    osc.stop(now + idx * 0.08 + 0.35)
  })
}

// 5. Canvas Confetti Animation Logic
const confettiCanvas = ref<HTMLCanvasElement | null>(null)
let confettiRAF: number | null = null

interface Confetti {
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
}

const startConfetti = () => {
  const canvas = confettiCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = canvas.parentElement?.getBoundingClientRect()
  canvas.width = rect?.width || window.innerWidth
  canvas.height = rect?.height || window.innerHeight

  const particles: Confetti[] = []
  const colors = [
    '#6366f1', // brand-500 (indigo)
    '#a855f7', // accent-500 (purple)
    '#06b6d4', // cyan-500
    '#f59e0b', // amber-500
    '#ec4899'  // pink-500
  ]

  // Spawn explosion of 80 particles from bottom-center
  const count = 80
  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.75,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)] || '#6366f1',
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 10, // Upwards force
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15
    })
  }

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let active = false
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.4 // Gravity
      p.vx *= 0.98 // Air resistance friction
      p.rotation += p.rotationSpeed

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      ctx.restore()

      // Active while at least one particle remains visible
      if (p.y < canvas.height + 20 && p.x > -20 && p.x < canvas.width + 20) {
        active = true
      }
    })

    if (active) {
      confettiRAF = requestAnimationFrame(tick)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  tick()
}

const stopConfetti = () => {
  if (confettiRAF) {
    cancelAnimationFrame(confettiRAF)
    confettiRAF = null
  }
}

// 6. Navigation
const navigateTo = (path: string) => {
  haptics.toggle()
  router.push(path)
}

// 7. Form Submission
const handleSubmit = () => {
  // Validate
  if (!validateForm()) {
    haptics.warning()
    return
  }

  haptics.toggle()
  isSubmitting.value = true

  // Simulate network dispatch delay
  setTimeout(() => {
    isSubmitting.value = false
    isSuccess.value = true
    
    // Physical trust feedback
    haptics.success()
    
    // Procedural sound chime
    playSuccessAudio()
    
    // Visual wow factor
    setTimeout(() => {
      startConfetti()
    }, 100)
  }, 1200)
}

const resetForm = () => {
  haptics.toggle()
  stopConfetti()
  form.name = ''
  form.email = ''
  form.message = ''
  isSuccess.value = false
}

onUnmounted(() => {
  stopConfetti()
})
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(to right, var(--color-brand-400), var(--color-accent-400), var(--color-cyan-400));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Animations transitions */
.fade-form-enter-active,
.fade-form-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-form-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-form-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-err-enter-active,
.slide-err-leave-active {
  transition: all 0.2s ease-out;
}
.slide-err-enter-from,
.slide-err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
