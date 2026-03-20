import { useGameStore } from '../../stores/gameStore'
import { cn } from '../../utils/cn'

export function RoomSelector() {
  const { scenario, currentRoomId, setCurrentRoomId } = useGameStore()
  if (!scenario) return null

  return (
    <div className="space-y-2">
      <h3 className="font-display text-gothic-gold text-sm tracking-widest mb-3">部屋を選択</h3>
      {scenario.rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => setCurrentRoomId(room.id)}
          className={cn(
            'w-full text-left border px-4 py-3 transition-all duration-200 font-serif',
            room.id === currentRoomId
              ? 'border-gothic-gold bg-stone-800 text-gothic-gold'
              : 'border-gothic-border bg-gothic-panel text-gothic-text hover:border-gothic-accent'
          )}
        >
          <div className="text-sm font-semibold">{room.name}</div>
          <div className="text-xs text-gothic-muted mt-0.5 line-clamp-1">
            {room.description.slice(0, 40)}…
          </div>
        </button>
      ))}
    </div>
  )
}
