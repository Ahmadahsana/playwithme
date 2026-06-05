<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="decline" />
      
      <!-- Modal Box -->
      <div class="card-glass relative w-full max-w-md p-6 overflow-hidden flex flex-col items-center text-center max-h-[90vh] bg-surface-950/90 border border-white/10 animate-scale-in">
        <!-- Ambient Glow Orbs inside Modal -->
        <div class="absolute -top-12 -left-12 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />
        <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-accent-500/20 rounded-full blur-2xl pointer-events-none" />

        <!-- Icon / Visual -->
        <div class="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-3xl mb-6 relative">
          <span class="animate-ping absolute inset-0 rounded-full bg-brand-500/5 opacity-75" />
          <slot name="icon">🔔</slot>
        </div>

        <!-- Title -->
        <h3 class="font-outfit font-bold text-2xl text-white mb-2">
          <slot name="title">Izin Diperlukan</slot>
        </h3>

        <!-- Description -->
        <p class="text-surface-300 text-sm leading-relaxed mb-6">
          <slot name="description">Kami memerlukan izin Anda untuk mengaktifkan fitur ini agar pengalaman bermain menjadi lebih maksimal.</slot>
        </p>

        <!-- Actions -->
        <div class="flex items-center gap-3 w-full mt-2 z-10">
          <button 
            type="button" 
            class="btn-ghost flex-1 justify-center py-2.5 text-sm" 
            @click="decline"
          >
            {{ declineText }}
          </button>
          <button 
            type="button" 
            class="btn-primary flex-1 justify-center py-2.5 text-sm font-semibold" 
            @click="approve"
          >
            {{ approveText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useHaptics } from '~/composables/useHaptics'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  approveText: {
    type: String,
    default: 'Ya, Izinkan'
  },
  declineText: {
    type: String,
    default: 'Nanti Saja'
  },
  permissionKey: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'approve'): void
  (e: 'decline'): void
}>()

const haptics = useHaptics()

const decline = () => {
  haptics.toggle()
  emit('decline')
}

const approve = () => {
  haptics.success()
  emit('approve')
}
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
