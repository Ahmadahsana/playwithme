<template>
  <div class="relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-grid opacity-50" />
    <div class="absolute inset-0 noise-texture" />
    
    <!-- Gradient Orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-600/15 rounded-full blur-3xl animate-float" style="animation-delay: -3s;" />
    <div class="absolute top-3/4 left-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl animate-float" style="animation-delay: -1.5s;" />

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center section-padding py-24">
      <div class="max-w-5xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          ✨ Nuxt 4 + Tailwind CSS 4 — Built for the Future
        </div>

        <!-- Heading -->
        <h1 class="font-outfit font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none mb-6 animate-slide-up">
          Let's
          <span class="text-gradient block sm:inline"> Play</span>
          <br class="hidden sm:block">
          <span class="text-white">Together</span>
        </h1>

        <!-- Subtitle -->
        <p class="max-w-2xl mx-auto text-lg sm:text-xl text-surface-300 leading-relaxed mb-10 animate-slide-up" style="animation-delay: 0.1s;">
          An ultra-modern interactive platform crafted with <strong class="text-white">Nuxt 4</strong> and 
          <strong class="text-white">Tailwind CSS 4</strong>. Fast, beautiful, and built to impress.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style="animation-delay: 0.2s;">
          <NuxtLink to="/explore" id="hero-explore-btn" class="btn-primary text-base px-8 py-4 animate-pulse-glow">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Exploring
          </NuxtLink>
          <NuxtLink to="/features" id="hero-features-btn" class="btn-ghost text-base px-8 py-4">
            View Features
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Stats -->
        <div class="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in" style="animation-delay: 0.4s;">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="font-outfit font-black text-3xl text-white">{{ stat.value }}</div>
            <div class="text-surface-400 text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative section-padding py-24">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-4">
            🚀 Features
          </div>
          <h2 class="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
            Everything you need
            <span class="text-gradient block">to build amazing things</span>
          </h2>
          <p class="text-surface-400 max-w-xl mx-auto text-lg">
            Packed with powerful features and stunning design patterns to kickstart your next project.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card-glass p-6 group cursor-default"
          >
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110" :class="feature.iconBg">
              {{ feature.icon }}
            </div>
            <h3 class="font-outfit font-bold text-xl text-white mb-2 group-hover:text-gradient transition-all duration-300">
              {{ feature.title }}
            </h3>
            <p class="text-surface-400 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="relative section-padding py-24 bg-surface-900/30">
      <div class="max-w-7xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
          ⚡ Tech Stack
        </div>
        <h2 class="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
          Powered by the
          <span class="text-gradient"> latest tech</span>
        </h2>
        <p class="text-surface-400 max-w-xl mx-auto text-lg mb-16">
          Built on cutting-edge technologies to ensure top performance and developer experience.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="card-glass p-5 flex flex-col items-center gap-3 group"
          >
            <span class="text-3xl transition-transform duration-300 group-hover:scale-125">{{ tech.logo }}</span>
            <span class="text-surface-300 text-sm font-medium group-hover:text-white transition-colors">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative section-padding py-32">
      <div class="max-w-4xl mx-auto text-center">
        <div class="card-glass p-12 relative overflow-hidden">
          <!-- Inner glow -->
          <div class="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-accent-600/10 rounded-2xl" />
          <div class="relative">
            <h2 class="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
              Ready to <span class="text-gradient">play?</span>
            </h2>
            <p class="text-surface-400 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of users exploring the platform. Start your journey today — it's free!
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/auth/register" id="cta-register-btn" class="btn-primary text-base px-8 py-4">
                Create Free Account
              </NuxtLink>
              <NuxtLink to="/explore" id="cta-explore-btn" class="btn-ghost text-base px-8 py-4">
                Explore First
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'PlayWithMe — Your Modern Interactive Platform',
  description: 'An ultra-modern interactive platform built with Nuxt 4 and Tailwind CSS 4. Fast, beautiful, and built to impress.',
  ogTitle: 'PlayWithMe — Your Modern Interactive Platform',
  ogDescription: 'An ultra-modern interactive platform built with Nuxt 4 and Tailwind CSS 4.',
})

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'User Rating' },
  { value: '50+', label: 'Features' },
]

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Powered by Nuxt 4 server-side rendering and Nitro engine for blazing-fast performance.',
    iconBg: 'bg-yellow-500/10 text-yellow-400',
  },
  {
    icon: '🎨',
    title: 'Beautiful UI',
    description: 'Crafted with Tailwind CSS 4 and modern design patterns. Dark mode by default with stunning glassmorphism.',
    iconBg: 'bg-pink-500/10 text-pink-400',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    description: 'Perfectly optimized for all screen sizes, from mobile phones to ultra-wide displays.',
    iconBg: 'bg-brand-500/10 text-brand-400',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description: 'Built with security best practices in mind. Authentication-ready with modern security patterns.',
    iconBg: 'bg-green-500/10 text-green-400',
  },
  {
    icon: '🚀',
    title: 'SSR & SSG Ready',
    description: 'Choose between server-side rendering, static generation, or hybrid rendering modes.',
    iconBg: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: '🛠️',
    title: 'Developer First',
    description: 'TypeScript-first, auto-imports, hot reload, and excellent DevTools integration.',
    iconBg: 'bg-orange-500/10 text-orange-400',
  },
]

const techStack = [
  { name: 'Nuxt 4', logo: '💚' },
  { name: 'Vue 3', logo: '🟢' },
  { name: 'Tailwind v4', logo: '🎨' },
  { name: 'TypeScript', logo: '🔷' },
  { name: 'Vite', logo: '⚡' },
  { name: 'Nitro', logo: '🚀' },
]
</script>
