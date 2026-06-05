<template>
  <footer class="border-t border-white/5 bg-surface-950/80 backdrop-blur-md relative z-40">
    <div class="max-w-7xl mx-auto section-padding py-12">
      <!-- Top Section -->
      <div class="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
        <!-- Brand / About -->
        <div class="max-w-md">
          <NuxtLink to="/" class="flex items-center gap-3 mb-4 group">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <span class="text-white font-black text-sm font-outfit">P</span>
            </div>
            <span class="font-outfit font-bold text-lg text-white">
              Play<span class="text-gradient">WithMe</span>
            </span>
          </NuxtLink>
          <p class="text-surface-400 text-sm leading-relaxed">
            Sebuah portfolio taman bermain interaktif untuk mendemonstrasikan kapabilitas pemrograman web tingkat lanjut, animasi, dan Web APIs secara real-time.
          </p>
        </div>

        <!-- Links Columns -->
        <div class="flex gap-16">
          <div class="space-y-3">
            <h3 class="font-bold font-outfit text-white text-xs uppercase tracking-wider">Navigasi</h3>
            <ul class="space-y-2">
              <li v-for="link in navLinks" :key="link.label">
                <NuxtLink
                  :to="link.to"
                  class="text-surface-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
          
          <div class="space-y-3">
            <h3 class="font-bold font-outfit text-white text-xs uppercase tracking-wider">Socials</h3>
            <ul class="space-y-2">
              <li v-for="social in socials" :key="social.label">
                <a
                  :href="social.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-surface-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>{{ social.label }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
        <p class="text-surface-500 text-xs">
          © {{ new Date().getFullYear() }} PlayWithMe. Dibuat dengan dedikasi tinggi menggunakan Nuxt 4 & Tailwind 4.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-surface-500 hover:text-white text-xs transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="text-surface-500 hover:text-white text-xs transition-colors">Terms of Service</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Playground', to: '/playground' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Twitter/X', href: 'https://x.com' },
]
</script>
