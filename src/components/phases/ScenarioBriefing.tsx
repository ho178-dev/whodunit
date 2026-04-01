// シナリオ概要の表示と難易度選択を行うブリーフィング画面
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { TutorialOverlay } from './TutorialOverlay'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'
import { resolveMansionAsset } from '../../services/assetResolver'
import type { Difficulty } from '../../types/game'

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
    <div className="relative h-full">
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      {/* 館画像を全画面背景として表示 */}
      <MansionSceneBackground
        phase="scenario_briefing"
        fixed={true}
        mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
      />

      {/* コンテンツオーバーレイ */}
      <div className="relative z-10 h-full flex flex-col px-6 py-3 game-md:px-8 game-md:py-5 game-lg:px-10 game-lg:py-6">
        {/* タイトル・あらすじ */}
        <div className="text-center mb-3 game-md:mb-4 flex-shrink-0">
          <h1 className="font-display text-xl game-md:text-3xl game-lg:text-4xl text-gothic-gold tracking-widest drop-shadow-lg mb-1 game-md:mb-2">
            {scenario.title}
          </h1>
          <p className="text-gothic-muted font-serif text-xs game-md:text-sm max-w-xl mx-auto leading-relaxed line-clamp-2">
            {scenario.synopsis}
          </p>
        </div>

        {/* 事件概要・難易度 2列グリッド */}
        <div className="grid grid-cols-2 gap-3 game-md:gap-4 flex-1 min-h-0 mb-3 game-md:mb-4">
          {/* 事件概要 */}
          <div className="border border-gothic-border bg-gothic-panel/80 backdrop-blur-sm flex flex-col">
            <div className="border-b border-gothic-border px-3 py-1.5 game-md:px-4 game-md:py-2 flex-shrink-0">
              <h2 className="font-display text-gothic-gold text-base game-md:text-lg tracking-widest">
                事件概要
              </h2>
            </div>
            <div className="p-3 game-md:p-4 flex flex-col gap-2 game-md:gap-3 text-sm font-serif">
              <div>
                <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">舞台</p>
                <p className="text-gothic-text text-xs game-md:text-sm">{scenario.setting}</p>
              </div>
              <div>
                <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">被害者</p>
                <p className="text-gothic-text text-xs game-md:text-sm">{scenario.victim.name}</p>
                <p className="text-gothic-muted text-xs mt-1">{scenario.victim.cause_of_death}</p>
                <p className="text-gothic-gold text-xs mt-1">
                  推定犯行時刻：{scenario.murder_time_range}
                </p>
              </div>
            </div>
          </div>

          {/* 難易度選択 */}
          <div className="border border-gothic-border bg-gothic-panel/80 backdrop-blur-sm flex flex-col">
            <div className="border-b border-gothic-border px-3 py-1.5 game-md:px-4 game-md:py-2 flex-shrink-0">
              <h2 className="font-display text-gothic-gold text-base game-md:text-lg tracking-widest">
                難易度
              </h2>
            </div>
            <div className="p-3 game-md:p-4 flex flex-col gap-2 flex-1">
              {difficultyKeys.map((key) => {
                const cfg = DIFFICULTY_CONFIG[key]
                const isSelected = selectedDifficulty === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`border p-2 game-md:p-3 text-left transition-all flex-1 ${
                      isSelected
                        ? 'border-gothic-gold bg-stone-800/80'
                        : 'border-gothic-border hover:border-gothic-accent'
                    }`}
                  >
                    <p
                      className={`font-display tracking-widest text-xs game-md:text-sm mb-0.5 game-md:mb-1 ${isSelected ? 'text-gothic-gold' : 'text-gothic-text'}`}
                    >
                      {cfg.label}
                    </p>
                    <p className="text-gothic-muted font-serif text-xs leading-relaxed mb-1">
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
          </div>
        </div>

        {/* ボタン */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowTutorial(true)}
            className="border border-gothic-border text-gothic-muted font-serif text-xs py-1.5 game-md:py-2 px-6 game-md:px-8 hover:border-gothic-accent hover:text-gothic-text transition-all"
          >
            ？ 遊び方を見る
          </button>
          <button
            onClick={handleStart}
            className="border border-gothic-gold bg-gothic-panel/80 hover:bg-stone-800 text-gothic-gold font-display tracking-widest text-xs game-md:text-sm py-3 game-md:py-4 px-10 game-md:px-12 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            捜査を開始する
          </button>
        </div>
      </div>
    </div>
  )
}
