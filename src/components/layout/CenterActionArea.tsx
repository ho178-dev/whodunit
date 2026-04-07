// キャラクター画像とテキストダイアログの間に特殊アクションUI（ボタン・バナーなど）を配置する共有コンポーネント
// 議論・投票・告発フェーズで中央に目立たせたいボタンや通知をここに描画する
import type { ReactNode } from 'react'

interface CenterActionAreaProps {
  children: ReactNode
}

// ダイアログ上端の少し上・画面中央に特殊ボタンやバナーを配置するコンポーネント
export function CenterActionArea({ children }: CenterActionAreaProps) {
  return (
    <div className="absolute inset-x-0 bottom-[115px] z-10 flex flex-col items-center gap-2 px-4">
      {children}
    </div>
  )
}
