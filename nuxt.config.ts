// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  // Register components by their bare filename (e.g. <PressableBtn> instead of
  // <UiPressableBtn>), which is how the pages/components reference them.
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      title: 'Ahmad Ahsan — PlayWithMe',
      meta: [
        { name: 'description', content: 'PlayWithMe — portfolio web interaktif milik Ahmad Ahsan, Software Developer asal Jepara & Kudus. Dibuat dengan Nuxt 4 & Tailwind CSS 4.' },
        { name: 'author', content: 'Ahmad Ahsan' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
