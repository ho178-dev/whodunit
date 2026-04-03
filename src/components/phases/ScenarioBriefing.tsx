// シナリオ概要を表示するブリーフィング画面
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { resolveMansionAsset } from '../../services/assetResolver'

// 事件概要（タイトル・あらすじ・舞台・被害者）を表示し、難易度選択フェーズへ誘導するコンポーネント
export function ScenarioBriefing() {
  const { scenario, setPhase } = useGameStore()
  if (!scenario) return null

  return (
    <div className="relative h-full">
      <MansionSceneBackground
        phase="scenario_briefing"
        fixed={true}
        mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
      />

      <div className="relative z-10 h-full flex flex-col px-6 py-4 game-md:px-10 game-md:py-6 game-lg:px-14 game-lg:py-8">
        {/* タイトル・あらすじ */}
        <div className="text-center mb-4 flex-shrink-0">
          <h1 className="font-display text-2xl game-md:text-3xl game-lg:text-4xl text-gothic-gold tracking-widest drop-shadow-lg mb-2">
            {scenario.title}
          </h1>
          <p className="text-gothic-muted font-serif text-xs game-md:text-sm max-w-2xl mx-auto leading-relaxed">
            {scenario.synopsis}
          </p>
        </div>

        {/* 事件概要パネル */}
        <div className="flex-1 min-h-0 mb-4 border border-gothic-border bg-gothic-panel/80 backdrop-blur-sm flex flex-col">
          <div className="border-b border-gothic-border px-4 py-2 game-md:px-6 game-md:py-3 flex-shrink-0">
            <h2 className="font-display text-gothic-gold text-base game-md:text-lg tracking-widest">
              事件概要
            </h2>
          </div>
          <div className="p-4 game-md:p-6 flex flex-col gap-4 game-md:gap-6 font-serif overflow-y-auto game-scrollbar">
            <div>
              <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">舞台</p>
              <p className="text-gothic-text text-sm game-md:text-base">{scenario.setting}</p>
            </div>
            <div>
              <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">被害者</p>
              <p className="text-gothic-text text-sm game-md:text-base">{scenario.victim.name}</p>
              <p className="text-gothic-muted text-xs game-md:text-sm mt-1">
                {scenario.victim.cause_of_death}
              </p>
              <p className="text-gothic-gold text-xs game-md:text-sm mt-1">
                推定犯行時刻：{scenario.murder_time_range}
              </p>
            </div>
          </div>
        </div>

        {/* ボタン行 */}
        <div className="flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setPhase('scenario_select')}
            className="border border-gothic-border text-gothic-muted font-serif text-xs py-2 px-6 hover:border-gothic-accent hover:text-gothic-text transition-all"
          >
            ← 戻る
          </button>
          <button
            onClick={() => setPhase('investigation')}
            className="border border-gothic-gold bg-gothic-panel/80 hover:bg-stone-800 text-gothic-gold font-display tracking-widest text-xs game-md:text-sm py-3 px-10 game-md:px-12 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            捜査を開始する →
          </button>
        </div>
      </div>
    </div>
  )
}
