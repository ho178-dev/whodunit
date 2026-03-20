// 捜査フェーズの残り調査アクション数と会話アクション数をピップ形式で表示するコンポーネント
import { MAX_VISIBLE_TALK_PIPS } from '../../constants/gameConfig'

interface ActionCounterProps {
  actionsRemaining: number
  actionsTotal: number
  talkActionsRemaining: number
  talkActionsTotal: number
}

export function ActionCounter({
  actionsRemaining,
  actionsTotal,
  talkActionsRemaining,
  talkActionsTotal,
}: ActionCounterProps) {
  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex items-center gap-2">
        <span className="text-gothic-muted font-serif text-xs">調査</span>
        <div className="flex gap-0.5">
          {Array.from({ length: actionsTotal }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 border ${i < actionsRemaining ? 'bg-gothic-gold border-gothic-gold' : 'bg-transparent border-gothic-border'}`}
            />
          ))}
        </div>
        <span className="text-gothic-gold font-display text-sm">
          {actionsRemaining}/{actionsTotal}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gothic-muted font-serif text-xs">会話</span>
        <div className="flex gap-0.5 flex-wrap max-w-[180px] justify-end">
          {Array.from({ length: Math.min(talkActionsTotal, MAX_VISIBLE_TALK_PIPS) }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 border ${i < talkActionsRemaining ? 'bg-gothic-accent border-gothic-accent' : 'bg-transparent border-gothic-border'}`}
            />
          ))}
        </div>
        <span className="text-gothic-accent font-display text-sm">
          {talkActionsRemaining}/{talkActionsTotal}
        </span>
      </div>
    </div>
  )
}
