import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Navy
        secondary: '#1E293B',
        stocks: '#4A90D9',
        bonds: '#2EAD8E',
        cash: '#D4A843',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
} satisfies Config;
