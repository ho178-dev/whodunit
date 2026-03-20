import { create } from 'zustand'
import type { GamePhase, ConfrontationEntry } from '../types/game'
import type { Scenario } from '../types/scenario'
import { MAX_ACTIONS } from '../constants/gameConfig'

export interface GameState {
  phase: GamePhase
  apiKey: string | null
  useFixedScenario: boolean
  scenario: Scenario | null
  isGenerating: boolean
  generationError: string | null
  selectedSuspectId: string | null
  actionsRemaining: number
  currentRoomId: string | null
  discoveredEvidenceIds: string[]
  talkedSuspectIds: string[]
  confrontationLog: ConfrontationEntry[]
  votedSuspectId: string | null

  // Actions
  setPhase: (phase: GamePhase) => void
  setApiKey: (key: string) => void
  setUseFixedScenario: (use: boolean) => void
  setScenario: (scenario: Scenario) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationError: (error: string | null) => void
  setSelectedSuspectId: (id: string) => void
  setCurrentRoomId: (id: string | null) => void
  discoverEvidence: (evidenceId: string) => void
  talkToSuspect: (suspectId: string) => void
  consumeAction: () => void
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
  selectedSuspectId: null,
  actionsRemaining: MAX_ACTIONS,
  currentRoomId: null,
  discoveredEvidenceIds: [],
  talkedSuspectIds: [],
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
  setSelectedSuspectId: (id) => set({ selectedSuspectId: id }),
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
  addConfrontation: (entry) =>
    set((state) => ({
      confrontationLog: [...state.confrontationLog, { ...entry, timestamp: Date.now() }],
    })),
  setVotedSuspectId: (id) => set({ votedSuspectId: id }),
  resetGame: () =>
    set((state) => ({
      ...initialState,
      phase: 'character_select' as GamePhase,
      scenario: state.scenario,
      apiKey: state.apiKey,
      useFixedScenario: state.useFixedScenario,
    })),
}))
