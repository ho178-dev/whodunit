// セーブスロットのデータ型定義（localStorage 保存形式）
import type {
  GamePhase,
  ConfrontationEntry,
  SuspectHypothesis,
  UnlockedPursuitQuestion,
} from './game'
import type { HeardStatement } from '../stores/gameStore'

/** セーブデータのスキーマバージョン（型変更時にインクリメントして非互換データを弾く） */
export const SAVE_VERSION = 2

/** saveToSlot に渡すデータ（savedAt は saveToSlot 内で自動付与するため不要） */
export type SaveInput = Omit<SavePayload, 'savedAt'>

/** 1スロット分のセーブデータ */
export interface SavePayload {
  version: number
  savedAt: number // UNIX ms
  scenarioTitle: string // 固定シナリオのタイトル（ロード時にシナリオ本体を引き直す）
  phase: GamePhase
  currentRoomId: string | null
  actionsRemaining: number
  talkActionsRemaining: number
  discussionConfrontActionsRemaining: number
  accusationConfrontActionsRemaining: number
  inspectedEvidenceIds: string[]
  examinedEvidenceIds: string[]
  discoveredCombinationIds: string[]
  revealedFakeEvidenceIds: string[]
  talkedSuspectIds: string[]
  viewedSuspectProfileIds: string[] // 組み合わせ発見条件の復元に必要
  heardStatements: HeardStatement[]
  confrontationLog: ConfrontationEntry[]
  unlockedPursuitQuestions: UnlockedPursuitQuestion[]
  askedPursuitQuestionIds: string[]
  votedSuspectId: string | null
  hypotheses: SuspectHypothesis[]
  murdererEscaped: boolean // 犯人逃亡フラグ（endingフェーズの表示内容に影響）
}

/** null = 空スロット */
export type SaveSlot = SavePayload | null
