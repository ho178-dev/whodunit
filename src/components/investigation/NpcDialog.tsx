// 捜査フェーズで部屋内の容疑者に話しかけ、証言を順番に聞き出すコンポーネント
// アドベンチャーゲーム風に、キャラクターを左右に配置しダイアログを下部に表示する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { DialogBox } from '../shared/DialogBox'
import { CharacterCard } from '../shared/CharacterCard'
import { cn } from '../../utils/cn'
import { SuspectProfileFields } from '../shared/SuspectProfileFields'
import type { Suspect } from '../../types/scenario'

interface NpcDialogProps {
  roomId: string
  /** 2名表示時の左右均等パディング（ボタンパネルとの重なりを避けるために調整）。デフォルトは 'px-6 sm:px-12' */
  twoCharInset?: string
}

// 容疑者の詳細情報をモーダル表示するコンポーネント
function SuspectDetailModal({ suspect, onClose }: { suspect: Suspect; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-sm border border-gothic-gold bg-gothic-panel shadow-[0_0_40px_rgba(217,119,6,0.4)] animate-fade-in">
        <div className="border-b border-gothic-gold px-6 py-4 text-center">
          <h2 className="font-display text-gothic-gold text-lg tracking-widest">{suspect.name}</h2>
          <p className="text-gothic-muted font-serif text-xs mt-1">
            {suspect.age}歳・{suspect.occupation}
          </p>
        </div>
        <div className="px-6 py-4">
          <SuspectProfileFields suspect={suspect} />
        </div>
        <div className="px-6 pb-5 flex justify-end border-t border-gothic-border pt-4">
          <button
            onClick={onClose}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-2 px-6 text-sm transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

// 部屋内のキャラクター配置（最大2名左右）とダイアログを統合表示するコンポーネント
export function NpcDialog({ roomId, twoCharInset }: NpcDialogProps) {
  const {
    scenario,
    talkedSuspectIds,
    talkToSuspect,
    talkActionsRemaining,
    hearStatement,
    viewSuspectProfile,
  } = useGameStore()
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null)
  const [dialogIndex, setDialogIndex] = useState(0)
  const [detailSuspect, setDetailSuspect] = useState<Suspect | null>(null)

  if (!scenario) return null

  const suspectsHere = scenario.suspects.filter((s) => s.room_id === roomId)
  const currentSuspect = selectedSuspect
    ? scenario.suspects.find((s) => s.id === selectedSuspect)
    : null

  const handleTalk = (suspect: (typeof scenario.suspects)[number]) => {
    if (talkActionsRemaining <= 0) return
    setSelectedSuspect(suspect.id)
    setDialogIndex(0)
    if (!talkedSuspectIds.includes(suspect.id)) {
      talkToSuspect(suspect.id)
    }
    hearStatement({
      suspectId: suspect.id,
      suspectName: suspect.name,
      index: -1,
      text: suspect.investigation_dialog.greeting,
    })
  }

  const handleNext = () => {
    if (!currentSuspect) return
    const nextIndex = dialogIndex + 1
    const statementIndex = nextIndex - 1
    if (statementIndex >= currentSuspect.investigation_dialog.statements.length) return
    if (talkActionsRemaining <= 0) return

    setDialogIndex(nextIndex)
    hearStatement({
      suspectId: currentSuspect.id,
      suspectName: currentSuspect.name,
      index: statementIndex,
      text: currentSuspect.investigation_dialog.statements[statementIndex],
    })
  }

  const currentDialog = currentSuspect
    ? dialogIndex === 0
      ? currentSuspect.investigation_dialog.greeting
      : (currentSuspect.investigation_dialog.statements[dialogIndex - 1] ??
        currentSuspect.investigation_dialog.greeting)
    : null

  const canTalkMore = talkActionsRemaining > 0
  const hasMoreDialog = currentSuspect
    ? dialogIndex < currentSuspect.investigation_dialog.statements.length
    : false

  return (
    <>
      {detailSuspect && (
        <SuspectDetailModal suspect={detailSuspect} onClose={() => setDetailSuspect(null)} />
      )}

      {suspectsHere.length > 0 && (
        <div
          className={cn(
            'absolute inset-x-0 bottom-32 flex items-end gap-4',
            suspectsHere.length === 1
              ? 'justify-center px-6 sm:px-12'
              : cn('justify-between', twoCharInset ?? 'px-6 sm:px-12')
          )}
        >
          {suspectsHere.map((suspect) => (
            <div key={suspect.id} className="transition-all duration-300">
              <CharacterCard
                suspect={suspect}
                portrait
                selected={suspect.id === selectedSuspect}
                onClick={
                  canTalkMore || talkedSuspectIds.includes(suspect.id)
                    ? () => handleTalk(suspect)
                    : undefined
                }
                onNameClick={() => {
                  setDetailSuspect(suspect)
                  viewSuspectProfile(suspect.id)
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3">
        {currentSuspect && currentDialog ? (
          <div className="relative">
            <DialogBox
              text={currentDialog}
              speakerName={currentSuspect.name}
              className="bg-gothic-panel/85 backdrop-blur-sm"
              onComplete={() => {}}
            />
            {hasMoreDialog && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                disabled={!canTalkMore}
                className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors disabled:opacity-40"
              >
                続きを聞く →{!canTalkMore && '（会話回数上限）'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border p-4">
            {suspectsHere.length > 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center">
                {canTalkMore ? '人物をクリックして話しかける' : '会話回数の上限に達しました'}
              </p>
            ) : (
              <p className="text-gothic-muted font-serif text-sm text-center">
                この場所には誰もいない
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
