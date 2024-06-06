// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  runtimeConfig: {
    api_key: process.env.NUXT_API_KEY,
  },

  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
});
