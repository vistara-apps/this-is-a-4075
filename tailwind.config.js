/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': 'hsl(230, 20%, 95%)',
        'text': 'hsl(230, 30%, 20%)',
        'accent': 'hsl(15, 90%, 55%)',
        'border': 'hsl(230, 20%, 85%)',
        'primary': 'hsl(230, 80%, 50%)',
        'surface': 'hsl(0, 0%, 100%)',
        'dark': {
          'bg': 'hsl(240, 20%, 8%)',
          'surface': 'hsl(240, 20%, 12%)',
          'text': 'hsl(240, 20%, 95%)',
          'border': 'hsl(240, 20%, 20%)',
        }
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 2px 4px hsla(0, 0%, 0%, 0.05)',
        'md': '0 4px 12px hsla(0, 0%, 0%, 0.1)',
        'lg': '0 8px 24px hsla(0, 0%, 0%, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}