/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3b82f6', // azul
          600: '#2563eb', // azul más oscuro
        }
      }
    },
  },
  plugins: [],
}