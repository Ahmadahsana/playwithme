<template>
  <div
    class="relative w-screen h-screen overflow-hidden bg-surface-950 text-white font-inter flex flex-col items-center justify-center select-none"
    :class="{ 'flash-correct': flashCorrect, 'flash-wrong': flashWrong }"
  >
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div class="absolute inset-0 noise-texture opacity-15 pointer-events-none" />

    <!-- Ambient glow orbs — react to combos -->
    <div
      class="absolute top-1/3 left-1/3 rounded-full blur-[140px] pointer-events-none transition-all duration-700"
      :class="comboLevel >= 5 ? 'w-[600px] h-[600px] bg-brand-500/20' : 'w-80 h-80 bg-brand-500/8'"
    />
    <div
      class="absolute bottom-1/3 right-1/3 rounded-full blur-[120px] pointer-events-none transition-all duration-700"
      :class="comboLevel >= 3 ? 'w-[400px] h-[400px] bg-accent-500/20' : 'w-64 h-64 bg-accent-500/8'"
    />

    <!-- Back to Hub -->
    <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-40 flex items-center gap-3">
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
        <h1 class="font-outfit font-bold text-lg leading-none">🧮 Math Blitz</h1>
        <span class="text-xs text-surface-400">Speed Mental Math</span>
      </div>
    </div>

    <!-- HUD — top right -->
    <div v-if="gamePhase === 'playing'" class="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center gap-2 sm:gap-3">
      <!-- Lives -->
      <div class="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
        <span v-for="i in maxLives" :key="i" class="text-base sm:text-lg transition-all duration-300" :class="i <= lives ? 'opacity-100' : 'opacity-20 grayscale'">❤️</span>
      </div>
      <!-- Score -->
      <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-xs font-mono">
        <span class="text-surface-500">Score:</span>
        <span class="font-bold text-brand-300 tabular-nums text-sm">{{ score.toLocaleString() }}</span>
      </div>
      <!-- Combo -->
      <div
        v-if="combo >= 2"
        class="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300"
        :class="comboLevel >= 5 ? 'border-amber-500/60 text-amber-300' : 'border-brand-500/40 text-brand-300'"
      >
        <span>🔥</span>
        <span class="font-bold">x{{ combo }}</span>
      </div>
    </div>

    <!-- ────────── MENU SCREEN ────────── -->
    <Transition name="scale-fade">
      <div v-if="gamePhase === 'menu'" class="relative z-20 flex flex-col items-center gap-8 text-center px-4 max-w-lg w-full">
        <!-- Title -->
        <div class="space-y-3">
          <div class="text-7xl animate-float">🧮</div>
          <h2 class="font-outfit font-black text-5xl sm:text-6xl text-white tracking-tight">Math<span class="text-gradient">Blitz</span></h2>
          <p class="text-surface-400 text-sm">Uji kecepatan berhitung Anda! Jawab soal matematika secepat mungkin sebelum waktu habis.</p>
        </div>

        <!-- Mode select -->
        <div class="w-full space-y-3">
          <p class="text-xs text-surface-500 uppercase tracking-wider font-bold">Pilih Mode</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              v-for="mode in modes"
              :key="mode.id"
              @click="selectedMode = mode.id"
              class="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-center"
              :class="selectedMode === mode.id
                ? 'bg-brand-500/20 border-brand-500/60 shadow-lg shadow-brand-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'"
            >
              <span class="text-3xl">{{ mode.emoji }}</span>
              <span class="font-outfit font-bold text-sm text-white">{{ mode.name }}</span>
              <span class="text-[11px] text-surface-400 leading-tight">{{ mode.desc }}</span>
            </button>
          </div>
        </div>

        <!-- Difficulty -->
        <div class="w-full space-y-3">
          <p class="text-xs text-surface-500 uppercase tracking-wider font-bold">Tingkat Kesulitan</p>
          <div class="flex items-center gap-2 justify-center">
            <button
              v-for="diff in difficulties"
              :key="diff.id"
              @click="selectedDifficulty = diff.id"
              class="px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300"
              :class="selectedDifficulty === diff.id
                ? diff.activeClass
                : 'bg-white/5 border-white/10 text-surface-300 hover:text-white'"
            >
              {{ diff.label }}
            </button>
          </div>
        </div>

        <!-- Best Score -->
        <div v-if="store.getHighScore('mathblitz') > 0" class="text-xs text-surface-500">
          🏆 Best Score: <span class="text-amber-400 font-bold">{{ store.getHighScore('mathblitz').toLocaleString() }}</span>
        </div>

        <PressableBtn
          @click="startGame"
          class="btn-primary w-full max-w-xs justify-center text-base py-3.5 font-black flex items-center gap-2"
        >
          <span>⚡</span><span>Mulai!</span>
        </PressableBtn>
      </div>
    </Transition>

    <!-- ────────── PLAYING SCREEN ────────── -->
    <Transition name="scale-fade">
      <div v-if="gamePhase === 'playing'" class="relative z-20 flex flex-col items-center gap-6 w-full max-w-lg px-4">

        <!-- Question Timer Bar -->
        <div class="w-full h-2 bg-surface-800 rounded-full overflow-hidden border border-white/5">
          <div
            class="h-full rounded-full transition-all ease-linear"
            :class="timerBarColor"
            :style="{ width: timerPercent + '%', transitionDuration: '100ms' }"
          />
        </div>

        <!-- Category badge -->
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
            :class="categoryBadge.class"
          >
            {{ categoryBadge.icon }} {{ categoryBadge.label }}
          </span>
          <span v-if="combo >= 2" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
            🔥 {{ combo }}x Combo
          </span>
        </div>

        <!-- Question -->
        <div class="text-center space-y-2">
          <div
            class="font-outfit font-black text-5xl sm:text-6xl text-white tracking-tight transition-all duration-200"
            :class="questionAnim ? 'scale-110 opacity-0' : 'scale-100 opacity-100'"
          >{{ currentQuestion?.question }}</div>
          <div class="text-sm text-surface-500">Soal #{{ questionNumber }} dari {{ totalQuestions }}</div>
        </div>

        <!-- Floating feedback labels -->
        <Transition name="pop">
          <div
            v-if="feedbackLabel"
            class="absolute top-1/2 -translate-y-20 text-3xl font-outfit font-black pointer-events-none"
            :class="feedbackColor"
          >{{ feedbackLabel }}</div>
        </Transition>

        <!-- Answer Options (4 choices) -->
        <div class="grid grid-cols-2 gap-3 w-full">
          <button
            v-for="(opt, i) in currentOptions"
            :key="i"
            @click="answerQuestion(opt)"
            :disabled="answered"
            class="relative py-5 px-4 rounded-2xl text-xl sm:text-2xl font-outfit font-black border transition-all duration-200 overflow-hidden"
            :class="optionClass(opt)"
          >
            <span class="relative z-10">{{ opt }}</span>
          </button>
        </div>

        <!-- Mode-specific info row -->
        <div class="flex items-center justify-between w-full text-xs text-surface-500 px-1">
          <span>{{ modeLabel }}</span>
          <span v-if="selectedMode === 'survival'" class="text-amber-400 font-semibold">{{ timeLeft }}s restante</span>
          <span v-if="selectedMode === 'speed'">{{ questionNumber }}/{{ totalQuestions }}</span>
          <span v-if="selectedMode === 'streak'" class="text-brand-400 font-semibold">Streak: {{ streakCount }}</span>
        </div>
      </div>
    </Transition>

    <!-- ────────── GAME OVER / RESULTS SCREEN ────────── -->
    <Transition name="scale-fade">
      <div v-if="gamePhase === 'result'" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div class="card-glass max-w-sm w-full mx-4 p-8 text-center space-y-6">
          <!-- Icon -->
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto border"
            :class="isNewBest ? 'bg-amber-500/15 border-amber-500/40' : 'bg-brand-500/15 border-brand-500/40'"
          >
            {{ isNewBest ? '🏆' : score > 0 ? '🧮' : '😵' }}
          </div>

          <div class="space-y-2">
            <div v-if="isNewBest" class="text-xs font-bold text-amber-400 uppercase tracking-widest animate-pulse">New Best Score!</div>
            <h2 class="font-outfit font-black text-4xl text-white">{{ score.toLocaleString() }}</h2>
            <p class="text-sm text-surface-400">{{ resultMessage }}</p>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-white/5 rounded-xl p-3 border border-white/5">
              <div class="text-lg font-bold text-white">{{ correctCount }}</div>
              <div class="text-[11px] text-surface-500">Benar</div>
            </div>
            <div class="bg-white/5 rounded-xl p-3 border border-white/5">
              <div class="text-lg font-bold text-white">{{ wrongCount }}</div>
              <div class="text-[11px] text-surface-500">Salah</div>
            </div>
            <div class="bg-white/5 rounded-xl p-3 border border-white/5">
              <div class="text-lg font-bold text-amber-400">{{ maxCombo }}</div>
              <div class="text-[11px] text-surface-500">Max Combo</div>
            </div>
          </div>

          <!-- Accuracy bar -->
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs">
              <span class="text-surface-500">Akurasi</span>
              <span class="font-bold" :class="accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-red-400'">
                {{ accuracy }}%
              </span>
            </div>
            <div class="h-1.5 bg-surface-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                :class="accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'"
                :style="{ width: accuracy + '%' }"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <PressableBtn @click="startGame" class="btn-primary w-full justify-center text-sm py-2.5 font-bold">
              Main Lagi
            </PressableBtn>
            <PressableBtn @click="goToMenu" class="btn-ghost w-full justify-center text-sm py-2.5 font-semibold">
              Ganti Mode
            </PressableBtn>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useAppStore } from '~/stores'
import { useHaptics } from '~/composables/useHaptics'

useSeoMeta({
  title: 'Math Blitz — PlayWithMe',
  description: 'Uji kecepatan berhitung Anda! Game matematika cepat dengan mode Speed, Survival, dan Streak. Jawab soal sebelum waktu habis!',
})

// ── Types ─────────────────────────────────────────────────────────────────────
type GameMode = 'speed' | 'survival' | 'streak'
type Difficulty = 'easy' | 'medium' | 'hard'
type Category = 'add' | 'sub' | 'mul' | 'div' | 'pow' | 'mixed'
interface Question {
  question: string
  answer: number
  category: Category
}

// ── Store & composables ───────────────────────────────────────────────────────
const store = useAppStore()
const haptics = useHaptics()

// ── Game Config ───────────────────────────────────────────────────────────────
const modes = [
  { id: 'speed' as GameMode, emoji: '⚡', name: 'Speed Round', desc: '20 soal, setiap soal ada batas waktu.' },
  { id: 'survival' as GameMode, emoji: '❤️', name: 'Survival', desc: 'Bertahan dari soal tanpa henti selama 90 detik.' },
  { id: 'streak' as GameMode, emoji: '🔥', name: 'Streak', desc: 'Jawab benar terus! 3 salah = game over.' },
]

const difficulties = [
  { id: 'easy' as Difficulty, label: 'Easy 🌱', activeClass: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300' },
  { id: 'medium' as Difficulty, label: 'Medium 🔥', activeClass: 'bg-amber-500/20 border-amber-500/60 text-amber-300' },
  { id: 'hard' as Difficulty, label: 'Hard 💀', activeClass: 'bg-red-500/20 border-red-500/60 text-red-300' },
]

// ── State ──────────────────────────────────────────────────────────────────────
const selectedMode = ref<GameMode>('speed')
const selectedDifficulty = ref<Difficulty>('medium')
const gamePhase = ref<'menu' | 'playing' | 'result'>('menu')

const score = ref(0)
const lives = ref(3)
const maxLives = ref(3)
const combo = ref(0)
const maxCombo = ref(0)
const comboLevel = computed(() => Math.floor(combo.value / 3))
const streakCount = ref(0)

const correctCount = ref(0)
const wrongCount = ref(0)
const accuracy = computed(() => {
  const total = correctCount.value + wrongCount.value
  if (total === 0) return 0
  return Math.round((correctCount.value / total) * 100)
})

const questionNumber = ref(0)
const totalQuestions = ref(20)
const answered = ref(false)
const correctAnswer = ref<number | null>(null)
const selectedAnswer = ref<number | null>(null)

const currentQuestion = ref<Question | null>(null)
const currentOptions = ref<number[]>([])

const timeLeft = ref(90)
const questionTimeLeft = ref(10)
const questionTimeMax = ref(10)
const timerPercent = computed(() => (questionTimeLeft.value / questionTimeMax.value) * 100)
const timerBarColor = computed(() => {
  if (timerPercent.value > 60) return 'bg-emerald-500'
  if (timerPercent.value > 30) return 'bg-amber-500'
  return 'bg-red-500'
})

const feedbackLabel = ref('')
const feedbackColor = ref('')
const flashCorrect = ref(false)
const flashWrong = ref(false)
const questionAnim = ref(false)

const isNewBest = ref(false)
const resultMessage = ref('')

// ── Timers ────────────────────────────────────────────────────────────────────
let questionTimer: ReturnType<typeof setInterval> | null = null
let survivalTimer: ReturnType<typeof setInterval> | null = null

const clearTimers = () => {
  if (questionTimer) { clearInterval(questionTimer); questionTimer = null }
  if (survivalTimer) { clearInterval(survivalTimer); survivalTimer = null }
}

onUnmounted(clearTimers)

// ── Difficulty config ─────────────────────────────────────────────────────────
const getDiffConfig = () => {
  switch (selectedDifficulty.value) {
    case 'easy':   return { maxNum: 20, ops: ['add', 'sub'] as Category[], questionTime: 12, scoreBase: 100 }
    case 'medium': return { maxNum: 50, ops: ['add', 'sub', 'mul'] as Category[], questionTime: 9, scoreBase: 150 }
    case 'hard':   return { maxNum: 100, ops: ['add', 'sub', 'mul', 'div', 'pow'] as Category[], questionTime: 7, scoreBase: 250 }
  }
}

// ── Question generation ───────────────────────────────────────────────────────
const generateQuestion = (): Question => {
  const cfg = getDiffConfig()
  const cat = cfg.ops[Math.floor(Math.random() * cfg.ops.length)] as Category
  const max = cfg.maxNum

  let a: number, b: number, question: string, answer: number

  if (cat === 'add') {
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * max) + 1
    question = `${a} + ${b}`
    answer = a + b
  } else if (cat === 'sub') {
    a = Math.floor(Math.random() * max) + 10
    b = Math.floor(Math.random() * (a - 1)) + 1
    question = `${a} − ${b}`
    answer = a - b
  } else if (cat === 'mul') {
    a = Math.floor(Math.random() * (selectedDifficulty.value === 'hard' ? 20 : 12)) + 2
    b = Math.floor(Math.random() * 12) + 2
    question = `${a} × ${b}`
    answer = a * b
  } else if (cat === 'div') {
    b = Math.floor(Math.random() * 12) + 2
    answer = Math.floor(Math.random() * 12) + 1
    a = b * answer
    question = `${a} ÷ ${b}`
  } else { // pow
    a = Math.floor(Math.random() * 10) + 2
    b = Math.floor(Math.random() * 3) + 2
    question = `${a}²` // square only for simplicity
    answer = a * a
    if (b === 3 && a <= 6) { question = `${a}³`; answer = a * a * a }
  }

  return { question: `${question} = ?`, answer: answer!, category: cat }
}

const generateOptions = (answer: number): number[] => {
  const options = new Set<number>([answer])
  const spread = Math.max(5, Math.floor(Math.abs(answer) * 0.3))

  while (options.size < 4) {
    const delta = Math.floor(Math.random() * spread) + 1
    const sign = Math.random() > 0.5 ? 1 : -1
    const wrong = answer + sign * delta
    if (wrong !== answer && wrong > 0) options.add(wrong)
  }

  return [...options].sort(() => Math.random() - 0.5)
}

// ── Category badge ─────────────────────────────────────────────────────────────
const categoryBadge = computed(() => {
  const map: Record<Category, { label: string; icon: string; class: string }> = {
    add:   { label: 'Penjumlahan', icon: '➕', class: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
    sub:   { label: 'Pengurangan', icon: '➖', class: 'bg-blue-500/15 border-blue-500/40 text-blue-300' },
    mul:   { label: 'Perkalian',   icon: '✖️',  class: 'bg-amber-500/15 border-amber-500/40 text-amber-300' },
    div:   { label: 'Pembagian',   icon: '➗', class: 'bg-purple-500/15 border-purple-500/40 text-purple-300' },
    pow:   { label: 'Perpangkatan', icon: '💫', class: 'bg-rose-500/15 border-rose-500/40 text-rose-300' },
    mixed: { label: 'Campuran',    icon: '🎲', class: 'bg-brand-500/15 border-brand-500/40 text-brand-300' },
  }
  return map[currentQuestion.value?.category ?? 'add']
})

const modeLabel = computed(() => {
  if (selectedMode.value === 'speed') return `⚡ Speed — ${getDiffConfig().questionTime}s per soal`
  if (selectedMode.value === 'survival') return `❤️ Survival — ${maxLives.value} nyawa`
  return `🔥 Streak — 3 nyawa`
})

// ── Option button classes ──────────────────────────────────────────────────────
const optionClass = (opt: number) => {
  if (!answered.value) {
    return 'bg-white/5 border-white/10 text-white hover:bg-brand-500/20 hover:border-brand-500/50 hover:scale-[1.03] active:scale-95 cursor-pointer'
  }
  if (opt === correctAnswer.value) {
    return 'bg-emerald-500/25 border-emerald-400/60 text-emerald-200 scale-105 shadow-lg shadow-emerald-500/20 cursor-default'
  }
  if (opt === selectedAnswer.value && opt !== correctAnswer.value) {
    return 'bg-red-500/25 border-red-400/60 text-red-200 cursor-default'
  }
  return 'bg-white/3 border-white/5 text-surface-600 cursor-default'
}

// ── Start / Reset game ────────────────────────────────────────────────────────
const startGame = () => {
  clearTimers()
  score.value = 0
  lives.value = selectedMode.value === 'streak' ? 3 : selectedMode.value === 'survival' ? 5 : 3
  maxLives.value = lives.value
  combo.value = 0
  maxCombo.value = 0
  streakCount.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  questionNumber.value = 0
  totalQuestions.value = selectedMode.value === 'speed' ? 20 : 999
  timeLeft.value = 90
  isNewBest.value = false
  feedbackLabel.value = ''
  answered.value = false

  gamePhase.value = 'playing'

  // Survival global timer
  if (selectedMode.value === 'survival') {
    survivalTimer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) endGame()
    }, 1000)
  }

  nextQuestion()
}

const goToMenu = () => {
  clearTimers()
  gamePhase.value = 'menu'
}

// ── Question flow ─────────────────────────────────────────────────────────────
const nextQuestion = () => {
  if (gamePhase.value !== 'playing') return

  // End for speed mode
  if (selectedMode.value === 'speed' && questionNumber.value >= totalQuestions.value) {
    endGame()
    return
  }

  questionNumber.value++
  const q = generateQuestion()
  currentQuestion.value = q
  currentOptions.value = generateOptions(q.answer)
  correctAnswer.value = q.answer
  selectedAnswer.value = null
  answered.value = false
  feedbackLabel.value = ''

  // Animate question in
  questionAnim.value = true
  setTimeout(() => { questionAnim.value = false }, 50)

  // Per-question timer
  const cfg = getDiffConfig()
  questionTimeMax.value = cfg.questionTime
  questionTimeLeft.value = cfg.questionTime

  if (questionTimer) clearInterval(questionTimer)
  questionTimer = setInterval(() => {
    questionTimeLeft.value -= 0.1
    if (questionTimeLeft.value <= 0) {
      clearInterval(questionTimer!)
      handleTimeout()
    }
  }, 100)
}

const handleTimeout = () => {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = -999 // marks timeout

  combo.value = 0
  wrongCount.value++

  feedbackLabel.value = '⏱️ Waktu Habis!'
  feedbackColor.value = 'text-amber-400'

  loseLife()
}

const answerQuestion = (opt: number) => {
  if (answered.value) return
  if (questionTimer) { clearInterval(questionTimer); questionTimer = null }
  answered.value = true
  selectedAnswer.value = opt

  if (opt === correctAnswer.value) {
    // Correct!
    combo.value++
    if (combo.value > maxCombo.value) maxCombo.value = combo.value
    streakCount.value++
    correctCount.value++

    const cfg = getDiffConfig()
    const timeBonus = Math.max(0, Math.floor(questionTimeLeft.value * 10))
    const comboBonus = 1 + (combo.value >= 10 ? 2 : combo.value >= 5 ? 1 : combo.value >= 3 ? 0.5 : 0)
    const earned = Math.round((cfg.scoreBase + timeBonus) * comboBonus)
    score.value += earned

    const labels = ['✓ Benar!', '💥 Keren!', '⚡ Cepat!', '🔥 Yes!', '💫 Mantap!']
    feedbackLabel.value = combo.value >= 5
      ? `🔥 ${combo.value}x Combo! +${earned}`
      : (labels[Math.min(combo.value - 1, labels.length - 1)] ?? '✓') + ` +${earned}`
    feedbackColor.value = 'text-emerald-400'

    flashCorrect.value = true
    haptics.success()
    setTimeout(() => { flashCorrect.value = false }, 400)

    setTimeout(() => { feedbackLabel.value = ''; nextQuestion() }, 700)
  } else {
    // Wrong!
    combo.value = 0
    wrongCount.value++

    feedbackLabel.value = `✗ ${correctAnswer.value}`
    feedbackColor.value = 'text-red-400'

    flashWrong.value = true
    haptics.destructive()
    setTimeout(() => { flashWrong.value = false }, 400)

    loseLife()
  }
}

const loseLife = () => {
  lives.value--

  const isElimination = (selectedMode.value === 'streak' || selectedMode.value === 'survival') && lives.value <= 0
  const isSpeedMode = selectedMode.value === 'speed' && lives.value <= 0

  if (isElimination || isSpeedMode) {
    setTimeout(() => { endGame() }, 800)
    return
  }

  // For speed mode: just continue with next question after delay
  setTimeout(() => { feedbackLabel.value = ''; nextQuestion() }, 800)
}

// ── End game ──────────────────────────────────────────────────────────────────
const endGame = () => {
  clearTimers()
  gamePhase.value = 'result'

  const newBest = store.updateHighScore('mathblitz', score.value)
  isNewBest.value = newBest

  const total = correctCount.value + wrongCount.value
  const acc = total > 0 ? Math.round((correctCount.value / total) * 100) : 0

  if (acc >= 90) resultMessage.value = 'Luar biasa! Kecepatan dan akurasi sempurna.'
  else if (acc >= 70) resultMessage.value = 'Bagus! Terus latih kecepatan berhitungmu.'
  else if (acc >= 50) resultMessage.value = 'Lumayan! Masih banyak ruang untuk berkembang.'
  else resultMessage.value = 'Teruslah berlatih! Matematika butuh konsistensi.'
}

// ── Mode label for ongoing display ───────────────────────────────────────────
watch(gamePhase, (v) => { if (v !== 'playing') clearTimers() })
</script>

<style scoped>
/* Screen flash effects */
.flash-correct {
  animation: flashGreen 0.4s ease-out;
}
.flash-wrong {
  animation: flashRed 0.4s ease-out;
}

@keyframes flashGreen {
  0%   { background-color: rgba(16, 185, 129, 0); }
  30%  { background-color: rgba(16, 185, 129, 0.12); }
  100% { background-color: rgba(16, 185, 129, 0); }
}
@keyframes flashRed {
  0%   { background-color: rgba(239, 68, 68, 0); }
  30%  { background-color: rgba(239, 68, 68, 0.12); }
  100% { background-color: rgba(239, 68, 68, 0); }
}

/* Scale-fade transition */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

/* Pop feedback */
.pop-enter-active  { animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-leave-active  { animation: popOut 0.2s ease-in forwards; }
@keyframes popIn   { from { opacity: 0; transform: scale(0.5) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes popOut  { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.8) translateY(-16px); } }

/* Floating animation for menu emoji */
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
</style>
