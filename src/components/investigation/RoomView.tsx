// 選択した部屋をアドベンチャーゲーム風に表示するコンポーネント
// 大背景の前面にキャラクター、下部にダイアログ、右上に証拠品アイコンをオーバーレイ配置する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useRoomAsset } from '../../hooks/useAsset'
import type { RoomTypeId, Evidence } from '../../types/scenario'
import { NpcDialog } from './NpcDialog'
import { EvidenceModal } from './EvidenceModal'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'

const DEFAULT_ROOM_IMG = '/assets/rooms/default_room.png'

// 部屋タイプに応じた背景画像を全面表示するコンポーネント
function RoomBackground({ typeId, name }: { typeId: RoomTypeId; name: string }) {
  const imgSrc = useRoomAsset(typeId)
  return (
    <div className="absolute inset-0">
      <PixelImageWithFallback
        src={imgSrc}
        alt={name}
        pixelSize={PIXEL_ART_CONFIG.pixelSize.room}
        canvasWidth={PIXEL_ART_CONFIG.canvasSize.room.width}
        canvasHeight={PIXEL_ART_CONFIG.canvasSize.room.height}
        fallbackSrc={DEFAULT_ROOM_IMG}
      />
      {/* 下部グラデーション: ダイアログの視認性を高める */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  )
}

interface RoomViewProps {
  roomId: string
}

// 指定部屋の背景・キャラクター・ダイアログ・証拠アイコンを統合表示するコンポーネント
export function RoomView({ roomId }: RoomViewProps) {
  const { scenario, inspectedEvidenceIds } = useGameStore()
  const [showEvidence, setShowEvidence] = useState(false)

  if (!scenario) return null

  const room = scenario.rooms.find((r) => r.id === roomId)
  if (!room) return null

  const roomEvidence = room.evidence_ids
    .map((id) => scenario.evidence.find((e) => e.id === id))
    .filter((e): e is Evidence => e !== undefined)
  const inspectedCount = roomEvidence.filter((e) => inspectedEvidenceIds.includes(e.id)).length

  return (
    <>
      {showEvidence && <EvidenceModal roomId={roomId} onClose={() => setShowEvidence(false)} />}

      {/* メインビジュアル: 背景 + キャラクター + ダイアログ + 証拠アイコン */}
      <div
        className="relative w-full border border-gothic-border overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
      >
        <RoomBackground key={room.type_id} typeId={room.type_id} name={room.name} />

        {/* 部屋名オーバーレイ（左上） */}
        <div className="absolute top-0 left-0 p-3">
          <div className="inline-block bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-4 py-2">
            <h2 className="font-display text-gothic-gold text-sm tracking-widest">{room.name}</h2>
            <p className="text-gothic-muted font-serif text-xs mt-0.5 line-clamp-2">
              {room.description}
            </p>
          </div>
        </div>

        {/* 証拠品アイコン（右上） */}
        {roomEvidence.length > 0 && (
          <div className="absolute top-0 right-0 p-3">
            <button
              onClick={() => setShowEvidence(true)}
              className="flex items-center gap-1.5 bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 hover:border-gothic-accent px-3 py-2 transition-all hover:shadow-[0_0_12px_rgba(217,119,6,0.2)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gothic-gold"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="font-display text-xs tracking-wider text-gothic-muted">
                {inspectedCount}/{roomEvidence.length}
              </span>
            </button>
          </div>
        )}

        {/* キャラクター + ダイアログ（NpcDialogが絶対配置で内部管理） */}
        <NpcDialog roomId={roomId} />
      </div>
    </>
  )
}
