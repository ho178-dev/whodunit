// 容疑者の画像・名前・年齢・職業を表示する汎用カードコンポーネント
import { cn } from '../../utils/cn'
import { useCharacterAsset } from '../../hooks/useAsset'
import { assetUrl } from '../../utils/assetUrl'
import type { Suspect } from '../../types/scenario'
import { PixelImageWithFallback } from './PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'

const DEFAULT_CHARACTER_IMG = assetUrl('/assets/characters/default_character.png')

interface CharacterCardProps {
  suspect: Suspect
  selected?: boolean
  onClick?: () => void
  portrait?: boolean
  onNameClick?: () => void
}

// 容疑者の画像・名前・年齢・職業を表示するカード
export function CharacterCard({
  suspect,
  selected,
  onClick,
  portrait,
  onNameClick,
}: CharacterCardProps) {
  const imgSrc = useCharacterAsset(suspect.appearance_id)

  // ポートレートモード: 部屋背景前面に配置する額縁風表示
  if (portrait) {
    return (
      // hover:scale-105 を削除し、代わりに額縁にゴールド発光エフェクトを適用する
      <div
        className={cn('flex flex-col items-center cursor-pointer transition-all duration-200')}
        onClick={onClick}
      >
        {/* 額縁風キャラクター画像 */}
        <div
          className={cn(
            'relative border-2 shadow-lg transition-all duration-200',
            selected
              ? 'border-gothic-gold shadow-[0_0_20px_rgba(217,119,6,0.5)]'
              : 'border-gothic-border/80 shadow-black/40',
            onClick &&
              !selected &&
              'hover:border-gothic-gold/70 hover:shadow-[0_0_15px_rgba(217,119,6,0.5)]'
          )}
        >
          {/* 内側の装飾線 */}
          <div className="border border-gothic-border/40 bg-stone-800">
            <div className="h-[200px] game-sm:h-[220px] game-md:h-[260px] game-lg:h-[300px] aspect-[832/1216] overflow-hidden">
              <PixelImageWithFallback
                src={imgSrc}
                alt={suspect.name}
                pixelSize={PIXEL_ART_CONFIG.pixelSize.character}
                canvasWidth={PIXEL_ART_CONFIG.canvasSize.character.width}
                canvasHeight={PIXEL_ART_CONFIG.canvasSize.character.height}
                fallbackSrc={DEFAULT_CHARACTER_IMG}
              />
            </div>
          </div>
        </div>
        {/* 名前プレート（クリックで詳細モーダル） */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNameClick?.()
          }}
          className={cn(
            'mt-1.5 px-3 py-0.5 border text-center min-w-20 transition-colors',
            'bg-gothic-panel/90 backdrop-blur-sm',
            selected
              ? 'border-gothic-gold/60 text-gothic-gold hover:bg-stone-700/80'
              : 'border-gothic-border/60 text-gothic-text hover:border-gothic-accent hover:text-gothic-gold'
          )}
        >
          <span className="font-display text-xs tracking-wider">{suspect.name}</span>
        </button>
      </div>
    )
  }
}
