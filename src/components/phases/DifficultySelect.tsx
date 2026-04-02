// 難易度選択フェーズ。難易度を選んで捜査を開始する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { TutorialOverlay } from './TutorialOverlay'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'
import { resolveMansionAsset } from '../../services/assetResolver'
import type { Difficulty } from '../../types/game'

// 難易度選択UIを表示し、捜査フェーズへの遷移を制御するコンポーネント
export function DifficultySelect() {
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
    <div className="relative h-full">
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      <MansionSceneBackground
        phase="difficulty_select"
        fixed={true}
        mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
      />

      <div className="relative z-10 h-full flex flex-col px-6 py-4 game-md:px-10 game-md:py-6 game-lg:px-14 game-lg:py-8">
        {/* 見出し */}
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="font-display text-xl game-md:text-2xl game-lg:text-3xl text-gothic-gold tracking-widest drop-shadow-lg">
            難易度を選んでください
          </h2>
        </div>

        {/* 難易度カード（3列） */}
        <div className="grid grid-cols-3 gap-3 game-md:gap-4 max-h-64 game-md:max-h-80 game-lg:max-h-96 mb-4">
          {difficultyKeys.map((key) => {
            const cfg = DIFFICULTY_CONFIG[key]
            const isSelected = selectedDifficulty === key
            return (
              <button
                key={key}
                onClick={() => setSelectedDifficulty(key)}
                className={`border flex flex-col p-3 game-md:p-4 text-left transition-all ${
                  isSelected
                    ? 'border-gothic-gold bg-stone-800/80'
                    : 'border-gothic-border bg-gothic-panel/80 backdrop-blur-sm hover:border-gothic-accent'
                }`}
              >
                <p
                  className={`font-display tracking-widest text-xs game-md:text-sm mb-1.5 ${
                    isSelected ? 'text-gothic-gold' : 'text-gothic-text'
                  }`}
                >
                  {cfg.label}
                </p>
                <p className="text-gothic-muted font-serif text-xs leading-relaxed mb-2 flex-1">
                  {cfg.description}
                </p>
                <div className="flex gap-3">
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

        {/* ボタン行 */}
        <div className="flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setPhase('scenario_briefing')}
            className="border border-gothic-border text-gothic-muted font-serif text-xs py-2 px-6 hover:border-gothic-accent hover:text-gothic-text transition-all"
          >
            ← 戻る
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTutorial(true)}
              className="border border-gothic-border text-gothic-muted font-serif text-xs py-2 px-6 hover:border-gothic-accent hover:text-gothic-text transition-all"
            >
              ？ 遊び方
            </button>
            <button
              onClick={handleStart}
              className="border border-gothic-gold bg-gothic-panel/80 hover:bg-stone-800 text-gothic-gold font-display tracking-widest text-xs game-md:text-sm py-3 px-10 game-md:px-12 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
            >
              捜査を開始する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
