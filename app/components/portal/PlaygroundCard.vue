<template>
  <NuxtLink
    ref="cardRef"
    :to="to"
    v-bind="bind"
    @pointermove="onMouseMove"
    @pointerleave="onMouseLeave"
    :class="[
      'relative block card-glass p-6 overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
      isPressed ? 'scale-[0.94] opacity-85' : 'hover:scale-[1.02]'
    ]"
    :style="cardStyle"
  >
    <!-- Background Radial Glow (Hover cursor spotlight) -->
    <div 
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none spotlight-glow" 
      :class="{ 'opacity-100': isHovered }"
    />

    <!-- Ambient Corner Glow (Static color cue) -->
    <div 
      class="absolute -top-12 -left-12 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-300"
      :class="glowColorClass"
    />

    <div class="relative z-10 flex flex-col h-full justify-between gap-4">
      <div>
        <!-- Card Header (Emoji & Badge) -->
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 shadow-inner overflow-hidden select-none">
            <!-- Interactive Previews -->
            <template v-if="isHovered">
              <!-- Galaxy -->
              <div v-if="title.includes('Galaxy')" class="relative w-full h-full flex items-center justify-center">
                <div class="w-3.5 h-3.5 rounded-full bg-indigo-400 blur-[1px] animate-pulse" />
                <div class="absolute w-7 h-7 rounded-full border border-dashed border-indigo-400/30 animate-[spin_3s_linear_infinite]" />
                <div class="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <div class="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-purple-400" />
              </div>
              <!-- Physics -->
              <div v-else-if="title.includes('Physics')" class="relative w-full h-full flex items-center justify-center">
                <div class="w-4 h-4 rounded-full bg-cyan-400 animate-[bounce_0.8s_infinite_ease-in-out] shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <div class="absolute bottom-1.5 w-6 h-0.5 bg-white/20 rounded-full" />
              </div>
              <!-- Generative -->
              <div v-else-if="title.includes('Generative')" class="relative w-full h-full flex items-center justify-center animate-[spin_5s_linear_infinite]">
                <svg class="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="8" stroke-dasharray="4 2" />
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                </svg>
              </div>
              <!-- Audio -->
              <div v-else-if="title.includes('Audio')" class="relative w-full h-full flex items-end justify-center gap-0.5 pb-2 origin-bottom">
                <div class="w-1 h-6 bg-pink-500 rounded-t animate-[barUp_0.6s_infinite_alternate_ease-in-out] origin-bottom" />
                <div class="w-1 h-8 bg-purple-500 rounded-t animate-[barUp_0.8s_infinite_alternate_ease-in-out_0.2s] origin-bottom" />
                <div class="w-1 h-5 bg-accent-500 rounded-t animate-[barUp_0.5s_infinite_alternate_ease-in-out_0.1s] origin-bottom" />
              </div>
              <!-- Matrix -->
              <div v-else-if="title.includes('Matrix')" class="relative w-full h-full overflow-hidden flex justify-around items-start pt-1.5 font-mono text-[8px] text-emerald-400 leading-none">
                <div class="flex flex-col animate-[matrixFall_1.2s_infinite_linear]">
                  <span>0</span><span>1</span><span>0</span>
                </div>
                <div class="flex flex-col animate-[matrixFall_1.5s_infinite_linear_0.3s]">
                  <span>1</span><span>0</span><span>1</span>
                </div>
                <div class="flex flex-col animate-[matrixFall_1.0s_infinite_linear_0.1s]">
                  <span>0</span><span>1</span><span>1</span>
                </div>
              </div>
              <!-- Fluid -->
              <div v-else-if="title.includes('Fluid')" class="relative w-full h-full flex items-center justify-center">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 blur-[1px] animate-[liquidBlob_3s_infinite_alternate_ease-in-out]" />
              </div>
              <!-- Snake -->
              <div v-else-if="title.includes('Snake')" class="relative w-full h-full p-1.5">
                <div class="w-full h-full border border-dashed border-amber-500/30 rounded-lg relative overflow-hidden">
                  <div class="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <div class="absolute top-1 left-3.5 w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                  <div class="absolute top-3.5 left-3.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                </div>
              </div>
              <!-- Memory -->
              <div v-else-if="title.includes('Memory')" class="relative w-full h-full flex items-center justify-center perspective-100">
                <div class="w-5 h-7 rounded bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-400 flex items-center justify-center font-bold text-[10px] animate-[cardFlip_1.5s_infinite_ease-in-out] transform-style-3d text-white">
                  ?
                </div>
              </div>
              <span v-else>{{ icon }}</span>
            </template>
            <span v-else>{{ icon }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span 
              v-if="tag" 
              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-pulse"
            >
              {{ tag }}
            </span>
            <span 
              class="px-2 py-0.5 rounded text-[10px] font-medium tracking-wide border" 
              :class="difficultyClass"
            >
              {{ difficulty }}
            </span>
          </div>
        </div>

        <!-- Title & Description -->
        <h3 class="font-outfit font-bold text-xl text-white mb-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-400 group-hover:to-accent-400">
          {{ title }}
        </h3>
        <p class="text-surface-400 text-sm leading-relaxed mb-4">
          {{ description }}
        </p>
      </div>

      <!-- Play Action Indicator -->
      <div class="flex items-center gap-1.5 text-xs font-semibold text-brand-400 group-hover:text-brand-300 transition-colors mt-auto">
        <span>Play Demo</span>
        <svg class="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePressable } from '~/composables/usePressable'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🎮'
  },
  difficulty: {
    type: String,
    default: 'Medium' // Easy, Medium, Hard
  },
  tag: {
    type: String,
    default: '' // e.g. 'NEW', 'HOT'
  },
  themeColor: {
    type: String,
    default: 'indigo' // indigo, pink, cyan, gold
  }
})

const cardRef = ref<any>(null)
const rx = ref(0)
const ry = ref(0)
const gx = ref(0)
const gy = ref(0)
const isHovered = ref(false)

const { isPressed, bind } = usePressable()

const onMouseMove = (e: PointerEvent) => {
  const el = cardRef.value?.$el || cardRef.value
  if (!el) return
  isHovered.value = true
  
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  gx.value = x
  gy.value = y

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Maximum tilt angle: 10 degrees
  ry.value = ((x - centerX) / centerX) * 10
  rx.value = ((centerY - y) / centerY) * -10
}

const onMouseLeave = () => {
  isHovered.value = false
  rx.value = 0
  ry.value = 0
}

const cardStyle = computed(() => {
  const transform = isHovered.value
    ? `perspective(1000px) rotateX(${rx.value}deg) rotateY(${ry.value}deg) scale3d(1.015, 1.015, 1.015)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

  return {
    transform,
    transition: isHovered.value ? 'transform 0.05s ease-out' : 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
    '--x': `${gx.value}px`,
    '--y': `${gy.value}px`
  }
})

const glowColorClass = computed(() => {
  switch (props.themeColor) {
    case 'pink': return 'bg-accent-500'
    case 'cyan': return 'bg-cyan-500'
    case 'gold': return 'bg-amber-500'
    case 'indigo':
    default:
      return 'bg-brand-500'
  }
})

const difficultyClass = computed(() => {
  switch (props.difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-500/10 text-green-400 border-green-500/20'
    case 'hard':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'medium':
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  }
})
</script>

<style scoped>
.card-glass {
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.15s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  transform-style: preserve-3d;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.card-glass:hover {
  border-color: oklch(100% 0 0 / 0.22);
  box-shadow: 
    0 15px 35px oklch(0% 0 0 / 0.35),
    0 0 25px var(--glow-color, oklch(62% 0.2 265 / 0.1));
}

.spotlight-glow {
  background: radial-gradient(
    circle 150px at var(--x, 0px) var(--y, 0px),
    oklch(62% 0.2 265 / 0.12) 0%,
    oklch(62% 0.25 310 / 0.05) 50%,
    transparent 100%
  );
}

/* Mini hover preview animations */
@keyframes barUp {
  0% { transform: scaleY(0.25); }
  100% { transform: scaleY(1); }
}

@keyframes matrixFall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes liquidBlob {
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  100% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
}

@keyframes cardFlip {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
</style>
