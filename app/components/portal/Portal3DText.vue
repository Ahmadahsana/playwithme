<template>
  <div 
    class="relative select-none cursor-default py-10 flex flex-col items-center justify-center text-center font-outfit"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :style="parallaxStyles"
  >
    <!-- Cyan Layer (Deepest back layer) -->
    <h1 class="absolute font-black text-accent-500/70 mix-blend-screen pointer-events-none layer-c select-none" :class="sizeClass">
      PLAY WITH ME
    </h1>

    <!-- Magenta Layer (Back layer) -->
    <h1 class="absolute font-black text-brand-500/70 mix-blend-screen pointer-events-none layer-m select-none" :class="sizeClass">
      PLAY WITH ME
    </h1>

    <!-- Glow/Neon Shadow Layer (Floating front layer) -->
    <h1 class="absolute font-black text-transparent outline-glow pointer-events-none layer-glow select-none" :class="sizeClass">
      PLAY WITH ME
    </h1>

    <!-- White Base Layer (Main centered layer) with Cyberpunk Glitch on Hover -->
    <h1
      class="font-black text-white relative z-10 transition-all duration-300 group layer-base"
      :class="[sizeClass, { 'glitch-active': isHovered }]"
    >
      PLAY WITH ME
    </h1>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// All four stacked layers must share the same size so they align.
defineProps({
  sizeClass: {
    type: String,
    default: 'text-6xl sm:text-8xl md:text-9xl',
  },
})

const mx = ref(0)
const my = ref(0)
const isHovered = ref(false)

const onPointerMove = (e: PointerEvent) => {
  isHovered.value = true
  const w = window.innerWidth
  const h = window.innerHeight
  // Normalize cursor position between -0.5 and 0.5 relative to screen center
  mx.value = (e.clientX / w) - 0.5
  my.value = (e.clientY / h) - 0.5
}

const onPointerLeave = () => {
  isHovered.value = false
  // Return to center smoothly
  mx.value = 0
  my.value = 0
}

const handleGlobalPointerMove = (e: PointerEvent) => {
  // If not hovered over the element, still apply a very subtle global parallax
  if (!isHovered.value) {
    const w = window.innerWidth
    const h = window.innerHeight
    mx.value = ((e.clientX / w) - 0.5) * 0.55
    my.value = ((e.clientY / h) - 0.5) * 0.55
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('pointermove', handleGlobalPointerMove)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', handleGlobalPointerMove)
  }
})

const parallaxStyles = computed(() => {
  // Displacements (maximum px displacement)
  const cX = mx.value * -32
  const cY = my.value * -32
  
  const mX = mx.value * -16
  const mY = my.value * -16
  
  const gX = mx.value * 12
  const gY = my.value * 12

  return {
    '--tx-c': `${cX}px`,
    '--ty-c': `${cY}px`,
    '--tx-m': `${mX}px`,
    '--ty-m': `${mY}px`,
    '--tx-g': `${gX}px`,
    '--ty-g': `${gY}px`
  }
})
</script>

<style scoped>
.layer-c {
  transform: translate3d(var(--tx-c, 0px), var(--ty-c, 0px), 0);
  transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: blur(0.5px);
}

.layer-m {
  transform: translate3d(var(--tx-m, 0px), var(--ty-m, 0px), 0);
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: blur(0.3px);
}

.layer-glow {
  transform: translate3d(var(--tx-g, 0px), var(--ty-g, 0px), 0);
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.outline-glow {
  -webkit-text-stroke: 1.5px oklch(62% 0.25 310 / 0.5); /* pink accent stroke */
  filter: drop-shadow(0 0 10px oklch(62% 0.25 310 / 0.8));
}

.layer-base {
  text-shadow: 0 0 15px oklch(100% 0 0 / 0.1);
  transition: text-shadow 0.3s ease;
}

.glitch-active {
  animation: glitch 1s infinite linear alternate-reverse;
  text-shadow: 
    3px 0 0 oklch(72% 0.2 310), /* Pink */
    -3px 0 0 oklch(72% 0.16 265); /* Indigo */
}

@keyframes glitch {
  0% {
    text-shadow: 3px 2px 0 oklch(72% 0.2 310), -3px -2px 0 oklch(72% 0.16 265);
  }
  20% {
    text-shadow: -2px -3px 0 oklch(72% 0.2 310), 2px 3px 0 oklch(72% 0.16 265);
  }
  40% {
    text-shadow: 3px -1px 0 oklch(72% 0.2 310), -2px 2px 0 oklch(72% 0.16 265);
  }
  60% {
    text-shadow: -1px 3px 0 oklch(72% 0.2 310), 3px -3px 0 oklch(72% 0.16 265);
  }
  80% {
    text-shadow: 2px -2px 0 oklch(72% 0.2 310), -1px 1px 0 oklch(72% 0.16 265);
  }
  100% {
    text-shadow: -3px 1px 0 oklch(72% 0.2 310), 2px -1px 0 oklch(72% 0.16 265);
  }
}
</style>
