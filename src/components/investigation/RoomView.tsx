import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { EvidenceList } from './EvidenceList'
import { NpcDialog } from './NpcDialog'

interface RoomViewProps {
  roomId: string
}

export function RoomView({ roomId }: RoomViewProps) {
  const { scenario } = useGameStore()
  if (!scenario) return null

  const room = scenario.rooms.find((r) => r.id === roomId)
  if (!room) return null

  return (
    <div className="space-y-4">
      <GothicPanel title={room.name}>
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
