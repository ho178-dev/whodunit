// 証拠品調査用モーダル。虫眼鏡アイコンから開き、EvidenceListをそのまま内包する
import { EvidenceList } from './EvidenceList'

interface EvidenceModalProps {
  roomId: string
  onClose: () => void
}

// 証拠品一覧をモーダル表示するコンポーネント
export function EvidenceModal({ roomId, onClose }: EvidenceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-lg border border-gothic-gold bg-gothic-panel shadow-[0_0_40px_rgba(217,119,6,0.4)] animate-fade-in max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gothic-gold px-6 py-4">
          <h2 className="font-display text-gothic-gold text-lg tracking-widest">証拠品</h2>
          <button
            onClick={onClose}
            className="text-gothic-muted hover:text-gothic-text font-serif text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* 証拠品一覧 */}
        <div className="flex-1 overflow-y-auto game-scrollbar px-6 py-4">
          <EvidenceList roomId={roomId} />
        </div>
      </div>
    </div>
  )
}
