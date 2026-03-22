// ゲームのタイトル画面。固定シナリオかAI生成シナリオかを選択する起点
import { useGameStore } from '../../stores/gameStore'
import { FIXED_SCENARIO } from '../../constants/fixedScenario'

// タイトル画面を表示し、固定シナリオかAI生成シナリオかの起動経路を分岐するコンポーネント
export function TitleScreen() {
  const { setPhase, setScenario, setUseFixedScenario } = useGameStore()

  // 固定シナリオをセットしてシナリオブリーフィングへ遷移する
  const startFixed = () => {
    setScenario(FIXED_SCENARIO)
    setUseFixedScenario(true)
    setPhase('scenario_briefing')
  }

  // APIキー入力フェーズへ遷移してAI生成シナリオを開始する
  const startWithApi = () => {
    setPhase('api_key_input')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.15)_0%,_transparent_70%)]" />

      <div className="relative z-10 text-center max-w-2xl">
        {/* ロゴ */}
        <div className="mb-2">
          <div className="inline-block border border-gothic-gold/50 px-8 py-1">
            <span className="font-display text-gothic-muted text-xs tracking-[0.5em]">
              MURDER MYSTERY
            </span>
          </div>
        </div>

        <h1 className="font-title text-5xl md:text-7xl text-gothic-gold mb-2 tracking-wider">
          WhoDuNiT
        </h1>

        <div className="border-t border-b border-gothic-border/50 py-4 mb-8">
          <p className="text-gothic-muted font-serif text-sm tracking-widest">
            ― 犯人は、この中にいる ―
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={startFixed}
            className="w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-8 transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            黄昏の晩餐会
            <span className="block text-xs text-gothic-muted mt-1 font-serif">固定シナリオ</span>
          </button>

          <button
            onClick={startWithApi}
            className="w-full border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted font-display tracking-widest py-3 px-8 transition-all duration-200 text-sm"
          >
            AIでシナリオ生成
            <span className="block text-xs mt-1 font-serif">Gemini APIキーが必要</span>
          </button>
        </div>

        <p className="mt-8 text-gothic-muted text-xs font-serif">一人用マーダーミステリー</p>
      </div>
    </div>
  )
}
