import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { CharacterCard } from '../shared/CharacterCard'

export function VotingPhase() {
  const { scenario, setVotedSuspectId, setPhase } = useGameStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  if (!scenario) return null

  const handleVote = () => {
    if (selected) {
      setVotedSuspectId(selected)
      setPhase('ending')
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gothic-gold tracking-widest mb-2">最終投票</h1>
          <p className="text-gothic-muted font-serif">犯人と思われる人物を選んでください</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {scenario.suspects.map((suspect) => (
            <CharacterCard
              key={suspect.id}
              suspect={suspect}
              selected={suspect.id === selected}
              onClick={() => setSelected(suspect.id)}
            />
          ))}
        </div>

        {selected && !confirming && (
          <div className="flex justify-center">
            <button
              onClick={() => setConfirming(true)}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-12 transition-all"
            >
              この人物を犯人として告発する
            </button>
          </div>
        )}

        {confirming && (
          <GothicPanel className="max-w-md mx-auto text-center">
            <p className="text-gothic-text font-serif mb-6">
              本当に
              <span className="text-gothic-gold font-semibold">
                {scenario.suspects.find((s) => s.id === selected)?.name}
              </span>
              を犯人として告発しますか？
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleVote}
                className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-wider py-3 px-8 transition-all"
              >
                告発する
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="border border-gothic-border text-gothic-muted font-serif py-3 px-8 hover:border-gothic-accent transition-all"
              >
                考え直す
              </button>
            </div>
          </GothicPanel>
        )}
      </div>
    </div>
  )
}
