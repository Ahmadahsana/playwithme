<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent'"
  >
    <nav class="max-w-7xl mx-auto section-padding py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <AppLogo container-class="w-9 h-9" />
        <span class="font-outfit font-bold text-xl text-white">
          ahmad<span class="text-gradient">dev</span>
        </span>
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/8"
          active-class="text-white bg-white/10"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Social / Action button on Desktop -->
      <div class="hidden md:flex items-center gap-3">
        <a
          :href="profile.socials.github"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-ghost px-4! py-2! text-sm! flex items-center gap-1.5"
        >
          <span>GitHub</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 rounded-lg text-surface-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle mobile menu"
      >
        <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-white/10 bg-surface-950/95 backdrop-blur-xl"
      >
        <div class="max-w-7xl mx-auto section-padding py-4 flex flex-col gap-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-3 text-sm font-medium text-surface-300 hover:text-white rounded-xl transition-all duration-200 hover:bg-white/8"
            active-class="text-white bg-white/10"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <div class="pt-2 border-t border-white/10 mt-2">
            <a
              :href="profile.socials.github"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-ghost py-2! w-full justify-center text-sm! flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Spacer for fixed navbar -->
  <div class="h-[73px]" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { profile } from '~/data/profile'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Playground', to: '/playground' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
</script>
