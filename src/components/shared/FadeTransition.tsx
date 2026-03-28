// triggerKeyの変化を検知してフェードイン/アウトと幕間テキスト演出を行うラッパーコンポーネント
import { useEffect, useState, useCallback, type ReactNode } from 'react'
import type { PhaseLabel } from '../../constants/phaseConfig'
import { cn } from '../../utils/cn'

interface FadeTransitionProps {
  children: ReactNode
  triggerKey: string
  /** フェーズ名幕間演出の設定。未指定の場合は従来のフェードのみ */
  phaseLabel?: PhaseLabel
}

/**
 * label  : コンテンツ非表示・幕間オーバーレイ表示中
 * visible: コンテンツ表示中・オーバーレイ非表示
 */
type TransitionState = 'label' | 'visible'

/** フェーズ切り替え時にコンテンツをフェードアウトし、幕間テキストを表示してからフェードインする */
export function FadeTransition({ children, triggerKey, phaseLabel }: FadeTransitionProps) {
  const [state, setState] = useState<TransitionState>('visible')
  const [prevKey, setPrevKey] = useState(triggerKey)

  // triggerKey変化を同期検知してlabel状態へ切り替え（Reactのderived stateパターン）
  if (prevKey !== triggerKey) {
    setPrevKey(triggerKey)
    setState('label')
  }

  // クリックでスキップ：即座にコンテンツを表示
  const handleSkip = useCallback(() => setState('visible'), [])

  useEffect(() => {
    if (state !== 'label') return
    // phaseLabel がある場合は指定時間（デフォルト1200ms）後にコンテンツを表示
    // phaseLabel がない場合は従来通り50msでフェードイン
    const duration = phaseLabel ? (phaseLabel.duration ?? 1200) : 50
    const timer = setTimeout(() => setState('visible'), duration)
    return () => clearTimeout(timer)
  }, [state, phaseLabel, triggerKey])

  const contentVisible = state === 'visible'
  const labelVisible = state === 'label' && !!phaseLabel

  return (
    <div className="relative h-full">
      {/* 幕間中はDOMをマウントせず、visible遷移後にフェードインする */}
      <div
        className="h-full transition-opacity duration-500"
        style={{ opacity: contentVisible ? 1 : 0 }}
      >
        {contentVisible ? children : null}
      </div>

      {/* 幕間オーバーレイ：phaseLabel がある場合のみ描画 */}
      {phaseLabel && (
        <div
          className={cn(
            'absolute inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer',
            'transition-opacity duration-300',
            labelVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={handleSkip}
          role="button"
          aria-label="クリックでスキップ"
        >
          <div className={`flex flex-col items-center gap-4 ${phaseLabel.textColor}`}>
            {/* 上部デコレーション線 */}
            <div className="w-48 h-px bg-current opacity-50" />
            {/* フェーズ名 */}
            <p className="text-4xl tracking-[0.35em] font-serif">{phaseLabel.text}</p>
            {/* サブテキスト */}
            {phaseLabel.subText && (
              <p className="text-sm tracking-[0.2em] text-gothic-muted">{phaseLabel.subText}</p>
            )}
            {/* 下部デコレーション線 */}
            <div className="w-48 h-px bg-current opacity-50" />
            {/* スキップヒント */}
            <p className="text-xs text-gothic-muted/40 mt-4 tracking-wider">クリックでスキップ</p>
          </div>
        </div>
      )}
    </div>
  )
}
