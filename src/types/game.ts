// ゲームフェーズ・スコア・対決ログエントリ・仮説エントリの型定義
export type GamePhase =
  | 'title'
  | 'scenario_select'
  | 'api_key_input'
  | 'generating'
  | 'scenario_briefing'
  | 'investigation'
  | 'discussion'
  | 'voting'
  | 'accusation'
  | 'ending'
  | 'trial_preview'

// シナリオのプレイスコア（クリア有無・プレイ済みフラグ）
export interface DifficultyScore {
  cleared: boolean
  played: boolean
}

export interface ConfrontationEntry {
  suspectId: string
  evidenceId: string
  reaction: string
  behavior: import('./scenario').NpcBehavior
  timestamp: number
}

// 容疑者ごとの動機・機会・手段・自由メモを保持する仮説エントリ
export interface SuspectHypothesis {
  suspectId: string
  motive: string
  opportunity: string
  means: string
  notes: string
}

// アンロック済み追及質問（容疑者・証拠・質問IDの三点で一意に識別）
export interface UnlockedPursuitQuestion {
  suspectId: string
  evidenceId: string
  questionId: string
}

// 証言選択待ち状態（追及質問の証言ゲート）
export interface PendingPursuitActivation {
  suspectId: string
  evidenceId: string
}

// 誤った証言を選択したときのフィードバック
export interface PursuitWrongResult {
  suspectId: string
  response: string
}

// 仮説エントリに1文字以上の入力があるか判定する
export function isHypothesisFilled(h: SuspectHypothesis): boolean {
  return !!(h.motive || h.opportunity || h.means || h.notes)
}
