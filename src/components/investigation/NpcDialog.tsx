// 捜査フェーズで部屋内の容疑者に話しかけ、証言を順番に聞き出すコンポーネント
// アドベンチャーゲーム風に、キャラクターを左右に配置しダイアログを下部に表示する
import { useState, useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { DialogBox, type DialogBoxHandle } from '../shared/DialogBox'
import { CharacterCard } from '../shared/CharacterCard'
import { cn } from '../../utils/cn'

interface NpcDialogProps {
  roomId: string
  /** true のとき2名表示の左右インセットを右パネル幅に合わせて広げる */
  hasRightPanel?: boolean
}

// 部屋内のキャラクター配置（最大2名左右）とダイアログを統合表示するコンポーネント
export function NpcDialog({ roomId, hasRightPanel }: NpcDialogProps) {
  const {
    scenario,
    talkedSuspectIds,
    talkToSuspect,
    talkActionsRemaining,
    hearStatement,
    viewSuspectProfile,
    suspectTalkProgress,
    setSuspectTalkProgress,
  } = useGameStore()
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null)
  const [dialogIndex, setDialogIndex] = useState(0)
  const [dialogDone, setDialogDone] = useState(false)
  const dialogRef = useRef<DialogBoxHandle>(null)
  const dialogKey = `${selectedSuspect ?? ''}-${dialogIndex}`
  const [prevDialogKey, setPrevDialogKey] = useState(dialogKey)
  if (dialogKey !== prevDialogKey) {
    setPrevDialogKey(dialogKey)
    setDialogDone(false)
  }

  if (!scenario) return null

  const suspectsHere = scenario.suspects.filter((s) => s.room_id === roomId)
  const currentSuspect = selectedSuspect
    ? scenario.suspects.find((s) => s.id === selectedSuspect)
    : null

  const handleTalk = (suspect: (typeof scenario.suspects)[number]) => {
    if (talkActionsRemaining <= 0 && !talkedSuspectIds.includes(suspect.id)) return
    const savedIndex = suspectTalkProgress[suspect.id] ?? 0
    setSelectedSuspect(suspect.id)
    setDialogIndex(savedIndex)
    if (!talkedSuspectIds.includes(suspect.id)) {
      talkToSuspect(suspect.id)
      viewSuspectProfile(suspect.id)
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
    setSuspectTalkProgress(currentSuspect.id, nextIndex)
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
      {suspectsHere.length > 0 && (
        <div
          className={cn(
            'absolute inset-x-0 bottom-28 flex items-end gap-4',
            suspectsHere.length === 1
              ? 'justify-center px-6'
              : hasRightPanel
                ? 'justify-between px-40'
                : 'justify-between px-6'
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
              />
            </div>
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-2">
        {currentSuspect && currentDialog ? (
          <div className="relative">
            <DialogBox
              ref={dialogRef}
              text={currentDialog}
              speakerName={currentSuspect.name}
              className="bg-gothic-panel/85 backdrop-blur-sm"
              onComplete={() => setDialogDone(true)}
            />
            {/* タイプライタ中: クリックで全文表示 / 完了後: 続きへ進む（hasMoreDialogのとき） */}
            {(!dialogDone || hasMoreDialog) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!dialogDone) {
                    dialogRef.current?.skip()
                  } else {
                    handleNext()
                  }
                }}
                disabled={dialogDone && !canTalkMore}
                className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors disabled:opacity-40"
              >
                続きを聞く →{dialogDone && !canTalkMore && '（会話回数上限）'}
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
