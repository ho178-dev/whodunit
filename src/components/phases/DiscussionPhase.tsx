// 議論フェーズの画面。証拠選択と容疑者への証拠突きつけを管理する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { NpcConfrontation } from '../discussion/NpcConfrontation'
import { EvidenceSelector } from '../discussion/EvidenceSelector'
import { InvestigationNotes } from '../investigation/InvestigationNotes'

export function DiscussionPhase() {
  const {
    scenario,
    setPhase,
    inspectedEvidenceIds,
    pendingPursuitActivation,
    selectTestimonyForPursuit,
    clearPursuitActivation,
  } = useGameStore()
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)
  const [showNotesManual, setShowNotesManual] = useState(false)

  // pendingPursuitActivation があれば操作メモを強制表示する
  const showNotes = showNotesManual || pendingPursuitActivation !== null

  if (!scenario) return null

  const handleNotesClose = () => {
    setShowNotesManual(false)
    clearPursuitActivation()
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-gothic-gold tracking-widest">議論フェーズ</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotesManual(true)}
              className="border border-stone-600 bg-gothic-panel hover:bg-stone-800 text-stone-400 font-display tracking-[0.1em] py-2 px-4 transition-all text-sm"
            >
              📋 捜査メモを開く
            </button>
            <button
              onClick={() => setPhase('voting')}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-[0.1em] py-2 px-6 transition-all text-sm"
            >
              投票へ進む
            </button>
          </div>
        </div>

        {showNotes && (
          <InvestigationNotes
            onClose={handleNotesClose}
            pursuitMode={
              pendingPursuitActivation
                ? {
                    suspectId: pendingPursuitActivation.suspectId,
                    onSelect: (suspectId, statementIndex) => {
                      selectTestimonyForPursuit(suspectId, statementIndex)
                      setShowNotesManual(false)
                    },
                    onCancel: handleNotesClose,
                  }
                : undefined
            }
          />
        )}

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
