// ゲームフェーズ間の遷移ルール定義と遷移可否チェック関数
import type { GamePhase } from '../types/game'
import type { GameState } from '../stores/gameStore'

export type PhaseTransition = {
  from: GamePhase
  to: GamePhase
  guard?: (state: GameState) => boolean
}

export const PHASE_TRANSITIONS: PhaseTransition[] = [
  { from: 'title', to: 'api_key_input' },
  { from: 'title', to: 'scenario_briefing', guard: () => true },
  { from: 'api_key_input', to: 'generating', guard: (s) => !!s.apiKey },
  { from: 'generating', to: 'scenario_briefing', guard: (s) => !!s.scenario },
  { from: 'scenario_briefing', to: 'investigation' },
  {
    from: 'investigation',
    to: 'discussion',
    guard: (s) => s.inspectedEvidenceIds.length > 0 || s.actionsRemaining === 0,
  },
  { from: 'discussion', to: 'voting' },
  { from: 'voting', to: 'ending', guard: (s) => !!s.votedSuspectId },
  { from: 'ending', to: 'scenario_briefing' },
  { from: 'ending', to: 'api_key_input' },
  { from: 'ending', to: 'title' },
  { from: 'ending', to: 'trial_preview' },
  { from: 'trial_preview', to: 'title' },
]

// 指定されたフェーズ遷移が現在のゲーム状態で許可されるか判定する
export function canTransition(from: GamePhase, to: GamePhase, state: GameState): boolean {
  const transition = PHASE_TRANSITIONS.find((t) => t.from === from && t.to === to)
  if (!transition) return false
  if (transition.guard) return transition.guard(state)
  return true
}
