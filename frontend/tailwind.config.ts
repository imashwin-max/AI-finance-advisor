import type { Config } from "tailwindcss";

// Every color below is a CSS variable (set in index.css for both .dark and .light),
// not a hardcoded hex value. This is the actual fix for the theme toggle: the old
// config hardcoded dark hex values directly into the Tailwind theme, so switching
// the "light"/"dark" class on <html> changed nothing visually. Now every utility
// class (bg-background, text-foreground, border-border, etc.) resolves through a
// variable that flips when the class on <html> flips.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        surfaceHover: "rgb(var(--color-surface-hover) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
        },
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        income: "rgb(var(--color-income) / <alpha-value>)",
        expense: "rgb(var(--color-expense) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      boxShadow: {
        glow: "0 0 40px -10px rgb(var(--color-primary) / 0.35)",
        soft: "0 8px 30px rgb(0 0 0 / 0.18)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-accent)) 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
