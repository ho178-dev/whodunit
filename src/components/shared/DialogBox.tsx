// タイピングアニメーション付きのセリフ表示ボックス。固定2行高さでスクロールボタンにより全文確認できる
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

// font-serif text-sm leading-relaxed: 14px × 1.625 ≈ 23px/行
const LINE_HEIGHT_PX = 23

interface DialogBoxProps {
  text: string
  speakerName?: string
  className?: string
  onComplete?: () => void
}

// 固定2行ダイアログ。タイピング完了後にテキストが溢れる場合は▼/▲でスクロールする
export function DialogBox({ text, speakerName, className, onComplete }: DialogBoxProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollUp(el.scrollTop > 0)
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
  }, [])

  // rAF のキャンセルはアンマウント時のみでよい（各ハンドラーで上書きするため）
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // テキストが変わったらスクロール位置をリセットして再アニメーション
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    setCanScrollDown(false)
    setCanScrollUp(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))

      // タイピング中に表示テキストが2行を超えた場合、自動スクロールして最新行を表示し
      // スクロールボタンの表示状態を更新する
      const el = scrollRef.current
      if (el && el.scrollHeight > el.clientHeight) {
        el.scrollTop = el.scrollHeight - el.clientHeight
        setCanScrollUp(el.scrollTop > 0)
        setCanScrollDown(false)
      }

      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onCompleteRef.current?.()
      }
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  // アニメーション完了後にスクロール可否を判定する
  useEffect(() => {
    if (!done || !scrollRef.current) return
    updateScrollState()
  }, [done, updateScrollState])

  // クリック時にアニメーションを即時完了しテキスト全文を表示する
  const handleClick = () => {
    if (!done) {
      setDisplayed(text)
      setDone(true)
      onCompleteRef.current?.()
    }
  }

  // direction: 1=下, -1=上
  const handleScroll = (e: React.MouseEvent, direction: 1 | -1) => {
    e.stopPropagation()
    const el = scrollRef.current
    if (!el) return
    el.scrollTop += LINE_HEIGHT_PX * direction
    // 前の rAF が残っていれば上書きしてから再スケジュール
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(updateScrollState)
  }

  return (
    <div
      className={cn('border border-gothic-border bg-gothic-panel/90 p-2 cursor-pointer', className)}
      onClick={handleClick}
    >
      {speakerName && (
        <div className="text-gothic-gold font-display text-xs mb-1.5">{speakerName}</div>
      )}

      {/* 固定2行エリア: overflow-hidden でスクロールはJSのみで制御 */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-hidden"
          style={{ height: `${LINE_HEIGHT_PX * 2}px` }}
        >
          <p className="text-gothic-text font-serif text-sm leading-relaxed">
            {displayed}
            {!done && <span className="animate-pulse">▌</span>}
          </p>
        </div>

        {canScrollUp && (
          <button
            onClick={(e) => handleScroll(e, -1)}
            className="absolute top-0 right-0 text-gothic-muted hover:text-gothic-gold text-[10px] leading-none px-0.5 transition-colors"
            title="上へスクロール"
          >
            ▲
          </button>
        )}

        {canScrollDown && (
          <button
            onClick={(e) => handleScroll(e, 1)}
            className="absolute bottom-0 right-0 text-gothic-muted hover:text-gothic-gold text-[10px] leading-none px-0.5 transition-colors"
            title="下へスクロール"
          >
            ▼
          </button>
        )}
      </div>
    </div>
  )
}
