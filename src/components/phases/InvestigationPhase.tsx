// 捜査フェーズの画面。16:9コンテナ内に右パネルを内包したレイアウトで部屋探索・証拠収集・容疑者会話を管理する
// APカウンターは右上に独立バッジ、ボタン群はその下の右パネルとして配置する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { RoomView } from '../investigation/RoomView'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { CombinationDiscovery } from '../investigation/CombinationDiscovery'
import { FakeRevealModal } from '../investigation/FakeRevealModal'
import { RoomMoveModal } from '../investigation/RoomMoveModal'
import { EvidenceModal } from '../investigation/EvidenceModal'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { MANSION_DEFAULT_ASSET } from '../../services/assetResolver'
import { RightPanel } from '../layout/RightPanel'
import { PanelButton } from '../layout/PanelButton'
import { SearchIcon, NotesIcon, DoorIcon } from '../shared/Icons'

export function InvestigationPhase() {
  const {
    scenario,
    currentRoomId,
    actionsRemaining,
    talkActionsRemaining,
    difficulty,
    setPhase,
    inspectedEvidenceIds,
  } = useGameStore()
  const diffCfg = DIFFICULTY_CONFIG[difficulty]
  const [showNotes, setShowNotes] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)

  if (!scenario) return null

  // いずれかのアクションプールが尽きた場合もソフトロック防止のため進行を許可する
  const canProceed =
    inspectedEvidenceIds.length > 0 || actionsRemaining === 0 || talkActionsRemaining === 0

  // 現在の部屋の証拠数（証拠品ボタンのバッジ用）
  const currentRoom = currentRoomId ? scenario.rooms.find((r) => r.id === currentRoomId) : null
  const roomEvidenceTotal = currentRoom?.evidence_ids.length ?? 0
  const roomEvidenceInspected = currentRoom
    ? currentRoom.evidence_ids.filter((id) => inspectedEvidenceIds.includes(id)).length
    : 0

  // APカウンター: ボタン群とは独立した右上バッジ
  const apBadge = (
    <div className="absolute right-3 top-3 z-20 bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-3 py-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gothic-muted font-serif text-[10px]">調査</span>
        <span className="text-gothic-gold font-pixel text-xs">
          {actionsRemaining}/{diffCfg.actions}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gothic-muted font-serif text-[10px]">会話</span>
        <span className="text-gothic-accent font-pixel text-xs">
          {talkActionsRemaining}/{diffCfg.talkActions}
        </span>
      </div>
    </div>
  )

  // ボタン群: APバッジの下（top-24）から配置
  const rightButtons = (
    <RightPanel
      className="top-24"
      slot1="探索"
      slot3={
        currentRoomId ? (
          <PanelButton variant="primary" onClick={() => setShowEvidence(true)}>
            <span className="flex items-center justify-center gap-1.5">
              <SearchIcon size={13} />
              <span>証拠品</span>
            </span>
            {roomEvidenceTotal > 0 && (
              <span className="block text-[10px] text-gothic-muted mt-0.5">
                {roomEvidenceInspected}/{roomEvidenceTotal}
              </span>
            )}
          </PanelButton>
        ) : undefined
      }
      slot4={
        <div className="flex flex-col gap-2">
          <PanelButton onClick={() => setShowNotes(true)}>
            <span className="flex items-center justify-center gap-1.5">
              <NotesIcon size={13} />
              <span>捜査メモ</span>
            </span>
          </PanelButton>
          <PanelButton variant="primary" onClick={() => setShowMoveModal(true)}>
            <span className="flex items-center justify-center gap-1.5">
              <DoorIcon size={13} />
              <span>移動</span>
            </span>
          </PanelButton>
        </div>
      }
      slot5={
        canProceed ? (
          <PanelButton variant="glow" onClick={() => setPhase('discussion')}>
            議論へ進む
          </PanelButton>
        ) : undefined
      }
    />
  )

  return (
    <>
      <CombinationDiscovery />
      <FakeRevealModal />
      {showNotes && <InvestigationNotes onClose={() => setShowNotes(false)} />}
      {showMoveModal && <RoomMoveModal onClose={() => setShowMoveModal(false)} />}
      {showEvidence && currentRoomId && (
        <EvidenceModal roomId={currentRoomId} onClose={() => setShowEvidence(false)} />
      )}

      {currentRoomId ? (
        <RoomView
          roomId={currentRoomId}
          hideEvidenceIcon
          rightPanel={
            <>
              {apBadge}
              {rightButtons}
            </>
          }
        />
      ) : (
        /* 初期状態: 館背景を表示 */
        <div className="relative h-full overflow-hidden">
          <div className="absolute inset-0">
            <PixelImageWithFallback
              src={MANSION_DEFAULT_ASSET}
              alt="館"
              pixelSize={PIXEL_ART_CONFIG.pixelSize.mansion}
              canvasWidth={PIXEL_ART_CONFIG.canvasSize.mansion.width}
              canvasHeight={PIXEL_ART_CONFIG.canvasSize.mansion.height}
              fallbackSrc={MANSION_DEFAULT_ASSET}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border p-4 text-center">
              <p className="text-gothic-text font-serif text-sm">
                「移動」ボタンから部屋を選択して調査を開始してください
              </p>
            </div>
          </div>
          {apBadge}
          {rightButtons}
        </div>
      )}
    </>
  )
}
