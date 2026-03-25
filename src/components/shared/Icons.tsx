// ゲーム内で使用するシンプルなSVGアイコン群。stroke="currentColor" で色を継承する
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const defaults = (size: number): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: size,
  height: size,
})

// 虫眼鏡アイコン（証拠品・捜索）
export function SearchIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.1" y2="16.1" />
    </svg>
  )
}

// ノートアイコン（捜査メモ）
export function NotesIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <rect x="4" y="2" width="14" height="20" rx="1" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  )
}

// アーチ扉アイコン（移動）
export function DoorIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      {/* 床ライン */}
      <line x1="3" y1="21" x2="21" y2="21" />
      {/* アーチ形の出入り口 */}
      <path d="M6 21V11a6 6 0 0 1 12 0v10" />
    </svg>
  )
}
