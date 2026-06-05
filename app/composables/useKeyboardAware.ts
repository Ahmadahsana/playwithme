import { ref, onMounted, onUnmounted } from 'vue'

export function useKeyboardAware() {
  const keyboardHeight = ref(0)
  const isKeyboardVisible = ref(false)

  const handler = () => {
    if (!window.visualViewport) return
    const offset = window.innerHeight - window.visualViewport.height
    keyboardHeight.value = Math.max(0, offset)
    isKeyboardVisible.value = keyboardHeight.value > 100 // Threshold for keyboard being visible
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    window.visualViewport.addEventListener('resize', handler)
    window.visualViewport.addEventListener('scroll', handler)
    // Run initially
    handler()
  })

  onUnmounted(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    window.visualViewport.removeEventListener('resize', handler)
    window.visualViewport.removeEventListener('scroll', handler)
  })

  return {
    keyboardHeight,
    isKeyboardVisible
  }
}
