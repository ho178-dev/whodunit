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
  primary:
    'border-gothic-accent bg-gothic-panel hover:bg-stone-800 hover:border-gothic-gold text-gothic-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_0_10px_rgba(217,119,6,0.25)]',
  secondary:
    'border-gothic-border bg-gothic-panel hover:border-gothic-accent hover:bg-stone-800/60 text-gothic-muted hover:text-gothic-text shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
  danger:
    'border-red-800 bg-gothic-panel hover:bg-red-950/30 hover:border-red-600 text-red-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
  glow: 'border-gothic-gold bg-gothic-panel text-gothic-gold animate-glow-pulse shadow-[0_0_8px_rgba(217,119,6,0.3)]',
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
        'w-full min-h-[32px] py-2 px-2 font-display text-[10px] tracking-widest transition-all text-center border leading-tight disabled:opacity-40 disabled:cursor-not-allowed',
        variantClass[variant],
        className
      )}
    >
      {children}
    </button>
  )
}
