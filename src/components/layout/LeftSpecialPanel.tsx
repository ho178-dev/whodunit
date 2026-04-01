// 右パネルに収まらない特殊操作UIを左端に浮かせて配置する補助パネル
// コンテナ自体は透過で背景シーンが見えるようにし、各子要素が個別の背景を持つ
import type { ReactNode } from 'react'

interface LeftSpecialPanelProps {
  children: ReactNode
}

// 16:9コンテナ左端に浮かせたボタン・UI群。コンテナ自体は透過
export function LeftSpecialPanel({ children }: LeftSpecialPanelProps) {
  return (
    <div className="absolute left-2 game-md:left-3 top-3 flex flex-col gap-2 z-20 w-[140px] game-sm:w-[160px] game-md:w-[180px] game-lg:w-[200px]">
      {children}
    </div>
  )
}
