/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1220',
          slate: '#141D2F',
          panel: '#1A2438',
          border: '#2A3A52',
          muted: '#94A3B8',
          accent: '#14B8A6',
          'accent-hover': '#0D9488',
          gold: '#D4A853',
          orange: '#E87B35',
          africa: '#1B8B4C',
          glow: '#2DD4BF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(42,58,82,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(42,58,82,0.4) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20,184,166,0.25), transparent)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(20, 184, 166, 0.4)',
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 40px -8px rgba(20, 184, 166, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
