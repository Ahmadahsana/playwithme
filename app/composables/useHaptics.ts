// app/composables/useHaptics.ts
export function useHaptics() {
  const canVibrate = () =>
    typeof window !== 'undefined' &&
    'vibrate' in navigator &&
    window.matchMedia('(pointer: coarse)').matches

  return {
    success:     () => canVibrate() && navigator.vibrate([10]),
    warning:     () => canVibrate() && navigator.vibrate([30, 50, 30]),
    toggle:      () => canVibrate() && navigator.vibrate([8]),
    destructive: () => canVibrate() && navigator.vibrate([50, 30, 50]),
  }
}
