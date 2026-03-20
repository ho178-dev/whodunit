// 議論フェーズの画面。証拠選択と容疑者への証拠突きつけを管理する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { NpcConfrontation } from '../discussion/NpcConfrontation'
import { EvidenceSelector } from '../discussion/EvidenceSelector'

export function DiscussionPhase() {
  const { scenario, setPhase, inspectedEvidenceIds } = useGameStore()
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)

  if (!scenario) return null

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-gothic-gold tracking-widest">議論フェーズ</h1>
          <button
            onClick={() => setPhase('voting')}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-[0.1em] py-2 px-6 transition-all text-sm"
          >
            投票へ進む
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <EvidenceSelector
              discoveredIds={inspectedEvidenceIds}
              selectedId={selectedEvidenceId}
              onSelect={setSelectedEvidenceId}
            />
          </div>
          <div>
            <NpcConfrontation
              selectedEvidenceId={selectedEvidenceId}
              selectedSuspectId={selectedSuspectId}
              onSelectSuspect={setSelectedSuspectId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
