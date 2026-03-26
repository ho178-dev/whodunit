// シナリオ選択画面。固定シナリオ一覧を表示し、クリア済み・プレイ済みバッジとベストスコアを表示する
// VITE_TRIAL_MODE=true のとき1本のみ表示する
import { useGameStore } from '../../stores/gameStore'
import { FIXED_SCENARIO } from '../../constants/fixedScenario'
import { FIXED_SCENARIO_2 } from '../../constants/fixedScenario2'
import { FIXED_SCENARIO_3 } from '../../constants/fixedScenario3'
import { loadScoreData } from '../../utils/score'
import type { Difficulty } from '../../types/game'
import type { Scenario } from '../../types/scenario'

// 固定シナリオ一覧の定義
const ALL_SCENARIOS: { scenario: Scenario; subtitle: string }[] = [
  { scenario: FIXED_SCENARIO, subtitle: '毒殺・孤島の洋館' },
  { scenario: FIXED_SCENARIO_2, subtitle: '絞殺・密室の山荘' },
  { scenario: FIXED_SCENARIO_3, subtitle: '刺殺・人狼の月夜' },
]

// トライアルモードでは1本のみ表示する
const DISPLAYED_SCENARIOS =
  import.meta.env.VITE_TRIAL_MODE === 'true' ? ALL_SCENARIOS.slice(0, 1) : ALL_SCENARIOS

// シナリオ選択画面。各シナリオのクリア状況とベストスコアを表示する
export function ScenarioSelect() {
  const { setPhase, setScenario, setUseFixedScenario, setActiveSaveSlot } = useGameStore()

  // シナリオカードをクリックしたときの処理。常にオートセーブスロット（0番）を使用する
  const handleScenarioClick = (scenario: Scenario) => {
    setActiveSaveSlot(0)
    setScenario(scenario)
    setUseFixedScenario(true)
    setPhase('scenario_briefing')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-gothic-muted font-serif text-xs tracking-widest">
            ― シナリオを選択してください ―
          </p>
        </div>

        <div className="space-y-3">
          {DISPLAYED_SCENARIOS.map(({ scenario, subtitle }) => {
            const scoreData = loadScoreData(scenario.title)
            const difficulties: Difficulty[] = ['easy', 'normal', 'hard']
            const isCleared = difficulties.some((d) => scoreData[d]?.cleared)
            const isPlayed = difficulties.some((d) => scoreData[d]?.played)
            const normalScore = scoreData['normal']

            return (
              <button
                key={scenario.title}
                onClick={() => handleScenarioClick(scenario)}
                className="w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-6 transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="block">{scenario.title}</span>
                    <span className="block text-xs text-gothic-muted mt-1 font-serif">
                      {subtitle}
                    </span>
                  </div>
                  {/* クリア/プレイ済みバッジ */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isCleared && (
                      <span className="text-gothic-gold font-serif text-xs border border-gothic-gold/50 px-2 py-0.5">
                        CLEARED
                      </span>
                    )}
                    {!isCleared && isPlayed && (
                      <span className="text-gothic-muted font-serif text-xs border border-gothic-border px-2 py-0.5">
                        PLAYED
                      </span>
                    )}
                  </div>
                </div>
                {/* ベストスコア（normal難易度クリア済みの場合のみ表示） */}
                {normalScore?.bestActions !== undefined && (
                  <div className="mt-2 border-t border-gothic-border/30 pt-2">
                    <span className="text-gothic-muted font-serif text-xs">
                      ベスト（normal）：調査 {normalScore.bestActions} / 聞込{' '}
                      {normalScore.bestTalkActions ?? '―'}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setPhase('title')}
          className="w-full mt-4 border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 px-8 transition-all duration-200 hover:border-gothic-accent"
        >
          戻る
        </button>
      </div>
    </div>
  )
}
