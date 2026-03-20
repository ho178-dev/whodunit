import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'

export function EndingScreen() {
  const { scenario, votedSuspectId, setPhase, resetGame } = useGameStore()

  if (!scenario || !votedSuspectId) return null

  const isCorrect = votedSuspectId === scenario.murderer_id
  const murderer = scenario.suspects.find((s) => s.id === scenario.murderer_id)!
  const voted = scenario.suspects.find((s) => s.id === votedSuspectId)!

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {isCorrect ? (
            <>
              <div className="text-gothic-gold font-display text-5xl mb-4">真実</div>
              <h1 className="font-display text-2xl text-gothic-gold tracking-widest">謎は解けた</h1>
            </>
          ) : (
            <>
              <div className="text-red-400 font-display text-5xl mb-4">誤謬</div>
              <h1 className="font-display text-2xl text-red-400 tracking-widest">真犯人を見逃した</h1>
            </>
          )}
        </div>

        {!isCorrect && (
          <GothicPanel className="mb-4 border-red-900">
            <p className="text-gothic-muted font-serif text-sm">
              あなたが告発したのは <span className="text-gothic-text">{voted.name}</span> でしたが…
            </p>
          </GothicPanel>
        )}

        <GothicPanel title="真相" className="mb-6">
          <div className="space-y-4">
            <div>
              <span className="text-gothic-gold font-display text-sm tracking-widest">真犯人</span>
              <p className="text-gothic-text font-serif mt-1 text-lg">{murderer.name}</p>
            </div>
            <div>
              <span className="text-gothic-gold font-display text-sm tracking-widest">動機</span>
              <p className="text-gothic-text font-serif mt-1">{scenario.motive}</p>
            </div>
            <div>
              <span className="text-gothic-gold font-display text-sm tracking-widest">真相</span>
              <p className="text-gothic-text font-serif mt-1 leading-relaxed">{scenario.truth}</p>
            </div>
          </div>
        </GothicPanel>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => resetGame()}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 transition-all"
          >
            同じシナリオでリトライ
          </button>
          <button
            onClick={() => setPhase('title')}
            className="border border-gothic-border text-gothic-muted font-serif py-3 hover:border-gothic-accent transition-all"
          >
            タイトルへ戻る
          </button>
        </div>
      </div>
    </div>
  )
}
