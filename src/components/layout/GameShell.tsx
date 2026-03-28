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
import { TrialPreview } from '../phases/TrialPreview'
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
      case 'trial_preview':
        return <TrialPreview />
      default:
        return <TitleScreen />
    }
  }

  return (
    // 外層: ウィンドウ全体を覆い、16:9コンテナをレターボックス形式で中央配置する
    <div className="w-screen h-screen bg-gothic-bg flex items-center justify-center overflow-hidden">
      {/* 16:9固定コンテナ: min(100vw, 100vh*16/9) × min(100vh, 100vw*9/16) */}
      <div
        className="relative overflow-hidden border border-gothic-border"
        style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
        }}
      >
        <FadeTransition triggerKey={phase} phaseLabel={PHASE_LABELS[phase]}>
          {renderPhase()}
        </FadeTransition>

        {/* 手動セーブボタン：コンテナ内 absolute に変更 */}
        {showSaveButton && (
          <button
            onClick={() => setShowSaveModal(true)}
            className="absolute top-2 right-2 z-40 border border-gothic-border bg-gothic-bg/80 text-gothic-muted font-serif text-xs px-3 py-1.5 hover:border-gothic-gold hover:text-gothic-gold transition-all duration-200"
          >
            セーブ
          </button>
        )}

        {showSaveModal && <ManualSaveModal onClose={() => setShowSaveModal(false)} />}
      </div>
    </div>
  )
}
