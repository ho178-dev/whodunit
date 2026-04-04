// 体験版エンディング後の予告画面。シナリオ2・3の雰囲気を提示しBooth購入を案内するコンポーネント
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { GothicPanel } from '../layout/GothicPanel'
import { BOOTH_URL, TRIAL_PREVIEW_SCENARIOS } from '../../constants/salesConfig'

export function TrialPreview() {
  const setPhase = useGameStore((s) => s.setPhase)

  return (
    <div className="h-full relative">
      <MansionSceneBackground phase="ending" fixed />
      <div className="relative z-10 h-full overflow-y-auto game-scrollbar px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gothic-muted font-serif text-xs tracking-widest mb-4">
              ― 体験版をプレイいただきありがとうございます ―
            </p>
            <h1 className="font-display text-3xl text-gothic-gold tracking-widest">
              次なる謎が待っている
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            {TRIAL_PREVIEW_SCENARIOS.map(({ title, setting, teaser }) => (
              <GothicPanel key={title}>
                <p className="text-gothic-gold font-display text-lg tracking-widest mb-2">
                  {title}
                </p>
                <p className="text-gothic-muted font-serif text-sm leading-relaxed mb-2">
                  ── {setting}
                </p>
                <p className="text-gothic-text font-serif text-sm italic">{teaser}</p>
              </GothicPanel>
            ))}
          </div>

          <div className="text-center mb-6">
            <p className="text-gothic-muted font-serif text-xs mb-4">
              上記2シナリオを含む全3本が
              <span className="text-gothic-gold">有料版</span>
              で遊べます
            </p>
            <a
              href={BOOTH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gothic-gold bg-gothic-gold/10 hover:bg-gothic-gold/20 text-gothic-gold font-display tracking-widest py-4 px-12 transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]"
            >
              Boothで購入する →
            </a>
          </div>

          <button
            onClick={() => setPhase('title')}
            className="w-full border border-gothic-border text-gothic-muted font-serif text-xs py-3 hover:border-gothic-accent transition-all"
          >
            タイトルへ戻る
          </button>
        </div>
      </div>
    </div>
  )
}
