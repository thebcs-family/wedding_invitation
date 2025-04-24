import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'primary-green': '#2C5530',
        'secondary-green': '#4A7856',
        'light-green': '#E8F5E9',
        'accent-gold': '#D4AF37',
      },
    },
  },
  plugins: [],
};

export default config; 