export type GamePhase =
  | 'title'
  | 'api_key_input'
  | 'generating'
  | 'scenario_briefing'
  | 'investigation'
  | 'discussion'
  | 'voting'
  | 'ending'

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface ConfrontationEntry {
  suspectId: string
  evidenceId: string
  reaction: string
  behavior: import('./scenario').NpcBehavior
  timestamp: number
}
