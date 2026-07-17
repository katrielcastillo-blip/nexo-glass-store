import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)"],
        display: ["var(--font-syne)"],
      },
      colors: {
        ink: "#07111f",
        frost: "#eafcff",
        acid: "#b8ff5c",
        cyan: "#57d8ff",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, .28)",
        glow: "0 0 36px rgba(87, 216, 255, .18)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        reveal: "reveal .7s ease-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

