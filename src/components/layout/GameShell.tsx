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
import { SettingsModal } from '../shared/SettingsModal'
import type { GamePhase } from '../../types/game'

// セーブ機能を有効にするフェーズ
const MANUAL_SAVE_PHASES = new Set([
  'scenario_briefing',
  'investigation',
  'discussion',
  'voting',
  'accusation',
])

// 右上に表示するフェーズ名バッジのテキスト（表示しないフェーズは undefined）
const PHASE_BADGE_TEXT: Partial<Record<GamePhase, string>> = {
  investigation: '探索',
  discussion: '議論',
  voting: '投票',
  accusation: '告発',
}

// ゲームのルートレイアウト。フェーズに応じた画面を切り替えてレンダリングする
export function GameShell() {
  const phase = useGameStore((s) => s.phase)
  const useFixedScenario = useGameStore((s) => s.useFixedScenario)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const showSave = useFixedScenario && MANUAL_SAVE_PHASES.has(phase)

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

        {/* 右上ヘッダー: フェーズ名バッジ（左）＋設定ボタン（右）。合計幅 = RightPanel と一致 */}
        <div className="absolute top-2 right-2 game-md:right-3 game-lg:right-4 z-40 flex w-[140px] game-sm:w-[160px] game-md:w-[180px] game-lg:w-[200px]">
          {/* フェーズ名バッジ（フェーズ名がある場合のみ表示） */}
          {PHASE_BADGE_TEXT[phase] && (
            <div className="flex-1 bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-3 py-1.5 text-center mr-1">
              <p className="font-display text-gothic-gold text-xs tracking-widest">
                {PHASE_BADGE_TEXT[phase]}
              </p>
            </div>
          )}
          {/* 設定ボタン: 全フェーズで表示（セーブ可否はSettingsModal内で制御） */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="border border-gothic-border bg-gothic-bg/80 text-gothic-muted font-serif text-xs px-2.5 py-1.5 hover:border-gothic-gold hover:text-gothic-gold transition-all duration-200 ml-auto"
            title="設定"
          >
            ⚙
          </button>
        </div>

        {showSaveModal && (
          <SettingsModal showSave={showSave} onClose={() => setShowSaveModal(false)} />
        )}
      </div>
    </div>
  )
}
