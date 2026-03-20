// 選択した部屋の背景画像・説明・証拠一覧・NPCダイアログを統合表示するコンポーネント
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { useRoomAsset } from '../../hooks/useAsset'
import type { RoomTypeId } from '../../types/scenario'
import { EvidenceList } from './EvidenceList'
import { NpcDialog } from './NpcDialog'

const DEFAULT_ROOM_IMG = '/assets/rooms/default.png'

// 部屋タイプに応じた背景画像を表示し、読み込み失敗時はデフォルト画像にフォールバックするコンポーネント
function RoomBackground({ typeId, name }: { typeId: RoomTypeId; name: string }) {
  const imgSrc = useRoomAsset(typeId)
  const [src, setSrc] = useState(imgSrc)

  return (
    <div className="w-full h-40 mb-4 overflow-hidden">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover opacity-60"
        onError={() => {
          if (src !== DEFAULT_ROOM_IMG) setSrc(DEFAULT_ROOM_IMG)
        }}
      />
    </div>
  )
}

interface RoomViewProps {
  roomId: string
}

// 指定部屋の背景・説明・証拠一覧・NPCダイアログをまとめて表示するコンポーネント
export function RoomView({ roomId }: RoomViewProps) {
  const { scenario } = useGameStore()
  if (!scenario) return null

  const room = scenario.rooms.find((r) => r.id === roomId)
  if (!room) return null

  return (
    <div className="space-y-4">
      <GothicPanel title={room.name}>
        <RoomBackground key={room.type_id} typeId={room.type_id} name={room.name} />
        <p className="text-gothic-muted font-serif text-sm mb-6">{room.description}</p>
        <div className="space-y-6">
          <EvidenceList roomId={roomId} />
          <div className="border-t border-gothic-border pt-4">
            <NpcDialog roomId={roomId} />
          </div>
        </div>
      </GothicPanel>
    </div>
  )
}
