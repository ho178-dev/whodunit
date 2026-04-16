// NPC感情に関するスタイル定数。議論フェーズのダイアログ枠色・ラベル表示に使用
import type { NpcBehavior } from '../types/scenario'

const BEHAVIOR_OUTLINE_BASE = 'outline outline-1 [outline-offset:-4px]'

export const behaviorBorderColors: Record<NpcBehavior, string> = {
  calm: `border-gothic-border ${BEHAVIOR_OUTLINE_BASE} outline-gothic-border/20`,
  nervous: `border-yellow-700   ${BEHAVIOR_OUTLINE_BASE} outline-yellow-700/20`,
  angry: `border-red-800      ${BEHAVIOR_OUTLINE_BASE} outline-red-800/20`,
  sad: `border-blue-800     ${BEHAVIOR_OUTLINE_BASE} outline-blue-800/20`,
  evasive: `border-orange-800   ${BEHAVIOR_OUTLINE_BASE} outline-orange-800/20`,
}

export const behaviorLabel: Record<NpcBehavior, string> = {
  calm: '冷静',
  nervous: '動揺',
  angry: '怒り',
  sad: '悲嘆',
  evasive: '回避',
}
