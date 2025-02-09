import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
    // @ts-ignore
    app: {
        head: {
            title: 'Inving - Review Expenses',
            meta: [
                {name: 'description', content: 'Transaction Tracker by Inving'}
            ],
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        }
    },
    ssr: false,
    // render: {
    //     gzip: false,
    // },
    // router: { middleware: [] },
    devtools: {enabled: true},
    extends: ['nuxt-umami'],
    modules: ['@vite-pwa/nuxt', '@nuxt/image', '@nuxtjs/color-mode', '@nuxtjs/tailwindcss', ['@nuxtjs/google-fonts', {
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
    plugins: ["~/plugins/vercel.client.ts", "~/plugins/lottie.ts", "~/plugins/quill.client.ts"],
    runtimeConfig: {
        APP_SECRET_PIN: process.env.APP_SECRET_PIN,
        public: {
            APP_SECRET_KEY: process.env.APP_SECRET_KEY,
            APP_DOMAIN: process.env.APP_DOMAIN,
            APP_ID: process.env.APP_ID,
            LOGSNAG_TOKEN: process.env.LOGSNAG_TOKEN,
            CLIENT_VERSION: pkg.version,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_KEY: process.env.SUPABASE_KEY,
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
    },
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Inving - Review Expenses',
            short_name: 'Money Inving',
            lang: 'en',
            description: 'Transaction Tracker by Inving',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'icon-256.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'icon-256.png',
                    sizes: '512x512',
                    type: 'image/png',
                }
            ],
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        // client: {
        //     installPrompt: true,
        // },
    },
    appConfig: {
        umami: {
            version: pkg.version,
            ignoreLocalhost: true,
            debug: true,
        },
    }
})
