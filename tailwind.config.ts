import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gothic: {
          bg: '#0c0a09',
          panel: '#1c1917',
          border: '#44403c',
          accent: '#b45309',
          gold: '#d97706',
          text: '#fef3c7',
          muted: '#a8a29e',
        },
      },
      fontFamily: {
        serif: ['Noto Serif JP', 'Georgia', 'serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
