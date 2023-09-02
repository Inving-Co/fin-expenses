import pkg from './package.json'

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
    // router: { middleware: [] },
    devtools: {enabled: true},
    modules: ['@nuxt/image', '@nuxtjs/color-mode', '@nuxtjs/tailwindcss', ['@nuxtjs/google-fonts', {
        families: {
            Roboto: true,
            Inter: [400, 700],
            'Josefin+Sans': true,
            Lato: [100, 300],
            Raleway: {
                wght: [100, 400],
                ital: [100]
            },
        }
    }]],
    build: {
        transpile: ['@vuepic/vue-datepicker']
    },
    css: [
        '~/assets/css/main.css'
    ],
    plugins: ["~/plugins/vercel.client.ts", "~/plugins/lottie.ts"],
    runtimeConfig: {
        APP_SECRET_PIN: process.env.APP_SECRET_PIN,
        public: {
            APP_SECRET_KEY: process.env.APP_SECRET_KEY,
            APP_DOMAIN: process.env.APP_DOMAIN,
            APP_ID: process.env.APP_ID,
            LOGSNAG_TOKEN: process.env.LOGSNAG_TOKEN,
            CLIENT_VERSION: pkg.version,
        }
    },
    colorMode: {
        classSuffix: '',
        classPrefix: '',
        preference: 'system', // default value of $colorMode.preference
        fallback: 'light', // fallback value if not system preference found
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        storageKey: 'nuxt-color-mode'
    }
})
