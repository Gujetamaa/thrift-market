/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
    theme: {
        extend: {
        colors: {
            brand: {
            50:  "rgb(var(--brand-50) / <alpha-value>)",
            100: "rgb(var(--brand-100) / <alpha-value>)",
            200: "rgb(var(--brand-200) / <alpha-value>)",
            300: "rgb(var(--brand-300) / <alpha-value>)",
            400: "rgb(var(--brand-400) / <alpha-value>)",
            500: "rgb(var(--brand-500) / <alpha-value>)",
            600: "rgb(var(--brand-600) / <alpha-value>)",
            700: "rgb(var(--brand-700) / <alpha-value>)",
            800: "rgb(var(--brand-800) / <alpha-value>)",
            900: "rgb(var(--brand-900) / <alpha-value>)",
            },
        },
        fontFamily: {
            display: ["var(--font-display)"],
            body: ["var(--font-body)"],
        },
        borderRadius: {
            xl2: "var(--radius)", // use with rounded-xl2
        },
        boxShadow: {
            card: "var(--shadow-card)",
        },
        },
    },
    plugins: [],
    };