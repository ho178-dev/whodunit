// 容疑者を3人ずつ表示するカルーセルスライダー。議論・投票フェーズ共通
import { CharacterCard } from './CharacterCard'
import { cn } from '../../utils/cn'
import type { Suspect } from '../../types/scenario'

const arrowClass =
  'game-button shrink-0 border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted hover:text-gothic-gold w-8 h-8 flex items-center justify-center transition-all'

interface CharacterSliderProps {
  suspects: Suspect[]
  sliderIndex: number
  onSliderIndexChange: (index: number) => void
  onSuspectClick: (suspectId: string) => void
  /** 選択状態を示す容疑者ID（ゴールド枠で強調） */
  selectedId?: string | null
  /** ルートdivのクラスを上書きする（右パネル幅分のオフセット調整などに使用） */
  className?: string
}

// 左右矢印とドットインジケーター付きの3人表示スライダー
export function CharacterSlider({
  suspects,
  sliderIndex,
  onSliderIndexChange,
  onSuspectClick,
  selectedId,
  className,
}: CharacterSliderProps) {
  const total = suspects.length
  const visibleIndices = [(sliderIndex - 1 + total) % total, sliderIndex, (sliderIndex + 1) % total]

  return (
    <div
      className={cn(
        'absolute inset-x-0 top-1/2 -translate-y-[60%] flex items-center justify-center gap-3 sm:gap-5 px-4',
        className
      )}
    >
      <button
        onClick={() => onSliderIndexChange(sliderIndex <= 0 ? total - 1 : sliderIndex - 1)}
        className={arrowClass}
      >
        <span className="font-display text-sm">◀</span>
      </button>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end justify-center gap-3 sm:gap-5">
          {visibleIndices.map((idx, pos) => (
            <div
              key={suspects[idx].id}
              className={cn(
                'transition-all duration-300',
                pos === 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
              )}
            >
              <CharacterCard
                suspect={suspects[idx]}
                portrait
                selected={selectedId ? suspects[idx].id === selectedId : pos === 1}
                onClick={() => onSuspectClick(suspects[idx].id)}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          {suspects.map((_, i) => (
            <button
              key={i}
              onClick={() => onSliderIndexChange(i)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all',
                i === sliderIndex ? 'bg-gothic-gold' : 'bg-gothic-border/60 hover:bg-gothic-muted'
              )}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onSliderIndexChange(sliderIndex >= total - 1 ? 0 : sliderIndex + 1)}
        className={arrowClass}
      >
        <span className="font-display text-sm">▶</span>
      </button>
    </div>
  )
}
