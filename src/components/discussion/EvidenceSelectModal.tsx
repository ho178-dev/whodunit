// 容疑者に突きつける証拠を選択するモーダル。発見済み証拠を一覧表示し、突きつけ済みマーク付き
import { useGameStore } from '../../stores/gameStore'
import { EvidenceCard } from '../shared/EvidenceCard'

interface EvidenceSelectModalProps {
  suspectName: string
  discoveredIds: string[]
  confrontedEvidenceIds: string[]
  onSelect: (evidenceId: string) => void
  onClose: () => void
}

// 容疑者に突きつける証拠を選択するモーダルコンポーネント
export function EvidenceSelectModal({
  suspectName,
  discoveredIds,
  confrontedEvidenceIds,
  onSelect,
  onClose,
}: EvidenceSelectModalProps) {
  const { scenario } = useGameStore()
  if (!scenario) return null

  const discovered = discoveredIds
    .map((id) => scenario.evidence.find((e) => e.id === id)!)
    .filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-sm border border-gothic-gold bg-gothic-panel shadow-[0_0_40px_rgba(217,119,6,0.4)] animate-fade-in">
        <div className="border-b border-gothic-gold px-6 py-4 text-center">
          <h2 className="font-display text-gothic-gold text-lg tracking-widest">証拠を選択</h2>
          <p className="text-gothic-muted font-serif text-xs mt-1">
            {suspectName}に突きつける証拠を選んでください
          </p>
        </div>

        <div className="px-4 py-4 max-h-80 overflow-y-auto game-scrollbar space-y-2">
          {discovered.length === 0 ? (
            <p className="text-gothic-muted font-serif text-sm text-center py-4">
              証拠が見つかっていません
            </p>
          ) : (
            discovered.map((ev) => {
              const isConfronted = confrontedEvidenceIds.includes(ev.id)
              return (
                <button
                  key={ev.id}
                  onClick={() => onSelect(ev.id)}
                  className="w-full text-left relative"
                >
                  <EvidenceCard evidence={ev} compact />
                  {isConfronted && (
                    <span className="absolute top-2 right-2 text-gothic-muted font-serif text-xs border border-gothic-border px-1.5 py-0.5">
                      突きつけ済
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className="px-6 pb-5 flex justify-end border-t border-gothic-border pt-4">
          <button
            onClick={onClose}
            className="border border-gothic-border text-gothic-muted font-serif py-2 px-6 text-sm hover:border-gothic-accent transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
