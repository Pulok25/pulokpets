/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aquatic: {
          50: '#f0fbff',
          100: '#e0f6fe',
          200: '#baeaff',
          300: '#7dd9ff',
          400: '#38c5f8',
          500: '#0ea5e9',
          600: '#0284c7', // Primary Accent
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
