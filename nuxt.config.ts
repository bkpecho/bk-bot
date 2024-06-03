// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		api_key: process.env.NUXT_API_KEY,
	},
	devtools: { enabled: true },
});
