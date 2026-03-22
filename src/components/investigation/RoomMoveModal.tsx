// 部屋移動用モーダル。移動先の部屋を選択して自動クローズする
import { useGameStore } from '../../stores/gameStore'
import { cn } from '../../utils/cn'

interface RoomMoveModalProps {
  onClose: () => void
}

// 部屋一覧を表示し、選択時に移動＆モーダルを閉じるコンポーネント
export function RoomMoveModal({ onClose }: RoomMoveModalProps) {
  const { scenario, currentRoomId, setCurrentRoomId } = useGameStore()
  if (!scenario) return null

  // 部屋を選択して移動後、モーダルを閉じる
  const handleSelect = (roomId: string) => {
    setCurrentRoomId(roomId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md border border-gothic-gold bg-gothic-panel shadow-[0_0_40px_rgba(217,119,6,0.4)] animate-fade-in">
        {/* ヘッダー */}
        <div className="border-b border-gothic-gold px-6 py-4 text-center">
          <h2 className="font-display text-gothic-gold text-lg tracking-widest">移動先を選択</h2>
        </div>

        {/* 部屋一覧 */}
        <div className="px-6 py-4 space-y-2 max-h-80 overflow-y-auto">
          {scenario.rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleSelect(room.id)}
              className={cn(
                'w-full text-left border px-4 py-3 transition-all duration-200 font-serif',
                room.id === currentRoomId
                  ? 'border-gothic-gold bg-stone-800 text-gothic-gold'
                  : 'border-gothic-border bg-gothic-panel text-gothic-text hover:border-gothic-accent hover:bg-stone-800/50'
              )}
            >
              <div className="text-sm font-semibold">{room.name}</div>
              <div className="text-xs text-gothic-muted mt-0.5">{room.description}</div>
            </button>
          ))}
        </div>

        {/* フッター */}
        <div className="px-6 pb-5 flex justify-end border-t border-gothic-border pt-4">
          <button
            onClick={onClose}
            className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted hover:text-gothic-text font-serif text-sm py-2 px-6 transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
