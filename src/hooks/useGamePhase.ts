import { useGameStore } from '../stores/gameStore'
import type { GameState } from '../stores/gameStore'
import { canTransition } from '../machines/gameMachine'
import type { GamePhase } from '../types/game'

export function useGamePhase() {
  const store = useGameStore()
  const { phase, setPhase } = store

  const transition = (to: GamePhase) => {
    if (canTransition(phase, to, store as GameState)) {
      setPhase(to)
    }
  }

  return { phase, transition }
}
