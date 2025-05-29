
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/landing/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#e6f7f6",
          100: "#b3eae6",
          200: "#80ddd6",
          300: "#4dd0c6",
          400: "#26c4b5",
          500: "#13A197", // Cor principal do gradiente
          600: "#108a80",
          700: "#0e736a",
          800: "#0b5c53",
          900: "#08453d",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        success: {
          DEFAULT: "#10B981",
          50: "#E6FFF7",
          100: "#CCFFEF",
          200: "#99FFDF",
          300: "#66FFCF",
          400: "#33FFBF",
          500: "#10B981",
          600: "#0C9669",
          700: "#097250",
          800: "#064D36",
          900: "#03291D",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFF8E6",
          100: "#FFF1CC",
          200: "#FFE399",
          300: "#FFD566",
          400: "#FFC733",
          500: "#F59E0B",
          600: "#C47F09",
          700: "#935F06",
          800: "#623F04",
          900: "#312002",
        },
        danger: {
          DEFAULT: "#EF4444",
          50: "#FEECEC",
          100: "#FCD9D9",
          200: "#F9B3B3",
          300: "#F68D8D",
          400: "#F36767",
          500: "#EF4444",
          600: "#EB1818",
          700: "#C11010",
          800: "#870B0B",
          900: "#5C0808",
        },
        // Sistema com gradiente
        "system-teal": {
          50: "#e6f7f6",
          100: "#b3eae6",
          200: "#80ddd6",
          300: "#4dd0c6",
          400: "#26c4b5",
          500: "#13A197", // Primeira cor do gradiente
          600: "#108a80",
          700: "#0e736a",
          800: "#0b5c53",
          900: "#105865", // Segunda cor do gradiente
        },
        // Cores específicas para a Landing Page (mantidas originais)
        "sigma-teal": {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#0f4457",
          950: "#042f2e",
        },
        "sigma-cyan": {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        "sigma-slate": {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(10px)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-20px) rotate(2deg)" },
          "66%": { transform: "translateY(-10px) rotate(-2deg)" },
        },
        "glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(19, 161, 151, 0.5)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(19, 161, 151, 0.8), 0 0 60px rgba(19, 161, 151, 0.6)",
          },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-system': 'linear-gradient(135deg, #13A197 0%, #105865 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
