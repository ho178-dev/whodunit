// ゲームフェーズに応じた画面切り替えを行うルートレイアウトコンポーネント
// 960×540を基準サイズとしてCSSスケールでウィンドウ全体に引き伸ばす
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { audioManager } from '../../services/audioManager'
import { PHASE_BGM, ACCUSATION_BGM, ENDING_BGM } from '../../services/audioConfig'
import { FadeTransition } from '../shared/FadeTransition'
import { PHASE_LABELS } from '../../constants/phaseConfig'
import { isTrialMode, isDevBuild } from '../../constants/salesConfig'
import { GAME_BASE_WIDTH, GAME_BASE_HEIGHT } from '../../constants/gameConfig'
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
import { TutorialPhase } from '../phases/TutorialPhase'
import { SettingsModal } from '../shared/SettingsModal'
import type { GamePhase } from '../../types/game'

const IS_DEV = isDevBuild()

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
  voting: '告発',
  accusation: '断罪',
}

// ゲームのルートレイアウト。フェーズに応じた画面を切り替えてレンダリングする
export function GameShell() {
  const phase = useGameStore((s) => s.phase)
  const useFixedScenario = useGameStore((s) => s.useFixedScenario)
  const murdererId = useGameStore((s) => s.scenario?.murderer_id)
  const votedSuspectId = useGameStore((s) => s.votedSuspectId)
  const murdererEscaped = useGameStore((s) => s.murdererEscaped)
  const setPhase = useGameStore((s) => s.setPhase)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [scale, setScale] = useState(1)

  // ウィンドウサイズに合わせてスケール係数を更新する
  useEffect(() => {
    const update = () => {
      const next = Math.min(
        window.innerWidth / GAME_BASE_WIDTH,
        window.innerHeight / GAME_BASE_HEIGHT
      )
      setScale((prev) => (prev === next ? prev : next))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ゲームコンテナ内の全 button クリックで click SE を再生するグローバルリスナー
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest('button')
      if (button && !button.hasAttribute('data-no-click-se')) {
        audioManager.playSe('click')
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // フェーズ変更時に対応 BGM を再生する
  useEffect(() => {
    const isCorrect = votedSuspectId != null && votedSuspectId === murdererId
    let path: string | undefined
    if (phase === 'accusation') {
      path = isCorrect ? ACCUSATION_BGM.correct : ACCUSATION_BGM.wrong
    } else if (phase === 'ending') {
      // 惜敗（証拠不足逃亡）も不正解BGMを使用する
      path = isCorrect && !murdererEscaped ? ENDING_BGM.correct : ENDING_BGM.wrong
    } else {
      path = PHASE_BGM[phase]
    }
    if (path) audioManager.playBgm(path)
  }, [phase, murdererId, votedSuspectId, murdererEscaped])

  const showSave = useFixedScenario && MANUAL_SAVE_PHASES.has(phase)
  const unlockAllForDebug = useGameStore((s) => s.unlockAllForDebug)
  const refillAllAP = useGameStore((s) => s.refillAllAP)

  // 現在のフェーズに対応するコンポーネントを返す
  const renderPhase = () => {
    switch (phase) {
      case 'title':
        return <TitleScreen />
      case 'tutorial':
        return <TutorialPhase />
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
    // 外層: ウィンドウ全体を覆い、960×540コンテナをスケールして中央配置する
    <div className="w-screen h-screen bg-gothic-bg flex items-center justify-center overflow-hidden relative">
      {/* 960×540 固定コンテナ: transform: scale でウィンドウサイズに合わせて拡縮する */}
      <div
        className="relative overflow-hidden border border-gothic-border"
        style={{
          width: GAME_BASE_WIDTH,
          height: GAME_BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {showSaveModal ? (
          <SettingsModal showSave={showSave} onClose={() => setShowSaveModal(false)} />
        ) : (
          <>
            <FadeTransition triggerKey={phase} phaseLabel={PHASE_LABELS[phase]}>
              {renderPhase()}
            </FadeTransition>

            {/* 右上ヘッダー: フェーズ名バッジ（左）＋設定ボタン（右）。RightPanel幅と一致させる */}
            <div className="absolute top-2 right-2 z-40 flex gap-1 w-[140px]">
              {/* フェーズ名バッジ（フェーズ名がある場合のみ表示） */}
              {PHASE_BADGE_TEXT[phase] && (
                <div className="flex-1 bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-3 py-1.5 text-center">
                  <p className="font-display text-gothic-gold text-xs tracking-widest">
                    {PHASE_BADGE_TEXT[phase]}
                  </p>
                </div>
              )}
              {/* タイトル画面のみシナリオ生成ボタンを表示（体験版では非表示） */}
              {phase === 'title' && !isTrialMode() && (
                <button
                  onClick={() => setPhase('api_key_input')}
                  className="game-button flex-1 border border-gothic-gold/60 bg-gothic-panel text-gothic-gold font-serif text-xs px-2 py-1.5 hover:border-gothic-gold hover:bg-stone-900 transition-all duration-200"
                >
                  AI生成
                </button>
              )}
              {/* 設定ボタン: 全フェーズで表示（セーブ可否はSettingsModal内で制御） */}
              <button
                onClick={() => setShowSaveModal(true)}
                className="game-button border border-gothic-border bg-gothic-panel text-gothic-muted font-serif text-xs px-2.5 py-1.5 hover:border-gothic-gold hover:text-gothic-gold transition-all duration-200 ml-auto"
                title="設定"
              >
                ⚙
              </button>
            </div>

            {/* [dev] デバッグパネル: dev ビルドのみ左下に表示 */}
            {IS_DEV && (
              <div className="absolute bottom-2 left-2 z-40 flex flex-col gap-1">
                <button
                  onClick={unlockAllForDebug}
                  className="border border-purple-700 bg-purple-950/80 text-purple-300 font-display text-[9px] tracking-widest px-2 py-1 hover:bg-purple-900/80 transition-colors"
                >
                  [DEV] 全開放
                </button>
                <button
                  onClick={refillAllAP}
                  className="border border-purple-700 bg-purple-950/80 text-purple-300 font-display text-[9px] tracking-widest px-2 py-1 hover:bg-purple-900/80 transition-colors"
                >
                  [DEV] AP補充
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
