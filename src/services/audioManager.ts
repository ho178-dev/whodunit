// BGM・SEの再生を一元管理するシングルトンサービス
import { SE_PATHS } from './audioConfig'
import type { SeKey } from './audioConfig'

/** audioStore の persist キーと構造（初期値読み込み用） */
const AUDIO_STORE_KEY = 'whodunit_audio'

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null
  private currentBgmPath: string | null = null
  private bgmVolume = 0.7
  private seVolume = 0.8

  constructor() {
    // localStorage から永続化済み音量を読み込んで初期値に適用する
    try {
      const stored = localStorage.getItem(AUDIO_STORE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as { state?: { bgmVolume?: number; seVolume?: number } }
        if (typeof parsed.state?.bgmVolume === 'number') this.bgmVolume = parsed.state.bgmVolume
        if (typeof parsed.state?.seVolume === 'number') this.seVolume = parsed.state.seVolume
      }
    } catch {
      // localStorage 不可環境ではデフォルト値を使用
    }
  }

  /** BGMをループ再生する。同パスが既に再生中なら何もしない */
  playBgm(path: string): void {
    if (this.currentBgmPath === path) return
    this.stopBgm()
    const audio = new Audio(path)
    audio.loop = true
    audio.volume = this.bgmVolume
    this.bgmAudio = audio
    this.currentBgmPath = path
    audio.play().catch(() => {
      // autoplay 制限で失敗した場合はリソースを解放し、次の操作で再試行できるようにする
      this.bgmAudio = null
      this.currentBgmPath = null
    })
  }

  /** BGMを停止してリソースを解放する */
  stopBgm(): void {
    if (!this.bgmAudio) return
    this.bgmAudio.pause()
    this.bgmAudio = null
    this.currentBgmPath = null
  }

  /** SEを再生する（都度 Audio インスタンスを生成して多重再生対応。最大1秒で停止） */
  playSe(key: SeKey): void {
    const audio = new Audio(SE_PATHS[key])
    audio.volume = this.seVolume
    audio.play().catch(() => {})
    setTimeout(() => {
      audio.pause()
    }, 1000)
  }

  /** BGM音量を更新する（再生中のBGMにも即時反映） */
  setBgmVolume(v: number): void {
    this.bgmVolume = v
    if (this.bgmAudio) this.bgmAudio.volume = v
  }

  /** SE音量を更新する */
  setSeVolume(v: number): void {
    this.seVolume = v
  }
}

export const audioManager = new AudioManager()
