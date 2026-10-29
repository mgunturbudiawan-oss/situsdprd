import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const scale = (name: string) =>
  Object.fromEntries(shades.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]));

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: { primary: scale("primary"), accent: scale("accent") },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        kenburns: { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(1.12)" } },
        fadeup: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },      },
      animation: {
        marquee: "marquee 40s linear infinite",
        kenburns: "kenburns 9s ease-out forwards",
        fadeup: "fadeup .8s ease-out both",      },
    },
  },
  plugins: [typography],
};

export default config;
