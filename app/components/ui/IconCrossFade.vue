<template>
  <div class="icon-crossfade-container relative flex items-center justify-center">
    <Transition name="icon-fade" mode="out-in">
      <slot :key="stateKey" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  stateKey: {
    type: [String, Number, Boolean],
    required: true
  }
})
</script>

<style scoped>
.icon-crossfade-container {
  display: inline-flex;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
