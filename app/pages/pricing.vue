<template>
  <div class="section-padding py-24 max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
        💎 Pricing
      </div>
      <h1 class="font-outfit font-black text-5xl text-white mb-4">
        Simple, transparent <span class="text-gradient">pricing</span>
      </h1>
      <p class="text-surface-400 max-w-xl mx-auto text-lg">
        Choose the plan that works best for you. Upgrade or downgrade anytime.
      </p>

      <!-- Toggle -->
      <div class="flex items-center justify-center gap-3 mt-8">
        <span class="text-surface-300 text-sm font-medium">Monthly</span>
        <button
          id="billing-toggle"
          class="relative w-14 h-7 rounded-full transition-colors duration-300"
          :class="isAnnual ? 'bg-brand-500' : 'bg-surface-700'"
          @click="isAnnual = !isAnnual"
          :aria-label="isAnnual ? 'Switch to monthly' : 'Switch to annual'"
        >
          <div
            class="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
            :class="isAnnual ? 'translate-x-8' : 'translate-x-1'"
          />
        </button>
        <span class="text-surface-300 text-sm font-medium">
          Annual
          <span class="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">-20%</span>
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="relative rounded-2xl p-8 flex flex-col"
        :class="plan.featured
          ? 'bg-gradient-to-b from-brand-600/20 to-accent-600/10 border-2 border-brand-500/50 shadow-2xl shadow-brand-500/20'
          : 'card-glass'"
      >
        <!-- Popular Badge -->
        <div
          v-if="plan.featured"
          class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold shadow-lg"
        >
          ⭐ Most Popular
        </div>

        <div class="mb-6">
          <h3 class="font-outfit font-bold text-2xl text-white mb-2">{{ plan.name }}</h3>
          <p class="text-surface-400 text-sm">{{ plan.description }}</p>
        </div>

        <!-- Price -->
        <div class="mb-8">
          <div class="flex items-end gap-1">
            <span class="font-outfit font-black text-5xl text-white">
              ${{ isAnnual ? plan.annualPrice : plan.monthlyPrice }}
            </span>
            <span class="text-surface-400 mb-2">/mo</span>
          </div>
          <p v-if="isAnnual && plan.monthlyPrice > 0" class="text-surface-500 text-xs mt-1">
            Billed annually (${{ plan.annualPrice * 12 }}/year)
          </p>
        </div>

        <!-- Features -->
        <ul class="space-y-3 flex-1 mb-8">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-center gap-3 text-sm"
            :class="feature.startsWith('✗') ? 'text-surface-600' : 'text-surface-300'"
          >
            <svg v-if="!feature.startsWith('✗')" class="w-4 h-4 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 text-surface-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ feature.replace('✗ ', '') }}
          </li>
        </ul>

        <!-- CTA -->
        <NuxtLink
          :to="plan.cta.to"
          :id="`plan-${plan.name.toLowerCase()}-btn`"
          class="w-full text-center justify-center"
          :class="plan.featured ? 'btn-primary' : 'btn-ghost'"
        >
          {{ plan.cta.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Pricing — PlayWithMe',
  description: 'Simple and transparent pricing for PlayWithMe. Choose the plan that works best for you.',
})

const isAnnual = ref(false)

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started and exploring.',
    monthlyPrice: 0,
    annualPrice: 0,
    featured: false,
    features: [
      '5 Projects',
      'Basic features',
      'Community support',
      '1 GB Storage',
      '✗ Advanced analytics',
      '✗ Priority support',
      '✗ Custom domain',
    ],
    cta: { label: 'Get Started Free', to: '/auth/register' },
  },
  {
    name: 'Pro',
    description: 'For power users who want more.',
    monthlyPrice: 12,
    annualPrice: 10,
    featured: true,
    features: [
      'Unlimited Projects',
      'All features',
      'Priority support',
      '50 GB Storage',
      'Advanced analytics',
      'Custom domain',
      '✗ Team collaboration',
    ],
    cta: { label: 'Start Pro Trial', to: '/auth/register' },
  },
  {
    name: 'Team',
    description: 'For teams building together.',
    monthlyPrice: 29,
    annualPrice: 24,
    featured: false,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Admin dashboard',
      '500 GB Storage',
      'Advanced analytics',
      'Custom domain',
      'SSO & Security',
    ],
    cta: { label: 'Start Team Trial', to: '/auth/register' },
  },
]
</script>
