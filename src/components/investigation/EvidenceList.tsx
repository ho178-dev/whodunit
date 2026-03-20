import { useGameStore } from '../../stores/gameStore'
import { EvidenceCard } from '../shared/EvidenceCard'

interface EvidenceListProps {
  roomId: string
}

export function EvidenceList({ roomId }: EvidenceListProps) {
  const { scenario, discoveredEvidenceIds, discoverEvidence, consumeAction, actionsRemaining } = useGameStore()
  if (!scenario) return null

  const room = scenario.rooms.find((r) => r.id === roomId)
  if (!room) return null

  const roomEvidence = room.evidence_ids.map((id) => scenario.evidence.find((e) => e.id === id)!).filter(Boolean)

  const handleExamine = (evidenceId: string) => {
    if (actionsRemaining > 0 && !discoveredEvidenceIds.includes(evidenceId)) {
      discoverEvidence(evidenceId)
      consumeAction()
    }
  }

  return (
    <div>
      <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-3">証拠品</h4>
      <div className="grid grid-cols-1 gap-2">
        {roomEvidence.map((evidence) => {
          const discovered = discoveredEvidenceIds.includes(evidence.id)
          return (
            <div key={evidence.id} className="relative">
              <EvidenceCard
                evidence={evidence}
                compact
                selected={discovered}
                onClick={!discovered && actionsRemaining > 0 ? () => handleExamine(evidence.id) : undefined}
              />
              {discovered && (
                <span className="absolute top-1 right-1 text-gothic-gold text-xs">✓</span>
              )}
              {!discovered && (
                <span className="absolute top-1 right-1 text-gothic-muted text-xs">調査する</span>
              )}
            </div>
          )
        })}
        {roomEvidence.length === 0 && (
          <p className="text-gothic-muted font-serif text-sm">この部屋には証拠品がない</p>
        )}
      </div>
    </div>
  )
}
