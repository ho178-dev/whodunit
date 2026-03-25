// 全フェーズ共通の外枠ラッパー。最大幅・余白を統一する
import type { ReactNode } from 'react'

interface GamePhaseLayoutProps {
  children: ReactNode
}

// フェーズコンポーネントを包む共通外枠コンポーネント
export function GamePhaseLayout({ children }: GamePhaseLayoutProps) {
  return (
    <div className="px-4 py-4">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  )
}
