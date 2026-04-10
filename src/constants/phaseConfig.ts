// フェーズ別の幕間演出設定（テキスト・色・サブテキスト）とオーバーレイ色設定
import type { GamePhase } from '../types/game'

export interface PhaseLabel {
  text: string
  subText?: string
  textColor: string
  /** 省略時は 1200ms */
  duration?: number
}

export interface PhaseOverlay {
  className: string
}

export const PHASE_LABELS: Partial<Record<GamePhase, PhaseLabel>> = {
  scenario_select: {
    text: 'シナリオ選択',
    textColor: 'text-gothic-muted',
    duration: 800,
  },
  investigation: {
    text: '捜査フェーズ',
    subText: '手がかりを集めよ',
    textColor: 'text-gothic-muted',
  },
  discussion: {
    text: '議論フェーズ',
    subText: '容疑者を問い詰めよ',
    textColor: 'text-blue-400',
  },
  voting: {
    text: '告発フェーズ',
    subText: '真犯人を指名せよ',
    textColor: 'text-green-400',
  },
  accusation: {
    text: '断罪フェーズ',
    subText: '証拠で追い詰めよ',
    textColor: 'text-red-400',
  },
  ending: {
    text: 'エンディング',
    textColor: 'text-yellow-400',
  },
  trial_preview: {
    text: '予告',
    textColor: 'text-gothic-gold',
    duration: 800,
  },
}

/** セーブスロット一覧でのフェーズ表示テキスト */
export const PHASE_DISPLAY: Partial<Record<GamePhase, string>> = {
  scenario_briefing: 'ブリーフィング',
  investigation: '捜査中',
  discussion: '議論中',
  voting: '告発中',
  accusation: '断罪中',
  ending: 'エンディング',
}

/** フェーズ別の背景色調オーバーレイ設定マップ */
export const PHASE_OVERLAYS: Partial<Record<GamePhase, PhaseOverlay>> = {
  title: { className: 'bg-black/40' }, // ロゴ・ボタンの視認性確保のため暗め
  discussion: { className: 'bg-blue-900/15' },
  voting: { className: 'bg-green-900/15' },
  accusation: { className: 'bg-red-900/20' },
  ending: { className: 'bg-yellow-700/10' },
}
