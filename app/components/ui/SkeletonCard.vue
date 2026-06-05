<template>
  <div class="card-glass p-6 space-y-4">
    <!-- Card header/thumbnail skeleton -->
    <div v-if="hasThumbnail" class="skeleton h-40 w-full" />
    
    <div class="space-y-3">
      <!-- Title skeleton -->
      <div class="skeleton h-5 w-3/4" />
      
      <!-- Subtitle/Description skeleton -->
      <div class="skeleton h-3.5 w-full" />
      <div class="skeleton h-3.5 w-5/6" />
    </div>
    
    <!-- Footer/Button skeleton -->
    <div class="skeleton h-9 w-1/3 mt-4" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  hasThumbnail: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-800) 25%,
    var(--color-surface-700) 50%,
    var(--color-surface-800) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 0.5rem;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
</style>
