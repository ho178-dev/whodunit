// BGM・SE音量設定を管理する Zustand store（localStorage に永続化）
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { audioManager } from '../services/audioManager'

interface AudioState {
  bgmVolume: number
  seVolume: number
  setBgmVolume: (v: number) => void
  setSeVolume: (v: number) => void
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      bgmVolume: 0.7,
      seVolume: 0.8,
      setBgmVolume: (v) => {
        set({ bgmVolume: v })
        audioManager.setBgmVolume(v)
      },
      setSeVolume: (v) => {
        set({ seVolume: v })
        audioManager.setSeVolume(v)
      },
    }),
    { name: 'whodunit_audio' }
  )
)
