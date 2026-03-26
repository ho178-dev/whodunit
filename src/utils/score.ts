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

export function loadScoreData(title: string): ScenarioScoreData {
  try {
    const stored = localStorage.getItem(scoreKey(title))
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
