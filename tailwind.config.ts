import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Palatino", "Georgia", "serif"]
      },
      boxShadow: { soft: "0 24px 80px -32px rgba(15, 23, 42, 0.28)" },
      backgroundImage: { grid: "linear-gradient(to right, hsl(var(--border)/.45) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/.45) 1px, transparent 1px)" }
    }
  },
  plugins: [],
};

export default config;
