import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/constants/*.ts",
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
        secondary: "#FF8749",
        red: "#ed1c24",
      },
      fontSize: {
        "headline-1": "36px",
        "headline-2": "28px",
        "headline-3": "24px",
        "title-1": "20px",
        "title-2": "18px",
        "body-1": "16px",
        "body-2": "15px",
        "label-1": "14px",
        "label-2": "13px",
        "label-3": "12px",
        "label-4": "11px",
        "label-5": "10px",
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
    },
    screens: {
      mobile: "360px",
      tablet: "768px",
      pc: "1200px",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;
