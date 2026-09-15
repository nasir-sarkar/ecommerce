/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0080FF',
        'primary-hover': '#0066CC',
        secondary: '#17171f',
        success: '#85b567',
        warning: '#f3af3d',
        gray: '#9d9da6',
        'gray-dark': '#8d8d8d',
        light: '#f5f5f5',
        dark: '#292933',
      },
      fontFamily: {
        sans: ['Public Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
