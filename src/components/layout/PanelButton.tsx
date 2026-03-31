// フェーズパネル内共通ボタンコンポーネント。全スロットで横幅・縦サイズを統一する
import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'glow' | 'dimmed'

interface PanelButtonProps {
  onClick?: () => void
  disabled?: boolean
  variant?: Variant
  children: ReactNode
  className?: string
}

const variantClass: Record<Variant, string> = {
  primary: 'border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text',
  secondary:
    'border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted hover:text-gothic-text',
  danger: 'border-red-800 bg-gothic-panel hover:bg-red-950/30 text-red-400',
  glow: 'border-gothic-gold bg-gothic-panel text-gothic-gold animate-glow-pulse',
  dimmed: 'border-gothic-border/30 bg-gothic-panel text-gothic-muted/40 hover:text-gothic-muted/60',
}

// フェーズ右パネルのスロットで使用する統一ボタンコンポーネント
export function PanelButton({
  onClick,
  disabled,
  variant = 'secondary',
  children,
  className,
}: PanelButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full py-2.5 px-2 font-display text-xs tracking-widest transition-all text-center border leading-tight disabled:opacity-40 disabled:cursor-not-allowed',
        variantClass[variant],
        className
      )}
    >
      {children}
    </button>
  )
}
