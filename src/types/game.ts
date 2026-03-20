export type GamePhase =
  | 'title'
  | 'api_key_input'
  | 'generating'
  | 'character_select'
  | 'investigation'
  | 'discussion'
  | 'voting'
  | 'ending'

export interface ConfrontationEntry {
  suspectId: string
  evidenceId: string
  reaction: string
  behavior: import('./scenario').NpcBehavior
  timestamp: number
}
