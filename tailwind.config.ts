import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/containers/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                vazir: ['Vazir', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
        },
        container: {
            padding: '4rem',
            center: true,
        },
        screens: {
            'xs': '424px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
    },
    plugins: [require("daisyui")],
};

export default config;
