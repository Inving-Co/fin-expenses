/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./node_modules/flowbite/**/*.{js,ts}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f57b7b",
                    100: "#f36363",
                    200: "#f25858",
                    300: "#f14c4c",
                    400: "#EF3434",
                    500: "#EF3434",
                    600: "#EF3434",
                    700: "#ed1c1c",
                    800: "#de1212",
                    900: "#c71010",
                },
                info: {
                    50: "#0acbff",
                    100: "#00bcef",
                    200: "#00a8d6",
                    300: "#00a3d0",
                    400: "#0094bd",
                    500: "#0094bc",
                    600: "#0094bd",
                    700: "#0080a3",
                    800: "#006c89",
                    900: "#005870",
                },
                font1: {
                    500: "#6E6666"
                }
            },
            transitionProperty: {
                'width': 'width'
            },
            animation: {
                'spin-once': 'spin 0.35s ease-in-out 1',
                'fade-in': 'fade-in 0.35s ease-in-out 1',
                'fade-out': 'fade-out 0.35s ease-in-out 1',
                'slide-in': 'slide-in 0.35s ease-in-out 1',
                'slide-out': 'slide-out 0.35s ease-in-out 1'
            },
            keyframes: {
                'spin-once': {
                    '0%': {transform: 'rotate(0deg)'},
                    '100%': {transform: 'rotate(360deg)'},
                },
                'fade-in': {
                    '0%': {opacity: 0},
                    '100%': {opacity: 1},
                },
                'fade-out': {
                    '0%': {opacity: 1},
                    '100%': {opacity: 0},
                },
                'slide-in': {
                    '0%': {transform: 'translateY(100%)'},
                    '100%': {transform: 'translateY(0%)'},
                },
                'slide-out': {
                    '0%': {transform: 'translateY(0%)'},
                    '100%': {transform: 'translateY(100%)'},
                }
            },
            variants: {
                animation: ['responsive', 'motion-safe', 'motion-reduce'],
            },
        },
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
            serif: ["Poppins", "serif"],
            body: ["Poppins", "sans-serif"],
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
}

