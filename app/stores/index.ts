import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // --- State ---
  const audioEnabled = ref(false)
  const score = ref(0)
  
  // Local highscores stored by game key (e.g. 'snake', 'memory')
  const highScores = ref<Record<string, number>>({})

  // Graphics / visual settings for performance budgets
  const particleQuality = ref<'low' | 'medium' | 'high'>('medium')

  // --- Getters ---
  const getHighScore = computed(() => (gameId: string) => {
    return highScores.value[gameId] || 0
  })

  // --- Actions ---
  const toggleAudio = () => {
    audioEnabled.value = !audioEnabled.value
  }

  const setAudio = (enabled: boolean) => {
    audioEnabled.value = enabled
  }

  const setScore = (newScore: number) => {
    score.value = newScore
  }

  const updateHighScore = (gameId: string, finalScore: number) => {
    const currentHigh = highScores.value[gameId] || 0
    if (finalScore > currentHigh) {
      highScores.value[gameId] = finalScore
      saveHighScoresToStorage()
      return true // New high score
    }
    return false
  }

  const setParticleQuality = (quality: 'low' | 'medium' | 'high') => {
    particleQuality.value = quality
  }

  // --- Storage Sync ---
  const loadSettingsFromStorage = () => {
    if (typeof window === 'undefined') return
    try {
      const storedAudio = localStorage.getItem('playwithme_audio')
      if (storedAudio !== null) {
        audioEnabled.value = storedAudio === 'true'
      }

      const storedHighScores = localStorage.getItem('playwithme_highscores')
      if (storedHighScores) {
        highScores.value = JSON.parse(storedHighScores)
      }

      const storedQuality = localStorage.getItem('playwithme_quality')
      if (storedQuality) {
        particleQuality.value = storedQuality as 'low' | 'medium' | 'high'
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e)
    }
  }

  const saveHighScoresToStorage = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('playwithme_highscores', JSON.stringify(highScores.value))
    } catch (e) {
      console.warn('Failed to save high scores to localStorage', e)
    }
  }

  const saveAudioToStorage = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('playwithme_audio', String(audioEnabled.value))
    } catch (e) {
      console.warn('Failed to save audio setting to localStorage', e)
    }
  }

  const saveQualityToStorage = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('playwithme_quality', particleQuality.value)
    } catch (e) {
      console.warn('Failed to save particle quality to localStorage', e)
    }
  }

  // Watchers / hook actions to run when store is initialized on client
  const initStore = () => {
    loadSettingsFromStorage()
  }

  return {
    audioEnabled,
    score,
    highScores,
    particleQuality,
    getHighScore,
    toggleAudio,
    setAudio,
    setScore,
    updateHighScore,
    setParticleQuality,
    saveAudioToStorage,
    saveQualityToStorage,
    initStore,
  }
})
