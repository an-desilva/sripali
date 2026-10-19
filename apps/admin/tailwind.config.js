/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EA',
          200: '#F7C6CC',
          300: '#F09AA6',
          400: '#E36476',
          500: '#D13B51',
          600: '#B0263B',
          700: '#7A1D28',
          800: '#5E161F',
          900: '#420E15',
        },
        slate: {
          850: '#152033',
          900: '#0F172A',
          950: '#090D16',
        },
      },
    },
  },
  plugins: [],
};
