import { ref } from 'vue'

export interface PressableOptions {
  onPress?: (e: PointerEvent) => void
  threshold?: number
}

export function usePressable(options: PressableOptions = {}) {
  const isPressed = ref(false)
  const isCancelled = ref(false)
  const threshold = options.threshold ?? 10
  
  let startX = 0
  let startY = 0

  const onPointerDown = (e: PointerEvent) => {
    // Only handle primary button presses (usually left click or finger touch)
    if (e.button !== undefined && e.button !== 0) return
    
    isPressed.value = true
    isCancelled.value = false
    startX = e.clientX
    startY = e.clientY
    
    // Capture pointer events to make sure we detect movement/up even outside of the element boundaries
    const target = e.currentTarget as HTMLElement
    if (target && typeof target.setPointerCapture === 'function') {
      try {
        target.setPointerCapture(e.pointerId)
      } catch (err) {
        // Ignore setPointerCapture failures on elements that do not support it
      }
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!isPressed.value || isCancelled.value) return
    
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    
    // If movement exceeds the threshold, cancel the press
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      isCancelled.value = true
      isPressed.value = false
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    if (!isPressed.value) return
    
    const target = e.currentTarget as HTMLElement
    if (target && typeof target.releasePointerCapture === 'function') {
      try {
        target.releasePointerCapture(e.pointerId)
      } catch (err) {
        // Ignore
      }
    }
    
    isPressed.value = false
    if (!isCancelled.value) {
      options.onPress?.(e)
    }
  }

  const onPointerCancel = (e: PointerEvent) => {
    isPressed.value = false
    isCancelled.value = true
    
    const target = e.currentTarget as HTMLElement
    if (target && typeof target.releasePointerCapture === 'function') {
      try {
        target.releasePointerCapture(e.pointerId)
      } catch (err) {
        // Ignore
      }
    }
  }

  return {
    isPressed,
    isCancelled,
    bind: {
      onPointerdown: onPointerDown,
      onPointermove: onPointerMove,
      onPointerup: onPointerUp,
      onPointercancel: onPointerCancel
    }
  }
}
