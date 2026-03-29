// シナリオ概要の表示と難易度選択を行うブリーフィング画面
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { TutorialOverlay } from './TutorialOverlay'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'
import { resolveMansionAsset, MANSION_DEFAULT_ASSET } from '../../services/assetResolver'
import type { Difficulty } from '../../types/game'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'

// シナリオ概要・難易度選択を表示し、捜査フェーズ開始を制御するコンポーネント
export function ScenarioBriefing() {
  const { scenario, setPhase, setDifficulty, difficulty } = useGameStore()
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(difficulty)
  const [showTutorial, setShowTutorial] = useState(false)

  if (!scenario) return null

  // 選択した難易度をストアに保存して捜査フェーズへ遷移する
  const handleStart = () => {
    setDifficulty(selectedDifficulty)
    setPhase('investigation')
  }

  const difficultyKeys: Difficulty[] = ['easy', 'normal', 'hard']

  return (
    <div className="h-full overflow-y-auto px-4 py-8">
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      <div className="max-w-4xl mx-auto">
        {/* 館背景ヘッダー */}
        <div className="relative mb-8 overflow-hidden" style={{ height: '220px' }}>
          <PixelImageWithFallback
            src={resolveMansionAsset(scenario.mansion_background_id)}
            alt={scenario.title}
            pixelSize={PIXEL_ART_CONFIG.pixelSize.mansion}
            canvasWidth={PIXEL_ART_CONFIG.canvasSize.mansion.width}
            canvasHeight={PIXEL_ART_CONFIG.canvasSize.mansion.height}
            fallbackSrc={MANSION_DEFAULT_ASSET}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-gothic-bg" />
          <div className="absolute bottom-0 inset-x-0 text-center pb-4">
            <h1 className="font-display text-3xl text-gothic-gold tracking-widest drop-shadow-lg mb-1">
              {scenario.title}
            </h1>
            <p className="text-gothic-muted font-serif text-sm max-w-xl mx-auto leading-relaxed px-4">
              {scenario.synopsis}
            </p>
          </div>
        </div>

        {/* 事件概要 */}
        <GothicPanel title="事件概要" className="mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm font-serif">
            <div>
              <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">舞台</p>
              <p className="text-gothic-text">{scenario.setting}</p>
            </div>
            <div>
              <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">被害者</p>
              <p className="text-gothic-text">{scenario.victim.name}</p>
              <p className="text-gothic-muted text-xs mt-1">{scenario.victim.cause_of_death}</p>
              <p className="text-gothic-gold text-xs mt-1">
                推定犯行時刻：{scenario.murder_time_range}
              </p>
            </div>
          </div>
        </GothicPanel>

        {/* 難易度選択 */}
        <GothicPanel title="難易度" className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            {difficultyKeys.map((key) => {
              const cfg = DIFFICULTY_CONFIG[key]
              const isSelected = selectedDifficulty === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDifficulty(key)}
                  className={`border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-gothic-gold bg-stone-800'
                      : 'border-gothic-border hover:border-gothic-accent'
                  }`}
                >
                  <p
                    className={`font-display tracking-widest text-sm mb-1 ${isSelected ? 'text-gothic-gold' : 'text-gothic-text'}`}
                  >
                    {cfg.label}
                  </p>
                  <p className="text-gothic-muted font-serif text-xs leading-relaxed mb-2">
                    {cfg.description}
                  </p>
                  <div className="space-y-0.5">
                    <p className="text-gothic-muted font-serif text-xs">
                      調査{' '}
                      <span className={isSelected ? 'text-gothic-gold' : 'text-gothic-text'}>
                        {cfg.actions}
                      </span>{' '}
                      回
                    </p>
                    <p className="text-gothic-muted font-serif text-xs">
                      会話{' '}
                      <span className={isSelected ? 'text-gothic-gold' : 'text-gothic-text'}>
                        {cfg.talkActions}
                      </span>{' '}
                      回
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </GothicPanel>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setShowTutorial(true)}
            className="border border-gothic-border text-gothic-muted font-serif text-sm py-2 px-8 hover:border-gothic-accent hover:text-gothic-text transition-all"
          >
            ？ 遊び方を見る
          </button>
          <button
            onClick={handleStart}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-12 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            捜査を開始する
          </button>
        </div>
      </div>
    </div>
  )
}
