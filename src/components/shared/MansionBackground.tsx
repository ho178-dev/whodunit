// 館背景・グラデーション・フェーズ別色調オーバーレイを描画する共通コンポーネント
import { memo } from 'react'
import { cn } from '../../utils/cn'
import { PixelImageWithFallback } from './PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { MANSION_DEFAULT_ASSET } from '../../services/assetResolver'
import { PHASE_OVERLAYS } from '../../constants/phaseConfig'
import type { GamePhase } from '../../types/game'

interface MansionSceneBackgroundProps {
  phase: GamePhase
  /**
   * true  : グラデーションを濃くする（テキストパネルの可読性確保）
   * false : グラデーションを薄くする（部屋背景的な使用）
   * ※ CSS の fixed ポジショニングは使用しない（16:9 コンテナ内で absolute に統一）
   */
  fixed?: boolean
}

/** 館背景・下部グラデーション・フェーズ別色調オーバーレイを重ねて描画する */
export const MansionSceneBackground = memo(function MansionSceneBackground({
  phase,
  fixed = false,
}: MansionSceneBackgroundProps) {
  const overlay = PHASE_OVERLAYS[phase]
  // 常に absolute inset-0 で親コンテナ内に収める（viewport固定は使用しない）
  const containerClass = 'absolute inset-0 overflow-hidden'
  // fixed=true のフェーズはテキストパネルの可読性を確保するため全体を若干暗くする
  const gradientClass = fixed
    ? 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20'
    : 'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'

  return (
    <div className={containerClass}>
      <PixelImageWithFallback
        src={MANSION_DEFAULT_ASSET}
        alt="館"
        pixelSize={PIXEL_ART_CONFIG.pixelSize.mansion}
        canvasWidth={PIXEL_ART_CONFIG.canvasSize.mansion.width}
        canvasHeight={PIXEL_ART_CONFIG.canvasSize.mansion.height}
        fallbackSrc={MANSION_DEFAULT_ASSET}
      />
      <div className={gradientClass} />
      {overlay && <div className={cn('absolute inset-0', overlay.className)} />}
    </div>
  )
})
