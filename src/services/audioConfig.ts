// BGM・SEのファイルパス定義とフェーズマッピング
import type { GamePhase } from '../types/game'
import { assetUrl } from '../utils/assetUrl'

const BGM_MANOR_AWAITS = assetUrl('/assets/bgm/The Manor Awaits.ogg')
const BGM_PARLOUR = assetUrl('/assets/bgm/A Death in the Parlour.ogg')

/** フェーズ→BGMパスマップ（accusation/ending は正解/不正解で分岐するため別定数を使用） */
export const PHASE_BGM: Partial<Record<GamePhase, string>> = {
  title: BGM_MANOR_AWAITS,
  scenario_select: BGM_MANOR_AWAITS,
  api_key_input: BGM_MANOR_AWAITS,
  generating: BGM_MANOR_AWAITS,
  trial_preview: BGM_MANOR_AWAITS,
  scenario_briefing: BGM_PARLOUR,
  difficulty_select: BGM_PARLOUR,
  investigation: assetUrl('/assets/bgm/Candlelit Clues.ogg'),
  discussion: assetUrl('/assets/bgm/Cross-Examination.ogg'),
  voting: assetUrl('/assets/bgm/The Verdict.ogg'),
}

/** 告発フェーズのBGM（正解/不正解で分岐） */
export const ACCUSATION_BGM = {
  correct: assetUrl('/assets/bgm/Unmasked.ogg'),
  wrong: assetUrl('/assets/bgm/Wrong Accusation.ogg'),
}

/** エンディングのBGM（正解/不正解で分岐） */
export const ENDING_BGM = {
  correct: assetUrl('/assets/bgm/Truth Revealed.ogg'),
  wrong: assetUrl('/assets/bgm/The One That Got Away.ogg'),
}

export type SeKey = 'click' | 'move'

/** SEのファイルパス */
export const SE_PATHS: Record<SeKey, string> = {
  click: assetUrl('/assets/se/click.mp3'),
  move: assetUrl('/assets/se/move.mp3'),
}
