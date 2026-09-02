<template>
  <div
    class="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300"
    :class="containerClass"
  >
    <!-- Background Glow Container -->
    <div class="absolute inset-0 rounded-xl bg-linear-to-tr from-brand-500/30 via-accent-500/30 to-cyan-500/30 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

    <div class="relative w-full h-full rounded-xl bg-surface-900/90 border border-white/15 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:border-brand-500/40 transition-colors overflow-hidden">
      <!-- Modern Geometric Prism SVG Emblem -->
      <svg
        class="w-[68%] h-[68%] transition-transform duration-300 group-hover:rotate-6"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="50%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#d946ef" />
          </linearGradient>
          <linearGradient id="logo-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#d946ef" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
        </defs>

        <!-- Outer Hexagonal Prism Framework -->
        <polygon
          points="24,3 43,14 43,34 24,45 5,34 5,14"
          stroke="url(#logo-grad-1)"
          stroke-width="2.2"
          stroke-linejoin="round"
          fill="url(#logo-grad-1)"
          fill-opacity="0.08"
        />

        <!-- Inner Prism Structure Lines -->
        <line x1="24" y1="3" x2="24" y2="45" stroke="url(#logo-grad-1)" stroke-width="1.2" stroke-opacity="0.6" />
        <line x1="5" y1="14" x2="43" y2="34" stroke="url(#logo-grad-1)" stroke-width="1.2" stroke-opacity="0.4" />
        <line x1="5" y1="34" x2="43" y2="14" stroke="url(#logo-grad-1)" stroke-width="1.2" stroke-opacity="0.4" />

        <!-- Central Diamond Node -->
        <polygon
          points="24,14 33,24 24,34 15,24"
          stroke="url(#logo-grad-accent)"
          stroke-width="1.8"
          fill="url(#logo-grad-accent)"
          fill-opacity="0.25"
        />

        <!-- Code Bracket < (Left) -->
        <path
          d="M13 21L8 24L13 27"
          stroke="#06b6d4"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Code Bracket > (Right) -->
        <path
          d="M35 21L40 24L35 27"
          stroke="#d946ef"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Glowing Core Center Dot -->
        <circle cx="24" cy="24" r="2.2" fill="#ffffff" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    containerClass?: string
  }>(),
  {
    containerClass: 'w-9 h-9',
  }
)
</script>
