// 捜査フェーズの画面。アドベンチャーゲーム風レイアウトで部屋探索・証拠収集・容疑者との会話を管理する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { RoomView } from '../investigation/RoomView'
import { ActionCounter } from '../investigation/ActionCounter'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { CombinationDiscovery } from '../investigation/CombinationDiscovery'
import { FakeRevealModal } from '../investigation/FakeRevealModal'
import { RoomMoveModal } from '../investigation/RoomMoveModal'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { MANSION_DEFAULT_ASSET } from '../../services/assetResolver'

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

  if (!scenario) return null

  // いずれかのアクションプールが尽きた場合もソフトロック防止のため進行を許可する
  const canProceed =
    inspectedEvidenceIds.length > 0 || actionsRemaining === 0 || talkActionsRemaining === 0

  return (
    <div className="min-h-screen px-4 py-4">
      <CombinationDiscovery />
      <FakeRevealModal />
      {showNotes && <InvestigationNotes onClose={() => setShowNotes(false)} />}
      {showMoveModal && <RoomMoveModal onClose={() => setShowMoveModal(false)} />}

      <div className="max-w-4xl mx-auto">
        {/* 上部バー: タイトル + アクション + ボタン群 */}
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h1 className="font-display text-xl text-gothic-gold tracking-widest">探索フェーズ</h1>
          <div className="flex items-center gap-3">
            <ActionCounter
              actionsRemaining={actionsRemaining}
              actionsTotal={diffCfg.actions}
              talkActionsRemaining={talkActionsRemaining}
              talkActionsTotal={diffCfg.talkActions}
            />
            <button
              onClick={() => setShowNotes(true)}
              className="border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted hover:text-gothic-text font-serif text-xs py-2 px-3 transition-all"
            >
              捜査メモ
            </button>
            <button
              onClick={() => setShowMoveModal(true)}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display text-xs tracking-widest py-2 px-4 transition-all hover:shadow-[0_0_12px_rgba(217,119,6,0.3)]"
            >
              移動
            </button>
          </div>
        </div>

        {/* メインビジュアルエリア */}
        {currentRoomId ? (
          <RoomView roomId={currentRoomId} />
        ) : (
          /* 初期状態: 館背景を表示 */
          <div
            className="relative w-full border border-gothic-border overflow-hidden"
            style={{ aspectRatio: '16 / 9' }}
          >
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
          </div>
        )}

        {/* 議論フェーズへ進むボタン */}
        {canProceed && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setPhase('discussion')}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-10 text-sm transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
            >
              議論フェーズへ進む
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
