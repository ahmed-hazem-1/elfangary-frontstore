import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '6rem',
        '2xl': '8rem',
      },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        brand: {
          orange: "#E86F00",
          cream: "#F08000",
          gold: "#F9F9F9",
          amber: "#1A1A1A",
          olive: "#000000",
        },
        ink: {
          dark: "#111111",
          muted: "#666666",
        },
        border: {
          glass: "rgba(0,0,0,0.06)",
        },
        ring: "#E86F00",
      },
      fontFamily: {
        sans: ["var(--font-en)", "var(--font-ar)", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ["var(--font-ar)", "var(--font-en)", "sans-serif"],
      },
      borderRadius: {
        btn: "6px",
        card: "12px",
        shell: "16px",
        xl2: "20px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.04)",
        card: "0 4px 16px rgba(0,0,0,0.06)",
        premium: "0 8px 32px rgba(0,0,0,0.08)",
        glow: "0 0 0 2px rgba(0,0,0,0.1)",
        glass: "0 4px 24px rgba(0, 0, 0, 0.04)",
      },
      transitionTimingFunction: {
        buttery: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "400": "400ms",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
