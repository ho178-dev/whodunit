// ゲーム設定定数。容疑者・部屋・証拠の数、難易度ごとのアクション数などを定義
import type { Difficulty } from '../types/game'

export const SUSPECT_COUNT = 6
export const ROOM_COUNT = 5
export const EVIDENCE_COUNT = 12
export const FAKE_EVIDENCE_COUNT = 3

// UIレイアウト上限（これを超えると会話ピップが折り返して見切れる）
export const MAX_VISIBLE_TALK_PIPS = 30

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    actions: number
    talkActions: number
    label: string
    description: string
  }
> = {
  easy: {
    actions: 12,
    talkActions: 45,
    label: '入門',
    description: '証拠も証言も十分。じっくりと推理できる。',
  },
  normal: {
    actions: 8,
    talkActions: 30,
    label: '普通',
    description: 'バランスよく調査できる標準の難易度。',
  },
  hard: {
    actions: 5,
    talkActions: 18,
    label: '難解',
    description: '限られた手がかりで真犯人を追い詰める。',
  },
}
