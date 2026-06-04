<template>
  <div class="min-h-screen flex flex-col items-center justify-center section-padding text-center relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-grid opacity-50" />
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />

    <div class="relative">
      <!-- Error Code -->
      <div class="font-outfit font-black text-[10rem] sm:text-[15rem] leading-none text-gradient opacity-20 select-none">
        {{ error?.statusCode || '?' }}
      </div>

      <div class="mt-[-2rem] sm:mt-[-4rem]">
        <h1 class="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
          {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong' }}
        </h1>
        <p class="text-surface-400 text-lg mb-8 max-w-md mx-auto">
          {{ error?.statusCode === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : error?.message || "An unexpected error occurred. Please try again." }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="error-go-home-btn"
            class="btn-primary"
            @click="handleError"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
          <button
            id="error-go-back-btn"
            class="btn-ghost"
            @click="$router.back()"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode: number
    message?: string
  }
}

const props = defineProps<ErrorProps>()

const handleError = () => clearError({ redirect: '/' })
</script>
