// BGM・SEの再生を一元管理するシングルトンサービス
import { SE_PATHS } from './audioConfig'
import type { SeKey } from './audioConfig'

/** audioStore の persist キーと構造（初期値読み込み用） */
const AUDIO_STORE_KEY = 'whodunit_audio'

/** フェードの総時間(ms)・ステップ間隔(ms)・ステップ数 */
const FADE_DURATION_MS = 500
const FADE_INTERVAL_MS = 20
const FADE_STEPS = FADE_DURATION_MS / FADE_INTERVAL_MS

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null
  private currentBgmPath: string | null = null
  private bgmVolume = 0.5
  private seVolume = 0.5
  /** 進行中のフェードintervalId（フェードアウト・フェードインを通じて1本管理） */
  private fadeIntervalId: number | null = null

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

  /** 進行中のフェードをキャンセルする */
  private clearFade(): void {
    if (this.fadeIntervalId !== null) {
      clearInterval(this.fadeIntervalId)
      this.fadeIntervalId = null
    }
  }

  /** BGMをクロスフェードで切り替える。同パスが既に再生中なら何もしない */
  playBgm(path: string): void {
    if (this.currentBgmPath === path) return

    // 進行中のフェードをキャンセル
    this.clearFade()

    const oldAudio = this.bgmAudio
    const targetVolume = this.bgmVolume

    // 新BGMをあらかじめ準備（volume=0 でロード開始）
    const newAudio = new Audio(path)
    newAudio.loop = true
    newAudio.volume = 0

    this.bgmAudio = newAudio
    this.currentBgmPath = path

    const startNewBgm = () => {
      newAudio.play().catch(() => {
        // autoplay 制限で失敗した場合はリソースを解放する
        if (this.bgmAudio === newAudio) {
          this.bgmAudio = null
          this.currentBgmPath = null
        }
      })
      // 新BGMのフェードイン
      let step = 0
      this.fadeIntervalId = window.setInterval(() => {
        step++
        newAudio.volume = Math.min(targetVolume, (targetVolume * step) / FADE_STEPS)
        if (step >= FADE_STEPS) {
          this.clearFade()
          newAudio.volume = targetVolume
        }
      }, FADE_INTERVAL_MS)
    }

    if (!oldAudio) {
      // 旧BGMがない場合はそのままフェードインを開始
      startNewBgm()
      return
    }

    // 旧BGMのフェードアウト
    const oldVolume = oldAudio.volume
    let step = 0
    this.fadeIntervalId = window.setInterval(() => {
      step++
      oldAudio.volume = Math.max(0, oldVolume * (1 - step / FADE_STEPS))
      if (step >= FADE_STEPS) {
        this.clearFade()
        oldAudio.pause()
        oldAudio.src = ''
        startNewBgm()
      }
    }, FADE_INTERVAL_MS)
  }

  /** BGMを停止してリソースを解放する */
  stopBgm(): void {
    this.clearFade()
    if (!this.bgmAudio) return
    this.bgmAudio.pause()
    this.bgmAudio.src = ''
    this.bgmAudio = null
    this.currentBgmPath = null
  }

  /** SEを再生する（都度 Audio インスタンスを生成して多重再生対応。ended イベントで自然停止） */
  playSe(key: SeKey): void {
    const audio = new Audio(SE_PATHS[key])
    audio.volume = this.seVolume
    const onEnded = () => {
      audio.src = ''
      audio.removeEventListener('ended', onEnded)
    }
    audio.addEventListener('ended', onEnded)
    audio.play().catch(() => {})
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
