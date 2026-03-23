// NPC感情に関するスタイル定数。議論フェーズのダイアログ枠色・ラベル表示に使用
import type { NpcBehavior } from '../types/scenario'

export const behaviorBorderColors: Record<NpcBehavior, string> = {
  calm: 'border-gothic-border',
  nervous: 'border-yellow-700',
  angry: 'border-red-800',
  sad: 'border-blue-800',
  evasive: 'border-orange-800',
}

export const behaviorLabel: Record<NpcBehavior, string> = {
  calm: '冷静',
  nervous: '動揺',
  angry: '怒り',
  sad: '悲嘆',
  evasive: '回避',
}
