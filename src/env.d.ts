/// <reference types="vite/client" />

// カスタム環境変数の型定義
interface ImportMetaEnv {
  readonly VITE_TRIAL_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
