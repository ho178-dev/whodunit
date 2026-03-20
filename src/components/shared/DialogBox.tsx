// タイピングアニメーション付きのセリフ表示ボックス。クリックで即時表示完了する
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

interface DialogBoxProps {
  text: string
  speakerName?: string
  className?: string
  onComplete?: () => void
}

// タイピングアニメーションでセリフを表示し、クリックで即時完了するダイアログコンポーネント
export function DialogBox({ text, speakerName, className, onComplete }: DialogBoxProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onCompleteRef.current?.()
      }
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  // クリック時にアニメーションを即時完了しテキスト全文を表示する
  const handleClick = () => {
    if (!done) {
      setDisplayed(text)
      setDone(true)
      onComplete?.()
    }
  }

  return (
    <div
      className={cn('border border-gothic-border bg-gothic-panel/90 p-4 cursor-pointer', className)}
      onClick={handleClick}
    >
      {speakerName && (
        <div className="text-gothic-gold font-display text-sm mb-2">{speakerName}</div>
      )}
      <p className="text-gothic-text font-serif leading-relaxed min-h-[3rem]">
        {displayed}
        {!done && <span className="animate-pulse">▌</span>}
      </p>
    </div>
  )
}
