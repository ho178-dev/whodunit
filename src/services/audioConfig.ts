// BGM・SEのファイルパス定義とフェーズマッピング
import type { GamePhase } from '../types/game'

const BGM_MANOR_AWAITS = '/assets/bgm/The Manor Awaits.ogg'
const BGM_PARLOUR = '/assets/bgm/A Death in the Parlour.ogg'

/** フェーズ→BGMパスマップ（accusation/ending は正解/不正解で分岐するため別定数を使用） */
export const PHASE_BGM: Partial<Record<GamePhase, string>> = {
  title: BGM_MANOR_AWAITS,
  scenario_select: BGM_MANOR_AWAITS,
  api_key_input: BGM_MANOR_AWAITS,
  generating: BGM_MANOR_AWAITS,
  trial_preview: BGM_MANOR_AWAITS,
  scenario_briefing: BGM_PARLOUR,
  difficulty_select: BGM_PARLOUR,
  investigation: '/assets/bgm/Candlelit Clues.ogg',
  discussion: '/assets/bgm/Cross-Examination.ogg',
  voting: '/assets/bgm/The Verdict.ogg',
}

/** 告発フェーズのBGM（正解/不正解で分岐） */
export const ACCUSATION_BGM = {
  correct: '/assets/bgm/Unmasked.ogg',
  wrong: '/assets/bgm/Wrong Accusation.ogg',
}

/** エンディングのBGM（正解/不正解で分岐） */
export const ENDING_BGM = {
  correct: '/assets/bgm/Truth Revealed.ogg',
  wrong: '/assets/bgm/The One That Got Away.ogg',
}

export type SeKey = 'click' | 'move'

/** SEのファイルパス */
export const SE_PATHS: Record<SeKey, string> = {
  click: '/assets/se/click.mp3',
  move: '/assets/se/move.mp3',
}
