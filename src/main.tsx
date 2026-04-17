// Reactアプリのエントリーポイント
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// dev mode: PlaywrightのE2Eテストからゲーム状態を操作できるようウィンドウに公開する
if (import.meta.env.DEV) {
  import('./stores/gameStore').then(({ useGameStore }) => {
    ;(window as unknown as Record<string, unknown>).__gameStore = useGameStore
  })
  import('./stores/settingsStore').then(({ useSettingsStore }) => {
    ;(window as unknown as Record<string, unknown>).__settingsStore = useSettingsStore
  })
  import('./utils/scenarioRegistry').then((scenarioRegistry) => {
    ;(window as unknown as Record<string, unknown>).__scenarioRegistry = scenarioRegistry
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
