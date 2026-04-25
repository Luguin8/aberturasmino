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
          DEFAULT: '#e74c3c',
          hover: '#c0392b',
          light: '#fdecea',
        },
        secondary: {
          DEFAULT: '#1a1f36',
          hover: '#2c3142',
        },
        accent: {
          DEFAULT: '#27ae60',
          hover: '#219a52',
          light: '#e8f8ef',
        },
      },
    },
  },
  plugins: [],
}
