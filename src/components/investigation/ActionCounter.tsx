interface ActionCounterProps {
  remaining: number
  total: number
}

export function ActionCounter({ remaining, total }: ActionCounterProps) {
  const pips = Array.from({ length: total }, (_, i) => i < remaining)

  return (
    <div className="flex items-center gap-2">
      <span className="text-gothic-muted font-serif text-sm">行動力</span>
      <div className="flex gap-1">
        {pips.map((active, i) => (
          <div
            key={i}
            className={`w-3 h-3 border ${active ? 'bg-gothic-gold border-gothic-gold' : 'bg-transparent border-gothic-border'}`}
          />
        ))}
      </div>
      <span className="text-gothic-gold font-display text-sm">{remaining}/{total}</span>
    </div>
  )
}
