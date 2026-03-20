// 議論フェーズで容疑者を選んで証拠を突きつけ、リアクションを表示するコンポーネント
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { CharacterCard } from '../shared/CharacterCard'
import { ReactionDisplay } from './ReactionDisplay'

interface NpcConfrontationProps {
  selectedEvidenceId: string | null
  selectedSuspectId: string | null
  onSelectSuspect: (id: string) => void
}

// 容疑者選択と証拠突きつけ操作、リアクション表示を担うコンポーネント
export function NpcConfrontation({
  selectedEvidenceId,
  selectedSuspectId,
  onSelectSuspect,
}: NpcConfrontationProps) {
  const { scenario, addConfrontation, confrontationLog } = useGameStore()
  if (!scenario) return null

  const selectedEvidence = selectedEvidenceId
    ? scenario.evidence.find((e) => e.id === selectedEvidenceId)
    : null
  const selectedSuspect = selectedSuspectId
    ? scenario.suspects.find((s) => s.id === selectedSuspectId)
    : null

  const latestReaction =
    selectedSuspectId && selectedEvidenceId
      ? confrontationLog
          .filter((c) => c.suspectId === selectedSuspectId && c.evidenceId === selectedEvidenceId)
          .slice(-1)[0]
      : null

  // 選択中の容疑者に証拠を突きつけてリアクションを対話ログへ追加する
  const handleConfront = () => {
    if (!selectedSuspect || !selectedEvidence) return
    const reaction = selectedSuspect.evidence_reactions[selectedEvidence.id]
    if (reaction) {
      addConfrontation({
        suspectId: selectedSuspect.id,
        evidenceId: selectedEvidence.id,
        reaction: reaction.reaction,
        behavior: reaction.behavior,
      })
    }
  }

  return (
    <GothicPanel title="証拠を突きつける">
      <div className="space-y-4">
        <div>
          <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-2">
            容疑者を選択
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {scenario.suspects.map((suspect) => (
              <button
                key={suspect.id}
                onClick={() => onSelectSuspect(suspect.id)}
                className="text-left"
              >
                <CharacterCard
                  suspect={suspect}
                  small
                  selected={suspect.id === selectedSuspectId}
                />
              </button>
            ))}
          </div>
        </div>

        {selectedSuspect && selectedEvidence && (
          <div>
            <p className="text-gothic-muted font-serif text-sm mb-3">
              <span className="text-gothic-text">{selectedSuspect.name}</span>に
              <span className="text-gothic-gold">「{selectedEvidence.name}」</span>を突きつける
            </p>
            <button
              onClick={handleConfront}
              className="w-full border border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text font-display tracking-widest py-3 transition-all text-sm"
            >
              突きつける
            </button>
          </div>
        )}

        {latestReaction && (
          <ReactionDisplay
            reaction={latestReaction.reaction}
            behavior={latestReaction.behavior}
            suspectName={selectedSuspect?.name ?? ''}
          />
        )}
      </div>
    </GothicPanel>
  )
}
