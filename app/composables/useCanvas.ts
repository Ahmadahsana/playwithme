import { ref, type Ref, onUnmounted } from 'vue'

export function useCanvas(canvasRef: Ref<HTMLCanvasElement | null>) {
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const width = ref(0)
  const height = ref(0)
  let resizeCallback: (() => void) | null = null

  const initCanvas = (onResize?: () => void) => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx.value = canvas.getContext('2d')
    resizeCallback = onResize || null
    resize()
    window.addEventListener('resize', resize)
  }

  const resize = () => {
    const canvas = canvasRef.value
    if (!canvas || !ctx.value) return

    // Get the logical display size of the canvas
    const rect = canvas.getBoundingClientRect()
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

    width.value = rect.width
    height.value = rect.height

    // Set the backing store size considering Device Pixel Ratio for crispness
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    // Scale context back to normal size to draw with logical coordinates
    ctx.value.scale(dpr, dpr)

    if (resizeCallback) {
      resizeCallback()
    }
  }

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', resize)
    }
  })

  return {
    ctx,
    width,
    height,
    initCanvas,
    resize
  }
}
