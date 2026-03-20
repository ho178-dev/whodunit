// 部屋内の証拠品一覧の表示と、証拠調査インタラクション（2段階アクション消費・展開）を管理するコンポーネント
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { EvidenceCard } from '../shared/EvidenceCard'
import type { Evidence } from '../../types/scenario'

interface EvidenceListProps {
  roomId: string
}

// 証拠品一覧を表示し、2段階の調査インタラクション（外観→示唆）を制御するコンポーネント
export function EvidenceList({ roomId }: EvidenceListProps) {
  const {
    scenario,
    inspectedEvidenceIds,
    examinedEvidenceIds,
    inspectEvidence,
    examineEvidence,
    consumeAction,
    actionsRemaining,
  } = useGameStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!scenario) return null

  const room = scenario.rooms.find((r) => r.id === roomId)
  if (!room) return null

  const roomEvidence = room.evidence_ids
    .map((id) => scenario.evidence.find((e) => e.id === id))
    .filter((e): e is Evidence => e !== undefined)

  // アクションを消費して証拠の外観（description）を開示する（1段階目）
  const handleInspect = (evidenceId: string) => {
    if (actionsRemaining > 0 && !inspectedEvidenceIds.includes(evidenceId)) {
      inspectEvidence(evidenceId)
      consumeAction()
      setExpandedId(evidenceId)
    }
  }

  // アクションを消費して証拠の論理的示唆（examination_notes）を開示する（2段階目）
  const handleDeepExamine = (evidenceId: string) => {
    if (actionsRemaining > 0 && !examinedEvidenceIds.includes(evidenceId)) {
      examineEvidence(evidenceId)
      consumeAction()
    }
  }

  // 証拠品の詳細展開・折りたたみを切り替える
  const handleToggleExpand = (evidenceId: string) => {
    setExpandedId((prev) => (prev === evidenceId ? null : evidenceId))
  }

  return (
    <div>
      <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-3">証拠品</h4>
      <div className="grid grid-cols-1 gap-2">
        {roomEvidence.map((evidence) => {
          const inspected = inspectedEvidenceIds.includes(evidence.id)
          const examined = examinedEvidenceIds.includes(evidence.id)
          const isExpanded = expandedId === evidence.id
          return (
            <div key={evidence.id} className="relative">
              <EvidenceCard
                evidence={evidence}
                compact
                selected={inspected}
                onClick={
                  inspected
                    ? () => handleToggleExpand(evidence.id)
                    : actionsRemaining > 0
                      ? () => handleInspect(evidence.id)
                      : undefined
                }
              />
              {inspected && (
                <span className="absolute top-1 right-1 text-gothic-gold text-xs">✓</span>
              )}
              {!inspected && (
                <span className="absolute top-1 right-1 text-gothic-muted text-xs">調査する</span>
              )}
              {inspected && isExpanded && (
                <div className="p-3 bg-stone-900 border-t border-gothic-border space-y-3">
                  <div>
                    <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">
                      外観
                    </p>
                    <p className="text-gothic-text font-serif text-sm">{evidence.description}</p>
                  </div>
                  {examined ? (
                    <div className="border-t border-gothic-border pt-3">
                      <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">
                        調査メモ
                      </p>
                      <p className="text-gothic-text font-serif text-sm">
                        {evidence.examination_notes}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeepExamine(evidence.id)}
                      disabled={actionsRemaining <= 0}
                      className="w-full border border-gothic-accent text-gothic-muted font-serif text-xs py-2 hover:text-gothic-text hover:border-gothic-gold transition-colors disabled:opacity-40"
                    >
                      詳しく調査する（1アクション消費）
                    </button>
                  )}
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
