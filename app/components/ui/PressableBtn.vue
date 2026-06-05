<template>
  <button
    v-bind="bind"
    :type="type"
    :disabled="disabled"
    :class="[
      'pressable select-none transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
      isPressed ? 'scale-[0.94] opacity-85' : 'scale-100 opacity-100',
      disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { usePressable } from '~/composables/usePressable'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  }
})

const emit = defineEmits<{
  (e: 'click', event: PointerEvent): void
}>()

const { isPressed, bind } = usePressable({
  onPress: (event) => {
    if (!props.disabled) {
      emit('click', event)
    }
  }
})
</script>

<style scoped>
.pressable {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
