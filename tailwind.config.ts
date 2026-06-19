import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#2E2E2E',
        paper: '#FBFAF5',
        'paper-light': '#fbf9f3',
        desk: '#cdc6b6',
        topbar: '#f1ece1',
        'text-muted': '#5f5b51',
        'text-muted-2': '#7a766c',
        'text-muted-3': '#8a8678',
        'text-muted-4': '#a8a496',
        'accent-blue': '#AAB6C4',
        'accent-brown': '#97744e',
        'success-bg': '#dbe6d3',
        'success-bg-2': '#e3ecd6',
        'success-border': '#a9c096',
        'success-text': '#4f6b41',
        'gold-bg': '#f3ead4',
        'gold-bg-2': '#efe7d6',
        'gold-border': '#b6924e',
        'gold-text': '#7a5e22',
        'danger-text': '#8a4a3b',
      },
      fontFamily: {
        'noto-serif-sc': ['"Noto Serif SC"', 'serif'],
        'noto-serif-th': ['"Noto Serif Thai"', 'serif'],
        'noto-serif': ['"Noto Serif"', 'serif'],
        chonburi: ['Chonburi', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
        md: '4px',
        lg: '5px',
      },
      animation: {
        'flip': 'flip 0.5s ease-in-out',
        'pop-in': 'popIn 0.25s ease-out',
        'float-in': 'floatIn 0.45s ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        floatIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
