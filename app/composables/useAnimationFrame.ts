import { ref, onUnmounted } from 'vue'

export function useAnimationFrame() {
  const isRunning = ref(false)
  let frameId: number | null = null
  let lastTime = 0

  const start = (callback: (deltaTime: number, timestamp: number) => void) => {
    if (isRunning.value) return
    isRunning.value = true
    lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now()

    const loop = (timestamp: number) => {
      if (!isRunning.value) return
      
      const deltaTime = (timestamp - lastTime) / 1000 // duration in seconds
      lastTime = timestamp

      callback(deltaTime, timestamp)
      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
  }

  const stop = () => {
    isRunning.value = false
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isRunning,
    start,
    stop
  }
}
