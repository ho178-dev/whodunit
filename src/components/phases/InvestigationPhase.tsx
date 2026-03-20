// 捜査フェーズの画面。部屋選択・証拠収集・容疑者との会話・メモ閲覧を管理する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { RoomSelector } from '../investigation/RoomSelector'
import { RoomView } from '../investigation/RoomView'
import { ActionCounter } from '../investigation/ActionCounter'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'

export function InvestigationPhase() {
  const {
    scenario,
    currentRoomId,
    actionsRemaining,
    talkActionsRemaining,
    difficulty,
    setPhase,
    discoveredEvidenceIds,
  } = useGameStore()
  const diffCfg = DIFFICULTY_CONFIG[difficulty]
  const [showNotes, setShowNotes] = useState(false)

  if (!scenario) return null

  // いずれかのアクションプールが尽きた場合もソフトロック防止のため進行を許可する
  const canProceed =
    discoveredEvidenceIds.length > 0 || actionsRemaining === 0 || talkActionsRemaining === 0

  return (
    <div className="min-h-screen px-4 py-8">
      {showNotes && <InvestigationNotes onClose={() => setShowNotes(false)} />}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-gothic-gold tracking-widest">探索フェーズ</h1>
          <ActionCounter
            actionsRemaining={actionsRemaining}
            actionsTotal={diffCfg.actions}
            talkActionsRemaining={talkActionsRemaining}
            talkActionsTotal={diffCfg.talkActions}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <RoomSelector />
            <button
              onClick={() => setShowNotes(true)}
              className="w-full border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted hover:text-gothic-text font-serif text-sm py-3 px-4 transition-all text-left"
            >
              📋 操作メモを開く
            </button>
          </div>
          <div className="lg:col-span-2">
            {currentRoomId ? (
              <RoomView roomId={currentRoomId} />
            ) : (
              <GothicPanel>
                <p className="text-gothic-muted font-serif text-center py-8">
                  部屋を選択して調査を開始してください
                </p>
              </GothicPanel>
            )}
          </div>
        </div>

        {canProceed && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setPhase('discussion')}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-12 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
            >
              議論フェーズへ進む
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
