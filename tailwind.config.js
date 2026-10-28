/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ed1c24',
          gold: '#fbc707',
          DEFAULT: '#ed1c24',
        },
        highlight: {
          blue: '#d9f3fd',
          yellow: '#fceca8',
          green: '#d8f3dc',
        },
        paper: {
          DEFAULT: '#fcfbf8',
          subtle: '#f7f6f2',
          border: '#e7e5df',
        },
        editorial: {
          950: '#111315',
          900: '#1c1f24',
          800: '#2b2f38',
          700: '#404652',
          600: '#5c6373',
          500: '#7d8597',
          400: '#a2a9b8',
          300: '#c7cbd6',
          200: '#e5e7eb',
          100: '#f3f4f6',
          50: '#f9fafb',
        },
        crimson: {
          900: '#7f1d1d',
          800: '#ed1c24', // Brand Red aligned
          700: '#ed1c24',
          600: '#dc2626',
          500: '#ef4444',
          100: '#fee2e2',
          50: '#fef2f2',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif Devanagari"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Noto Sans Devanagari"', 'Mukta', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        masthead: ['"Playfair Display"', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'editorial': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'editorial-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
