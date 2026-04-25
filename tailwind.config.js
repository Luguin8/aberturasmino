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
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db',
        bg: {
          DEFAULT: '#f5f5f5',
          alt: '#fafafa',
        },
        border: {
          DEFAULT: '#e0e0e0',
          light: '#f0f0f0',
        },
        text: {
          DEFAULT: '#1a1f36',
          light: '#6b7280',
        },
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'xl': '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'overlay': '300',
        'modal': '400',
        'toast': '500',
        'whatsapp': '600',
      },
      spacing: {
        'header': '80px',
        'topbar': '40px',
        'navbar': '48px',
      },
    },
  },
  plugins: [],
}
