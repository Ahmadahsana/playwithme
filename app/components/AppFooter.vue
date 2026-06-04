<template>
  <footer class="border-t border-white/10 bg-surface-950">
    <div class="max-w-7xl mx-auto section-padding py-16">
      <!-- Top Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-3 mb-4 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span class="text-white font-black text-lg">P</span>
            </div>
            <span class="font-outfit font-bold text-xl text-white">
              Play<span class="text-gradient">WithMe</span>
            </span>
          </NuxtLink>
          <p class="text-surface-400 text-sm leading-relaxed">
            A modern interactive platform built with Nuxt 4 & Tailwind CSS 4 for amazing experiences.
          </p>
          <!-- Social Links -->
          <div class="flex gap-3 mt-6">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              class="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/10 hover:border-brand-500/30 flex items-center justify-center text-surface-400 hover:text-brand-400 transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path :d="social.icon" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div
          v-for="col in footerLinks"
          :key="col.title"
          class="space-y-4"
        >
          <h3 class="font-semibold text-white text-sm uppercase tracking-wider">{{ col.title }}</h3>
          <ul class="space-y-3">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="text-surface-400 hover:text-white text-sm transition-colors duration-200 hover:underline underline-offset-2"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
        <p class="text-surface-500 text-sm">
          © {{ new Date().getFullYear() }} PlayWithMe. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-surface-500 hover:text-white text-sm transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="text-surface-500 hover:text-white text-sm transition-colors">Terms of Service</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  {
    label: 'Twitter/X',
    href: '#',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.619 5.905-5.619Zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'GitHub',
    href: '#',
    icon: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z',
  },
  {
    label: 'Discord',
    href: '#',
    icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.081.114 18.104.132 18.12a19.96 19.96 0 0 0 5.993 3.031.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  },
]

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Explore', to: '/explore' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Changelog', to: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'Help Center', to: '/help' },
      { label: 'Community', to: '/community' },
      { label: 'Status', to: '/status' },
    ],
  },
]
</script>
