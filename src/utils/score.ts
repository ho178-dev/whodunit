// シナリオのプレイスコアをlocalStorageに保存・読み込みするユーティリティ
import type { DifficultyScore } from '../types/game'

const scoreKey = (scenarioTitle: string) => `whodunit_score_${scenarioTitle}`

export function loadScoreData(title: string): DifficultyScore | null {
  try {
    const stored = localStorage.getItem(scoreKey(title))
    if (stored) return JSON.parse(stored) as DifficultyScore
  } catch {
    /* localStorage が使えない環境では null を返す */
  }
  return null
}

// 今回の結果でクリア・プレイ済みフラグを保存する
export function saveScore(
  title: string,
  result: { cleared: boolean; usedActions: number; usedTalkActions: number }
): void {
  const prev = loadScoreData(title)
  const next: DifficultyScore = {
    cleared: prev?.cleared || result.cleared,
    played: true,
  }
  try {
    localStorage.setItem(scoreKey(title), JSON.stringify(next))
  } catch {
    /* localStorage への保存失敗は無視 */
  }
}
