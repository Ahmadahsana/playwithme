<template>
  <div class="min-h-screen bg-surface-950 text-white selection:bg-brand-500/30 selection:text-brand-200">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtErrorBoundary @error="onError">
        <NuxtPage />
        
        <template #error="{ error, clearError }">
          <div class="min-h-[70vh] flex flex-col items-center justify-center section-padding text-center py-20 space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-3xl">⚠️</div>
            <h1 class="font-outfit font-black text-3xl text-white">Oops, Eksperimen Terganggu</h1>
            <p class="text-surface-400 text-sm max-w-sm mx-auto leading-relaxed">
              Terjadi kesalahan sistem saat memproses grafis atau audio interaktif. Silakan coba lagi atau kembali ke hub.
            </p>
            <div class="flex items-center gap-3 justify-center">
              <button
                @click="handleClearError(clearError)"
                class="btn-primary px-5! py-2.5! text-xs! font-bold"
              >
                Coba Lagi
              </button>
              <NuxtLink
                to="/playground"
                class="btn-ghost px-5! py-2.5! text-xs! font-bold"
                @click="clearError"
              >
                Kembali ke Hub
              </NuxtLink>
            </div>
          </div>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

onMounted(() => {
  // Initialize state from local storage (theme, volume, scores) on mount (client-side only)
  store.initStore()
})

const onError = (err: any) => {
  console.error('Captured in NuxtErrorBoundary:', err)
}

const handleClearError = (clearError: () => void) => {
  clearError()
  router.go(0)
}
</script>
