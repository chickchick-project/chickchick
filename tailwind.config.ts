import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#a8a8a8",
          200: "#dbdbdb",
          300: "#f6f6f6",
        },
        black: {
          100: "#363636",
          200: "#505050",
          300: "#767676",
        },
        white: "#FFF",
        primary: {
          100: "#6F4D3F",
          200: "#A47764",
          300: "#CB9C88",
          400: "#DBC0B0",
          500: "#EAD8C4",
          600: "#F3EDE7",
        },
        red: "#ed1c24",
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
    },
    screens: {
      mobile: "320px",
      tablet: "768px",
      pc: "1200px",
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
