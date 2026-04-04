// 全フェーズ共通の右パネル。16:9コンテナ内右端にボタン群を透過背景で浮かせて配置する
// パネルコンテナ自体は透過で背景シーンが見えるようにし、各スロット要素が個別の背景を持つ
// フェーズ名バッジは GameShell 側の右上ヘッダーに移管済み（slot1 廃止）
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface RightPanelProps {
  /** スロット2: 状態表示エリア（任意） */
  slot2?: ReactNode
  /** スロット3: メインアクションボタン（任意） */
  slot3?: ReactNode
  /** スロット4: サブアクションボタン（任意） */
  slot4?: ReactNode
  /** スロット5: フェーズ進行ボタン（任意） */
  slot5?: ReactNode
  /** 外側コンテナのクラスを追加・上書き（top位置の調整などに使用） */
  className?: string
}

// 16:9コンテナ右端に浮かせたボタン群。コンテナ自体は透過で背景が透けて見える
// top-10: GameShell 右上ヘッダー（absolute top-2）との重複を避けるためデフォルトで下げる
export function RightPanel({ slot2, slot3, slot4, slot5, className }: RightPanelProps) {
  return (
    <div className={cn('absolute right-2 top-10 flex flex-col gap-2 z-20 w-[140px]', className)}>
      {/* Slot 2: 状態表示 */}
      {slot2 && (
        <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-3 py-2">
          {slot2}
        </div>
      )}

      {/* Slots 3–5: アクションボタン群 */}
      {slot3}
      {slot4}
      {slot5}
    </div>
  )
}
