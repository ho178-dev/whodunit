import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { EvidenceCard } from '../shared/EvidenceCard'
import type { Evidence } from '../../types/scenario'

interface EvidenceListProps {
  roomId: string
}

export function EvidenceList({ roomId }: EvidenceListProps) {
  const { scenario, discoveredEvidenceIds, discoverEvidence, consumeAction, actionsRemaining } = useGameStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!scenario) return null

  const room = scenario.rooms.find((r) => r.id === roomId)
  if (!room) return null

  const roomEvidence = room.evidence_ids
    .map((id) => scenario.evidence.find((e) => e.id === id))
    .filter((e): e is Evidence => e !== undefined)

  const handleExamine = (evidenceId: string) => {
    if (actionsRemaining > 0 && !discoveredEvidenceIds.includes(evidenceId)) {
      discoverEvidence(evidenceId)
      consumeAction()
    }
  }

  const handleToggleExpand = (evidenceId: string) => {
    setExpandedId((prev) => (prev === evidenceId ? null : evidenceId))
  }

  return (
    <div>
      <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-3">証拠品</h4>
      <div className="grid grid-cols-1 gap-2">
        {roomEvidence.map((evidence) => {
          const discovered = discoveredEvidenceIds.includes(evidence.id)
          const isExpanded = expandedId === evidence.id
          return (
            <div key={evidence.id} className="relative">
              <EvidenceCard
                evidence={evidence}
                compact
                selected={discovered}
                onClick={
                  discovered
                    ? () => handleToggleExpand(evidence.id)
                    : actionsRemaining > 0
                    ? () => handleExamine(evidence.id)
                    : undefined
                }
              />
              {discovered && (
                <span className="absolute top-1 right-1 text-gothic-gold text-xs">✓</span>
              )}
              {!discovered && (
                <span className="absolute top-1 right-1 text-gothic-muted text-xs">調査する</span>
              )}
              {discovered && isExpanded && (
                <div className="p-3 bg-stone-900 border-t border-gothic-border">
                  <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">調査メモ</p>
                  <p className="text-gothic-text font-serif text-sm">{evidence.examination_notes}</p>
                </div>
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
