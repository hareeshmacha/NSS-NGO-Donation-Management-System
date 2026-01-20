/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: "#303f9f", // Deep Indigo/Blue for NSS
                    dark: "#1a237e",
                    light: "#7986cb"
                },
                secondary: {
                    DEFAULT: "#d32f2f", // Strong Red for NSS
                    dark: "#b71c1c",
                    light: "#ef5350"
                },
                accent: {
                    DEFAULT: "#ffb300", // Gold/Amber for IITR highlight
                    light: "#ffca28",
                    dark: "#ff8f00"
                }
            }
        },
    },
    plugins: [],
}
