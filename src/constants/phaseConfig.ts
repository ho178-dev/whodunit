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
    text: '投票フェーズ',
    subText: '真犯人を指名せよ',
    textColor: 'text-green-400',
  },
  accusation: {
    text: '告発フェーズ',
    subText: '証拠で追い詰めよ',
    textColor: 'text-red-400',
  },
  ending: {
    text: 'エンディング',
    textColor: 'text-yellow-400',
  },
}

/** フェーズ別の背景色調オーバーレイ設定マップ */
export const PHASE_OVERLAYS: Partial<Record<GamePhase, PhaseOverlay>> = {
  discussion: { className: 'bg-blue-900/15' },
  voting: { className: 'bg-green-900/15' },
  accusation: { className: 'bg-red-900/20' },
  ending: { className: 'bg-yellow-700/10' },
}
