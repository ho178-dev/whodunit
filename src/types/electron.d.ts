// Electron preload で contextBridge 経由で expose された window.electronAPI の型定義
interface WindowElectronAPI {
  windowControls: {
    minimize: () => void
    quit: () => void
  }
}

declare global {
  interface Window {
    electronAPI?: WindowElectronAPI
  }
}

export {}
