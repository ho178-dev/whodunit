// 証拠品の画像・名前・説明を表示する汎用カードコンポーネント
import { cn } from '../../utils/cn'
import { useEvidenceAsset } from '../../hooks/useAsset'
import type { Evidence } from '../../types/scenario'
import { PixelImageWithFallback } from './PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'

const DEFAULT_EVIDENCE_IMG = '/assets/evidence/default.png'

interface EvidenceCardProps {
  evidence: Evidence
  selected?: boolean
  onClick?: () => void
  compact?: boolean
}

export function EvidenceCard({ evidence, selected, onClick, compact }: EvidenceCardProps) {
  const imgSrc = useEvidenceAsset(evidence.category_id)

  return (
    <div
      className={cn(
        'border bg-gothic-panel transition-all duration-200',
        selected
          ? 'border-gothic-gold shadow-[0_0_12px_rgba(217,119,6,0.4)]'
          : 'border-gothic-border hover:border-gothic-accent',
        onClick && 'cursor-pointer hover:scale-105',
        compact ? 'p-2 flex items-center gap-2' : 'p-3'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'bg-stone-800 flex items-center justify-center overflow-hidden flex-shrink-0',
          compact ? 'h-10 w-10' : 'h-20 w-full mb-2'
        )}
      >
        <PixelImageWithFallback
          src={imgSrc}
          alt={evidence.name}
          pixelSize={
            compact
              ? PIXEL_ART_CONFIG.pixelSize.evidenceCompact
              : PIXEL_ART_CONFIG.pixelSize.evidence
          }
          canvasWidth={PIXEL_ART_CONFIG.canvasSize.evidence.width}
          canvasHeight={PIXEL_ART_CONFIG.canvasSize.evidence.height}
          fallbackSrc={DEFAULT_EVIDENCE_IMG}
        />
      </div>
      <div>
        <div
          className={cn(
            'text-gothic-text font-serif',
            compact ? 'text-sm' : 'text-sm font-semibold'
          )}
        >
          {evidence.name}
        </div>
        {!compact && (
          <div className="text-gothic-muted text-xs mt-1 line-clamp-2">{evidence.description}</div>
        )}
      </div>
    </div>
  )
}
