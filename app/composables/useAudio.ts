import { watch, onUnmounted } from 'vue'
import { useAppStore } from '~/stores'

export function useAudio() {
  const store = useAppStore()
  let audioCtx: AudioContext | null = null
  let masterGain: GainNode | null = null
  let filter: BiquadFilterNode | null = null
  let oscillators: OscillatorNode[] = []
  let oscillatorGains: GainNode[] = []

  const initAudio = () => {
    if (audioCtx) return
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    audioCtx = new AudioContextClass()
    
    // Master Gain
    masterGain = audioCtx.createGain()
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime)

    // Warm Lowpass Filter to make the synth sound soft and spacey
    filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(500, audioCtx.currentTime)
    filter.Q.setValueAtTime(1, audioCtx.currentTime)

    // Connect filter to master and master to speakers
    filter.connect(masterGain)
    masterGain.connect(audioCtx.destination)

    // Create a rich synth chord pad (C minor 9 / minor 7 flavor: C2, G2, C3, Eb3, G3, Bb3)
    const frequencies = [65.41, 98.0, 130.81, 155.56, 196.00, 233.08] // C2, G2, C3, Eb3, G3, Bb3

    frequencies.forEach((freq, index) => {
      if (!audioCtx || !filter) return
      
      const osc = audioCtx.createOscillator()
      // Alternate between triangle and sine waves for a rich, warm, non-harsh pad
      osc.type = index % 2 === 0 ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

      // Add a slight detune to create a lush, wide chorus/unison effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, audioCtx.currentTime)

      const oscGain = audioCtx.createGain()
      // Divide gain so the sum doesn't cause clipping/distortion
      oscGain.gain.setValueAtTime(0.06 / frequencies.length, audioCtx.currentTime)

      // Low frequency oscillator (LFO) to modulate individual oscillator volumes for movement
      const lfo = audioCtx.createOscillator()
      const lfoGain = audioCtx.createGain()
      lfo.frequency.setValueAtTime(0.05 + Math.random() * 0.05, audioCtx.currentTime) // very slow
      lfoGain.gain.setValueAtTime(0.015, audioCtx.currentTime)

      lfo.connect(lfoGain)
      lfoGain.connect(oscGain.gain)

      osc.connect(oscGain)
      oscGain.connect(filter)

      osc.start()
      lfo.start()

      oscillators.push(osc)
      oscillators.push(lfo)
      oscillatorGains.push(oscGain)
    })
  }

  const startSound = () => {
    initAudio()
    if (!audioCtx || !masterGain) return

    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // Fade in master gain smoothly over 1.5 seconds to avoid popping sounds
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime)
    masterGain.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 1.5)
  }

  const stopSound = () => {
    if (!masterGain || !audioCtx) return
    // Fade out master gain smoothly over 0.5 seconds
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime)
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5)
  }

  // Watch Pinia store's audioEnabled state and sync the audio context
  watch(
    () => store.audioEnabled,
    (isEnabled) => {
      if (typeof window === 'undefined') return
      if (isEnabled) {
        startSound()
      } else {
        stopSound()
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    oscillators.forEach((osc) => {
      try {
        osc.stop()
      } catch (e) {
        // Ignore
      }
    })
    if (audioCtx) {
      try {
        audioCtx.close()
      } catch (e) {
        // Ignore
      }
    }
  })
}
