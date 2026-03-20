import { useGameStore } from '../stores/gameStore'
import { canTransition } from '../machines/gameMachine'
import type { GamePhase } from '../types/game'

export function useGamePhase() {
  const { phase, setPhase, ...state } = useGameStore()

  const transition = (to: GamePhase) => {
    if (canTransition(phase, to, { phase, setPhase, ...state } as any)) {
      setPhase(to)
    }
  }

  return { phase, transition }
}
