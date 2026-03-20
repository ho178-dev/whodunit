import { cn } from '../../utils/cn'
import type { NpcBehavior } from '../../types/scenario'

interface ReactionDisplayProps {
  reaction: string
  behavior: NpcBehavior
  suspectName: string
}

const behaviorColors: Record<NpcBehavior, string> = {
  calm: 'text-gothic-muted border-gothic-border',
  nervous: 'text-yellow-400 border-yellow-700',
  angry: 'text-red-400 border-red-800',
  sad: 'text-blue-400 border-blue-800',
  evasive: 'text-orange-400 border-orange-800',
}

const behaviorLabel: Record<NpcBehavior, string> = {
  calm: '冷静',
  nervous: '動揺',
  angry: '怒り',
  sad: '悲嘆',
  evasive: '回避',
}

export function ReactionDisplay({ reaction, behavior, suspectName }: ReactionDisplayProps) {
  return (
    <div className={cn('border p-4 mt-4', behaviorColors[behavior])}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-sm">{suspectName}</span>
        <span className={cn('text-xs border px-2 py-0.5', behaviorColors[behavior])}>
          {behaviorLabel[behavior]}
        </span>
      </div>
      <p className="font-serif text-gothic-text text-sm">「{reaction}」</p>
    </div>
  )
}
