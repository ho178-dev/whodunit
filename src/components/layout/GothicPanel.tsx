import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GothicPanelProps {
  children: ReactNode
  title?: string
  className?: string
}

export function GothicPanel({ children, title, className }: GothicPanelProps) {
  return (
    <div className={cn('border border-gothic-border bg-gothic-panel', className)}>
      {title && (
        <div className="border-b border-gothic-border px-6 py-3">
          <h2 className="font-display text-gothic-gold text-lg tracking-widest">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
