import { useGameStore } from '../../stores/gameStore'
import { EvidenceCard } from '../shared/EvidenceCard'
import { GothicPanel } from '../layout/GothicPanel'

interface EvidenceSelectorProps {
  discoveredIds: string[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EvidenceSelector({ discoveredIds, selectedId, onSelect }: EvidenceSelectorProps) {
  const { scenario } = useGameStore()
  if (!scenario) return null

  const discovered = discoveredIds.map((id) => scenario.evidence.find((e) => e.id === id)!).filter(Boolean)

  return (
    <GothicPanel title="発見した証拠">
      {discovered.length === 0 ? (
        <p className="text-gothic-muted font-serif text-sm">証拠が見つかっていません</p>
      ) : (
        <div className="space-y-2">
          {discovered.map((ev) => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              compact
              selected={ev.id === selectedId}
              onClick={() => onSelect(ev.id)}
            />
          ))}
        </div>
      )}
    </GothicPanel>
  )
}
