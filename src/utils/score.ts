// シナリオのプレイスコアをlocalStorageに保存・読み込みするユーティリティ
import type { Difficulty, DifficultyScore, ScenarioScoreData } from '../types/game'
import { RANK_THRESHOLDS } from '../constants/gameConfig'

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

// usedActions と難易度からランクを算出する（クリア済み正解時のみ呼ぶ）
export function calculateRank(usedActions: number, difficulty: Difficulty): 'S' | 'A' | 'B' | 'C' {
  const { S, A, B } = RANK_THRESHOLDS[difficulty]
  if (usedActions <= S) return 'S'
  if (usedActions <= A) return 'A'
  if (usedActions <= B) return 'B'
  return 'C'
}

// ランクの優劣を比較し、より良い方を返す（S > A > B > C）
function betterRank(
  a: 'S' | 'A' | 'B' | 'C' | undefined,
  b: 'S' | 'A' | 'B' | 'C'
): 'S' | 'A' | 'B' | 'C' {
  const order = ['S', 'A', 'B', 'C'] as const
  if (a === undefined) return b
  return order.indexOf(a) <= order.indexOf(b) ? a : b
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
  const rank = cleared ? calculateRank(usedActions, difficulty) : undefined
  const next: DifficultyScore = {
    cleared: prev?.cleared || cleared,
    played: true,
    bestActions: updateBest(cleared, prev?.bestActions, usedActions),
    bestTalkActions: updateBest(cleared, prev?.bestTalkActions, usedTalkActions),
    bestRank: rank !== undefined ? betterRank(prev?.bestRank, rank) : prev?.bestRank,
  }
  try {
    localStorage.setItem(scoreKey(title), JSON.stringify({ ...current, [difficulty]: next }))
  } catch {
    /* localStorage への保存失敗は無視 */
  }
  return next
}
