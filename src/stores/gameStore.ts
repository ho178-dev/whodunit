// Zustandによるゲーム全体の状態管理ストア（フェーズ・証拠・会話履歴など）
import { create } from 'zustand'
import type { GamePhase, ConfrontationEntry, Difficulty } from '../types/game'
import type { Scenario } from '../types/scenario'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'

export interface HeardStatement {
  suspectId: string
  suspectName: string
  index: number // -1 = greeting, 0以上 = statements[index]
  text: string
}

export interface GameState {
  phase: GamePhase
  apiKey: string | null
  useFixedScenario: boolean
  scenario: Scenario | null
  isGenerating: boolean
  generationError: string | null
  difficulty: Difficulty
  actionsRemaining: number
  talkActionsRemaining: number
  currentRoomId: string | null
  inspectedEvidenceIds: string[] // 1段階目：外観開示済み
  examinedEvidenceIds: string[] // 2段階目：論理的示唆開示済み
  talkedSuspectIds: string[]
  heardStatements: HeardStatement[]
  confrontationLog: ConfrontationEntry[]
  votedSuspectId: string | null

  // Actions
  setPhase: (phase: GamePhase) => void
  setApiKey: (key: string | null) => void
  setUseFixedScenario: (use: boolean) => void
  setScenario: (scenario: Scenario) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationError: (error: string | null) => void
  setDifficulty: (difficulty: Difficulty) => void
  setCurrentRoomId: (id: string | null) => void
  inspectEvidence: (evidenceId: string) => void
  examineEvidence: (evidenceId: string) => void
  talkToSuspect: (suspectId: string) => void
  consumeAction: () => void
  hearStatement: (entry: HeardStatement) => void
  addConfrontation: (entry: Omit<ConfrontationEntry, 'timestamp'>) => void
  setVotedSuspectId: (id: string) => void
  resetGame: () => void
}

// IDリストへの重複なし追加ヘルパー（既存の場合はearly returnでno-op）
const addId = (arr: string[], id: string) => (arr.includes(id) ? null : [...arr, id])

const initialState = {
  phase: 'title' as GamePhase,
  apiKey: null,
  useFixedScenario: false,
  scenario: null,
  isGenerating: false,
  generationError: null,
  difficulty: 'normal' as Difficulty,
  actionsRemaining: DIFFICULTY_CONFIG.normal.actions,
  talkActionsRemaining: DIFFICULTY_CONFIG.normal.talkActions,
  currentRoomId: null,
  inspectedEvidenceIds: [],
  examinedEvidenceIds: [],
  talkedSuspectIds: [],
  heardStatements: [],
  confrontationLog: [],
  votedSuspectId: null,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // ゲームフェーズを更新する
  setPhase: (phase) => set({ phase }),
  // APIキーを更新する
  setApiKey: (key) => set({ apiKey: key }),
  // 固定シナリオ使用フラグを更新する
  setUseFixedScenario: (use) => set({ useFixedScenario: use }),
  // シナリオデータを設定する
  setScenario: (scenario) => set({ scenario }),
  // 生成中フラグを更新する
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  // 生成エラーメッセージを更新する
  setGenerationError: (error) => set({ generationError: error }),
  // 難易度を設定し、アクション残数を初期値にリセットする
  setDifficulty: (difficulty) =>
    set({
      difficulty,
      actionsRemaining: DIFFICULTY_CONFIG[difficulty].actions,
      talkActionsRemaining: DIFFICULTY_CONFIG[difficulty].talkActions,
    }),
  // 現在の選択部屋IDを更新する
  setCurrentRoomId: (id) => set({ currentRoomId: id }),
  // 証拠を外観開示済みリストに追加する（1段階目、重複追加しない）
  inspectEvidence: (evidenceId) =>
    set((state) => {
      const next = addId(state.inspectedEvidenceIds, evidenceId)
      return next ? { inspectedEvidenceIds: next } : {}
    }),
  // 証拠を論理的示唆開示済みリストに追加する（2段階目、重複追加しない）
  examineEvidence: (evidenceId) =>
    set((state) => {
      const next = addId(state.examinedEvidenceIds, evidenceId)
      return next ? { examinedEvidenceIds: next } : {}
    }),
  // 容疑者を会話済みリストに追加する（重複追加しない）
  talkToSuspect: (suspectId) =>
    set((state) => {
      const next = addId(state.talkedSuspectIds, suspectId)
      return next ? { talkedSuspectIds: next } : {}
    }),
  // 調査アクションを1消費する（0を下回らない）
  consumeAction: () =>
    set((state) => ({
      actionsRemaining: Math.max(0, state.actionsRemaining - 1),
    })),
  // 証言を記録してトーク回数を消費する（既聴の場合は消費しない）
  hearStatement: (entry) =>
    set((state) => {
      const alreadyHeard = state.heardStatements.some(
        (s) => s.suspectId === entry.suspectId && s.index === entry.index
      )
      if (alreadyHeard) return {}
      return {
        talkActionsRemaining: Math.max(0, state.talkActionsRemaining - 1),
        heardStatements: [...state.heardStatements, entry],
      }
    }),
  // 容疑者への証拠突きつけ記録をタイムスタンプ付きで追加する
  addConfrontation: (entry) =>
    set((state) => ({
      confrontationLog: [...state.confrontationLog, { ...entry, timestamp: Date.now() }],
    })),
  // 投票した容疑者IDを設定する
  setVotedSuspectId: (id) => set({ votedSuspectId: id }),
  // ゲームをリセットして同一シナリオ・APIキーで再挑戦できる状態にする
  resetGame: () =>
    set((state) => ({
      ...initialState,
      phase: 'scenario_briefing' as GamePhase,
      scenario: state.scenario,
      apiKey: state.apiKey,
      useFixedScenario: state.useFixedScenario,
      difficulty: state.difficulty,
      actionsRemaining: DIFFICULTY_CONFIG[state.difficulty].actions,
      talkActionsRemaining: DIFFICULTY_CONFIG[state.difficulty].talkActions,
    })),
}))
