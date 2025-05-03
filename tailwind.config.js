/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        'primary-hover': '#2980b9',
        'text-color': '#333',
        'light-gray': '#f5f5f5',
        'border-color': '#ddd',
      },
    },
  },
  plugins: [],
} 