// triggerKeyの変化を検知してフェードイン/アウトアニメーションを行うラッパーコンポーネント
import { useEffect, useState, type ReactNode } from 'react'

interface FadeTransitionProps {
  children: ReactNode
  triggerKey: string
}

export function FadeTransition({ children, triggerKey }: FadeTransitionProps) {
  const [visible, setVisible] = useState(false)
  const [prevKey, setPrevKey] = useState(triggerKey)

  if (prevKey !== triggerKey) {
    setPrevKey(triggerKey)
    setVisible(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [triggerKey])

  return (
    <div className="transition-opacity duration-500" style={{ opacity: visible ? 1 : 0 }}>
      {children}
    </div>
  )
}
