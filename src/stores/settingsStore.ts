// ゲームプレイとは独立したシステム設定を管理する Zustand store（localStorage に永続化）
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TextSpeed = 'slow' | 'normal' | 'fast'

interface SettingsState {
  /** 幕間演出をスキップするか（true のとき FadeTransition の duration を 0 にする） */
  skipInterlude: boolean
  /** テキスト速度（DialogBox タイプライター演出実装後に有効化） */
  textSpeed: TextSpeed
  setSkipInterlude: (v: boolean) => void
  setTextSpeed: (v: TextSpeed) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      skipInterlude: false,
      textSpeed: 'normal',
      setSkipInterlude: (v) => set((s) => (s.skipInterlude === v ? s : { skipInterlude: v })),
      setTextSpeed: (v) => set((s) => (s.textSpeed === v ? s : { textSpeed: v })),
    }),
    { name: 'whodunit_settings' }
  )
)
