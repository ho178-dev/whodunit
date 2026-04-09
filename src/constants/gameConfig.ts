// ゲーム設定定数。容疑者・部屋・証拠の数、アクション数などを定義

// ゲームの基準解像度（GameShell スケール計算・SettingsModal プリセットで共用）
export const GAME_BASE_WIDTH = 960
export const GAME_BASE_HEIGHT = 540

export const SUSPECT_COUNT = 6
export const ROOM_COUNT = 5
export const EVIDENCE_COUNT = 12
export const FAKE_EVIDENCE_COUNT = 3

// 各容疑者の会話ステートメント数（固定）
export const STATEMENT_COUNT = 5

// 容疑者・犯人ごとの evidence_reactions における矛盾定義の件数
export const SUSPECT_CONTRADICTION_COUNT = 1
export const MURDERER_CONTRADICTION_COUNT = 2

// UIレイアウト上限（これを超えると会話ピップが折り返して見切れる）
export const MAX_VISIBLE_TALK_PIPS = 30

// 調査・会話アクション上限（固定値）
export const ACTIONS = 15
export const TALK_ACTIONS = 30

// 議論・告発フェーズの証拠突きつけAP
export const DISCUSSION_CONFRONT_ACTIONS = 6
export const ACCUSATION_CONFRONT_ACTIONS = 6
