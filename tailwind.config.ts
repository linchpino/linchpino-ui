import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        container: {
            padding: '4rem',
            center: true,
        },
        extend: {},
    },
    plugins: [require("daisyui")],
};
export default config;