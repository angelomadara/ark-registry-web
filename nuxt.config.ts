// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3080',
    },
  },

  app: {
    head: {
      title: 'The Ark Registry',
      meta: [
        { name: 'description', content: 'Crowdsourced species documentation platform' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    server: {
      allowedHosts: ['web.arkregistry.org', '.arkregistry.org'],
    },
  },
})