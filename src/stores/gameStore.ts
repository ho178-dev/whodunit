import { create } from 'zustand'
import type { GamePhase, ConfrontationEntry, Difficulty } from '../types/game'
import type { Scenario } from '../types/scenario'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'

export interface HeardStatement {
  suspectId: string
  suspectName: string
  index: number  // -1 = greeting, 0以上 = statements[index]
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
  discoveredEvidenceIds: string[]
  talkedSuspectIds: string[]
  heardStatements: HeardStatement[]
  confrontationLog: ConfrontationEntry[]
  votedSuspectId: string | null

  // Actions
  setPhase: (phase: GamePhase) => void
  setApiKey: (key: string) => void
  setUseFixedScenario: (use: boolean) => void
  setScenario: (scenario: Scenario) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationError: (error: string | null) => void
  setDifficulty: (difficulty: Difficulty) => void
  setCurrentRoomId: (id: string | null) => void
  discoverEvidence: (evidenceId: string) => void
  talkToSuspect: (suspectId: string) => void
  consumeAction: () => void
  hearStatement: (entry: HeardStatement) => void
  addConfrontation: (entry: Omit<ConfrontationEntry, 'timestamp'>) => void
  setVotedSuspectId: (id: string) => void
  resetGame: () => void
}

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
  discoveredEvidenceIds: [],
  talkedSuspectIds: [],
  heardStatements: [],
  confrontationLog: [],
  votedSuspectId: null,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setApiKey: (key) => set({ apiKey: key }),
  setUseFixedScenario: (use) => set({ useFixedScenario: use }),
  setScenario: (scenario) => set({ scenario }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationError: (error) => set({ generationError: error }),
  setDifficulty: (difficulty) => set({
    difficulty,
    actionsRemaining: DIFFICULTY_CONFIG[difficulty].actions,
    talkActionsRemaining: DIFFICULTY_CONFIG[difficulty].talkActions,
  }),
  setCurrentRoomId: (id) => set({ currentRoomId: id }),
  discoverEvidence: (evidenceId) =>
    set((state) => ({
      discoveredEvidenceIds: state.discoveredEvidenceIds.includes(evidenceId)
        ? state.discoveredEvidenceIds
        : [...state.discoveredEvidenceIds, evidenceId],
    })),
  talkToSuspect: (suspectId) =>
    set((state) => ({
      talkedSuspectIds: state.talkedSuspectIds.includes(suspectId)
        ? state.talkedSuspectIds
        : [...state.talkedSuspectIds, suspectId],
    })),
  consumeAction: () =>
    set((state) => ({
      actionsRemaining: Math.max(0, state.actionsRemaining - 1),
    })),
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
  addConfrontation: (entry) =>
    set((state) => ({
      confrontationLog: [...state.confrontationLog, { ...entry, timestamp: Date.now() }],
    })),
  setVotedSuspectId: (id) => set({ votedSuspectId: id }),
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
