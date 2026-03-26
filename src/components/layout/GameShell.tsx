// ゲームフェーズに応じた画面切り替えを行うルートレイアウトコンポーネント
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { FadeTransition } from '../shared/FadeTransition'
import { PHASE_LABELS } from '../../constants/phaseConfig'
import { TitleScreen } from '../phases/TitleScreen'
import { ApiKeyInput } from '../phases/ApiKeyInput'
import { LoadingScreen } from '../phases/LoadingScreen'
import { ScenarioBriefing } from '../phases/ScenarioBriefing'
import { InvestigationPhase } from '../phases/InvestigationPhase'
import { DiscussionPhase } from '../phases/DiscussionPhase'
import { VotingPhase } from '../phases/VotingPhase'
import { AccusationPhase } from '../phases/AccusationPhase'
import { EndingScreen } from '../phases/EndingScreen'
import { ScenarioSelect } from '../phases/ScenarioSelect'
import { ManualSaveModal } from '../shared/ManualSaveModal'

// 手動セーブボタンを表示するフェーズ
const MANUAL_SAVE_PHASES = new Set([
  'scenario_briefing',
  'investigation',
  'discussion',
  'voting',
  'accusation',
])

// ゲームのルートレイアウト。フェーズに応じた画面を切り替えてレンダリングする
export function GameShell() {
  const phase = useGameStore((s) => s.phase)
  const useFixedScenario = useGameStore((s) => s.useFixedScenario)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const showSaveButton = useFixedScenario && MANUAL_SAVE_PHASES.has(phase)

  // 現在のフェーズに対応するコンポーネントを返す
  const renderPhase = () => {
    switch (phase) {
      case 'title':
        return <TitleScreen />
      case 'scenario_select':
        return <ScenarioSelect />
      case 'api_key_input':
        return <ApiKeyInput />
      case 'generating':
        return <LoadingScreen />
      case 'scenario_briefing':
        return <ScenarioBriefing />
      case 'investigation':
        return <InvestigationPhase />
      case 'discussion':
        return <DiscussionPhase />
      case 'voting':
        return <VotingPhase />
      case 'accusation':
        return <AccusationPhase />
      case 'ending':
        return <EndingScreen />
      default:
        return <TitleScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gothic-bg">
      <FadeTransition triggerKey={phase} phaseLabel={PHASE_LABELS[phase]}>
        {renderPhase()}
      </FadeTransition>

      {/* 手動セーブボタン：ゲームプレイ中の固定シナリオのみ表示 */}
      {showSaveButton && (
        <button
          onClick={() => setShowSaveModal(true)}
          className="fixed top-2 right-2 z-40 border border-gothic-border bg-gothic-bg/80 text-gothic-muted font-serif text-xs px-3 py-1.5 hover:border-gothic-gold hover:text-gothic-gold transition-all duration-200"
        >
          セーブ
        </button>
      )}

      {showSaveModal && <ManualSaveModal onClose={() => setShowSaveModal(false)} />}
    </div>
  )
}
