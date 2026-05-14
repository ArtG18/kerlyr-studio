/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50:  '#fdf2f0',
          100: '#f9e0db',
          200: '#f2c5bb',
          300: '#e8a090',
          400: '#d97a67',
          500: '#c49a8a',
          600: '#b8906a',
          700: '#8b5e52',
          800: '#6b4840',
          900: '#4a322d',
        },
        kr: {
          rose:     '#c49a8a',
          'rose-light': '#f5e8e4',
          'rose-mid':   '#e8cfc8',
          'rose-dark':  '#8b5e52',
          gold:     '#b8906a',
          'gold-light': '#f7f0ea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}