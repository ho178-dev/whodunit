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
   * true  : fixed inset-0（AccusationPhase/EndingScreen 全画面スクロール用）
   * false : absolute inset-0（Discussion/VotingPhase 16:9 コンテナ内用）
   */
  fixed?: boolean
}

/** 館背景・下部グラデーション・フェーズ別色調オーバーレイを重ねて描画する */
export const MansionSceneBackground = memo(function MansionSceneBackground({
  phase,
  fixed = false,
}: MansionSceneBackgroundProps) {
  const overlay = PHASE_OVERLAYS[phase]
  const containerClass = fixed ? 'fixed inset-0 overflow-hidden' : 'absolute inset-0'
  // fixed モードはテキストパネルの可読性を確保するため全体を若干暗くする
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
