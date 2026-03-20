import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { CharacterCard } from '../shared/CharacterCard'

export function CharacterSelect() {
  const { scenario, selectedSuspectId, setSelectedSuspectId, setPhase } = useGameStore()

  if (!scenario) return null

  const selected = scenario.suspects.find((s) => s.id === selectedSuspectId)

  const handleStart = () => {
    if (selectedSuspectId) {
      setPhase('investigation')
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gothic-gold tracking-widest mb-2">{scenario.title}</h1>
          <p className="text-gothic-muted font-serif text-sm max-w-2xl mx-auto">{scenario.synopsis}</p>
        </div>

        <GothicPanel title="調査役を選択" className="mb-6">
          <p className="text-gothic-muted font-serif text-sm mb-6">
            あなたが操作する探偵役を選んでください。選んだキャラクターの視点で事件を調査します。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {scenario.suspects.map((suspect) => (
              <CharacterCard
                key={suspect.id}
                suspect={suspect}
                selected={suspect.id === selectedSuspectId}
                onClick={() => setSelectedSuspectId(suspect.id)}
              />
            ))}
          </div>
        </GothicPanel>

        {selected && (
          <GothicPanel className="mb-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="font-display text-gothic-gold text-xl mb-1">{selected.name}</div>
                <div className="text-gothic-muted text-sm mb-3">{selected.age}歳・{selected.occupation}</div>
                <p className="text-gothic-text font-serif text-sm mb-2">{selected.description}</p>
                <p className="text-gothic-muted font-serif text-sm">
                  <span className="text-gothic-gold">アリバイ：</span>{selected.alibi}
                </p>
              </div>
            </div>
          </GothicPanel>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!selectedSuspectId}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 disabled:opacity-40 text-gothic-gold font-display tracking-widest py-4 px-12 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            捜査を開始する
          </button>
        </div>
      </div>
    </div>
  )
}
