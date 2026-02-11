/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      spacing: {
        'container': 'var(--space-container)',
        'gap-xs': 'var(--space-gap-xs)',
        'gap-sm': 'var(--space-gap-sm)',
        'gap-md': 'var(--space-gap-md)',
        'gap-lg': 'var(--space-gap-lg)',
        'gap-xl': 'var(--space-gap-xl)',
        'section-y': 'var(--space-section-y)',
      },
      maxWidth: {
        'content': 'var(--container-content)',
        'main': 'var(--container-main)',
        'wide': 'var(--container-wide)',
      },
      fontSize: {
        'heading-hero': 'var(--text-heading-hero)',
        'heading-section': 'var(--text-heading-section)',
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
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
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 200ms ease-out",
        "accordion-up": "accordion-up 200ms ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-up-delay-1": "fade-in-up 0.6s ease-out 0.15s forwards",
        "fade-in-up-delay-2": "fade-in-up 0.6s ease-out 0.3s forwards",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(ellipse at top center, rgba(168, 162, 158, 0.18) 0%, rgba(120, 113, 108, 0.08) 40%, transparent 70%)",
        "hero-radial-strong": "radial-gradient(ellipse at top center, rgba(168, 162, 158, 0.28) 0%, rgba(120, 113, 108, 0.14) 30%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
