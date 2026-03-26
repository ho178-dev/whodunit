// シナリオのプレイスコアをlocalStorageに保存・読み込みするユーティリティ
import type { Difficulty, DifficultyScore, ScenarioScoreData } from '../types/game'

const scoreKey = (scenarioTitle: string) => `whodunit_score_${scenarioTitle}`

// クリア時のみ自己ベストを更新する（未クリアなら prev をそのまま返す）
function updateBest(
  cleared: boolean,
  prev: number | undefined,
  current: number
): number | undefined {
  if (!cleared) return prev
  return prev !== undefined ? Math.min(prev, current) : current
}

// タイトル変更時の後方互換フォールバック（旧タイトル → 新タイトル）
const TITLE_FALLBACKS: Record<string, string> = {
  白銀の密室: '霧の密室',
}

export function loadScoreData(title: string): ScenarioScoreData {
  try {
    const stored =
      localStorage.getItem(scoreKey(title)) ??
      (TITLE_FALLBACKS[title] ? localStorage.getItem(scoreKey(TITLE_FALLBACKS[title])) : null)
    if (stored) return JSON.parse(stored) as ScenarioScoreData
  } catch {
    /* localStorage が使えない環境では空を返す */
  }
  return {}
}

// 今回の結果でスコアを更新・保存し、保存後のスコアを返す
export function saveScore(
  title: string,
  difficulty: Difficulty,
  result: { cleared: boolean; usedActions: number; usedTalkActions: number }
): DifficultyScore {
  const current = loadScoreData(title)
  const prev = current[difficulty]
  const { cleared, usedActions, usedTalkActions } = result
  const next: DifficultyScore = {
    cleared: prev?.cleared || cleared,
    played: true,
    bestActions: updateBest(cleared, prev?.bestActions, usedActions),
    bestTalkActions: updateBest(cleared, prev?.bestTalkActions, usedTalkActions),
  }
  try {
    localStorage.setItem(scoreKey(title), JSON.stringify({ ...current, [difficulty]: next }))
  } catch {
    /* localStorage への保存失敗は無視 */
  }
  return next
}
