// 選択した部屋をアドベンチャーゲーム風に表示するコンポーネント
// 大背景の前面にキャラクター、下部にダイアログ、右上に証拠品アイコンをオーバーレイ配置する
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useRoomAsset } from '../../hooks/useAsset'
import { assetUrl } from '../../utils/assetUrl'
import type { RoomTypeId, Evidence } from '../../types/scenario'
import { NpcDialog } from './NpcDialog'
import { EvidenceModal } from './EvidenceModal'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { SearchIcon } from '../shared/Icons'

const DEFAULT_ROOM_IMG = assetUrl('/assets/rooms/default_room.png')

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  )
}

interface RoomViewProps {
  roomId: string
  /** trueのとき内部の証拠品アイコンとモーダルを非表示にする（親が管理する場合） */
  hideEvidenceIcon?: boolean
  /** 16:9コンテナ内に描画する追加要素（右パネルなど） */
  rightPanel?: ReactNode
}

// 指定部屋の背景・キャラクター・ダイアログ・証拠アイコンを統合表示するコンポーネント
export function RoomView({ roomId, hideEvidenceIcon = false, rightPanel }: RoomViewProps) {
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
      {!hideEvidenceIcon && showEvidence && (
        <EvidenceModal roomId={roomId} onClose={() => setShowEvidence(false)} />
      )}

      <div className="relative h-full overflow-hidden">
        <RoomBackground key={room.type_id} typeId={room.type_id} name={room.name} />

        {/* 部屋名を左上に配置。max-width: RightPanel幅+right offset+余白分を右側から除外して重なりを防ぐ */}
        <div className="absolute top-3 left-0 p-3 max-w-[calc(100%_-_156px)]">
          <div className="inline-block bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-4 py-2">
            <h2 className="font-display text-gothic-gold text-sm tracking-widest">{room.name}</h2>
            <p className="text-gothic-muted font-serif text-[10px] mt-0.5 line-clamp-2">
              {room.description}
            </p>
          </div>
        </div>

        {!hideEvidenceIcon && roomEvidence.length > 0 && (
          <div className="absolute top-0 right-0 p-3">
            <button
              onClick={() => setShowEvidence(true)}
              className="flex items-center gap-1.5 bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 hover:border-gothic-accent px-3 py-2 transition-all hover:shadow-[0_0_12px_rgba(217,119,6,0.2)]"
            >
              <SearchIcon size={16} className="text-gothic-gold" />
              <span className="font-display text-xs tracking-wider text-gothic-muted">
                {inspectedCount}/{roomEvidence.length}
              </span>
            </button>
          </div>
        )}

        {/* rightPanel がある場合は両側均等に内側へ寄せてボタンと被らないようにする。key を roomId にして部屋移動時にダイアログ状態をリセットする */}
        <NpcDialog key={roomId} roomId={roomId} hasRightPanel={!!rightPanel} />

        {/* 追加パネル（右パネルなど） */}
        {rightPanel}
      </div>
    </>
  )
}
