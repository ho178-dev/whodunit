import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(217,119,6,0.4)',
            borderColor: '#d97706',
          },
          '50%': {
            boxShadow: '0 0 22px rgba(217,119,6,0.75)',
            borderColor: '#f59e0b',
          },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
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
        serif: ['DotGothic16', 'Noto Serif JP', 'monospace'],
        display: ['Cinzel', 'Georgia', 'serif'],
        pixel: ['Press Start 2P', 'monospace'],
      },
      screens: {
        'game-sm': '1280px',
        'game-md': '1600px',
        'game-lg': '1920px',
      },
    },
  },
  plugins: [],
}

export default config
