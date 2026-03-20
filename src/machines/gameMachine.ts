import type { GamePhase } from '../types/game'
import type { GameState } from '../stores/gameStore'

export type PhaseTransition = {
  from: GamePhase
  to: GamePhase
  guard?: (state: GameState) => boolean
}

export const PHASE_TRANSITIONS: PhaseTransition[] = [
  { from: 'title', to: 'api_key_input' },
  { from: 'title', to: 'character_select', guard: () => true },
  { from: 'api_key_input', to: 'generating', guard: (s) => !!s.apiKey },
  { from: 'generating', to: 'character_select', guard: (s) => !!s.scenario },
  { from: 'character_select', to: 'investigation', guard: (s) => !!s.selectedSuspectId },
  {
    from: 'investigation',
    to: 'discussion',
    guard: (s) => s.discoveredEvidenceIds.length > 0 || s.actionsRemaining === 0,
  },
  { from: 'discussion', to: 'voting' },
  { from: 'voting', to: 'ending', guard: (s) => !!s.votedSuspectId },
  { from: 'ending', to: 'character_select' },
  { from: 'ending', to: 'api_key_input' },
  { from: 'ending', to: 'title' },
]

export function canTransition(from: GamePhase, to: GamePhase, state: GameState): boolean {
  const transition = PHASE_TRANSITIONS.find((t) => t.from === from && t.to === to)
  if (!transition) return false
  if (transition.guard) return transition.guard(state)
  return true
}
