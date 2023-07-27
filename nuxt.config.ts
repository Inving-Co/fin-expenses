// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
    // @ts-ignore
    app: {
        head: {
            title: 'Transaction Tracker',
            meta: [
                {name: 'description', content: 'Transaction Tracker by Inving'}
            ],
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        }
    },
    ssr: true,
    target: 'server',
    router: { middleware: [] },
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss'],
    build: {
        transpile: ['@vuepic/vue-datepicker']
    },
    css: [
        '~/assets/css/main.css'
    ],
    runtimeConfig: {
        APP_SECRET_PIN: process.env.APP_SECRET_PIN,
        APP_DOMAIN: process.env.APP_DOMAIN,
        APP_SECRET: process.env.APP_SECRET,
    },
})
