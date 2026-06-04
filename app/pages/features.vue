<template>
  <div class="section-padding py-24 max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
        🚀 All Features
      </div>
      <h1 class="font-outfit font-black text-5xl text-white mb-4">
        Powerful <span class="text-gradient">Features</span>
      </h1>
      <p class="text-surface-400 max-w-xl mx-auto text-lg">
        Discover everything PlayWithMe has to offer. Built for creators, developers, and explorers.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="feature in allFeatures"
        :key="feature.title"
        class="card-glass p-8 flex items-start gap-5 group"
      >
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110" :class="feature.iconBg">
          {{ feature.icon }}
        </div>
        <div>
          <h3 class="font-outfit font-bold text-xl text-white mb-2 group-hover:text-gradient transition-all duration-300">
            {{ feature.title }}
          </h3>
          <p class="text-surface-400 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Features — PlayWithMe',
  description: 'Discover all the powerful features that PlayWithMe offers.',
})

const allFeatures = [
  { icon: '⚡', title: 'Lightning Fast Performance', description: 'Powered by Nuxt 4 and Nitro engine for unmatched speed.', iconBg: 'bg-yellow-500/10' },
  { icon: '🎨', title: 'Modern UI Design', description: 'Glassmorphism, dark mode, and vibrant gradients built with Tailwind CSS 4.', iconBg: 'bg-pink-500/10' },
  { icon: '📱', title: 'Responsive Layout', description: 'Flawless across all device sizes with mobile-first design.', iconBg: 'bg-brand-500/10' },
  { icon: '🔒', title: 'Secure Authentication', description: 'Auth-ready with modern security standards and best practices.', iconBg: 'bg-green-500/10' },
  { icon: '🚀', title: 'Multiple Render Modes', description: 'SSR, SSG, and hybrid rendering with per-route configuration.', iconBg: 'bg-purple-500/10' },
  { icon: '🛠️', title: 'TypeScript First', description: 'Fully typed codebase with excellent IntelliSense support.', iconBg: 'bg-orange-500/10' },
  { icon: '🔄', title: 'Auto Imports', description: 'Components, composables, and utilities are auto-imported by Nuxt.', iconBg: 'bg-cyan-500/10' },
  { icon: '📦', title: 'Module Ecosystem', description: 'Access hundreds of official and community Nuxt modules.', iconBg: 'bg-emerald-500/10' },
]
</script>
