// 現在のゲームフェーズ取得と、ガード付きフェーズ遷移を提供するカスタムフック
import { useGameStore } from '../stores/gameStore'
import type { GameState } from '../stores/gameStore'
import { canTransition } from '../machines/gameMachine'
import type { GamePhase } from '../types/game'

// 現在のフェーズとガード付き遷移関数を返すフック
export function useGamePhase() {
  const store = useGameStore()
  const { phase, setPhase } = store

  // ガード条件を確認してフェーズを遷移する
  const transition = (to: GamePhase) => {
    if (canTransition(phase, to, store as GameState)) {
      setPhase(to)
    }
  }

  return { phase, transition }
}
