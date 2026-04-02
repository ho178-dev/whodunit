import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  // Electron の file:// プロトコルで動作させるため、ビルド時は相対パスを使用する
  base: command === 'build' ? './' : '/',
  plugins: [react(), tailwindcss()],
}))
