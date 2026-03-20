import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { DialogBox } from '../shared/DialogBox'
import { CharacterCard } from '../shared/CharacterCard'
import { cn } from '../../utils/cn'

interface NpcDialogProps {
  roomId: string
}

export function NpcDialog({ roomId }: NpcDialogProps) {
  const {
    scenario,
    talkedSuspectIds, talkToSuspect,
    talkActionsRemaining, hearStatement,
  } = useGameStore()
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null)
  const [dialogIndex, setDialogIndex] = useState(0)

  if (!scenario) return null

  const suspectsHere = scenario.suspects.filter((s) => s.room_id === roomId)
  const currentSuspect = selectedSuspect ? scenario.suspects.find((s) => s.id === selectedSuspect) : null

  const handleTalk = (suspect: typeof scenario.suspects[number]) => {
    if (talkActionsRemaining <= 0) return
    setSelectedSuspect(suspect.id)
    setDialogIndex(0)
    // 初回のみ talkedSuspectIds に記録（調査アクションは消費しない）
    if (!talkedSuspectIds.includes(suspect.id)) {
      talkToSuspect(suspect.id)
    }
    // 挨拶が未聴なら消費・記録（既聴なら no-op）
    hearStatement({ suspectId: suspect.id, suspectName: suspect.name, index: -1, text: suspect.investigation_dialog.greeting })
  }

  const handleNext = () => {
    if (!currentSuspect) return
    const nextIndex = dialogIndex + 1
    const statementIndex = nextIndex - 1  // statements配列のインデックス（dialogIndex 0 = 挨拶）
    if (statementIndex >= currentSuspect.investigation_dialog.statements.length) return
    if (talkActionsRemaining <= 0) return

    setDialogIndex(nextIndex)
    // 未聴なら消費・記録（既聴なら no-op）
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
      : currentSuspect.investigation_dialog.statements[dialogIndex - 1] ?? currentSuspect.investigation_dialog.greeting  // dialogIndex 1以上 = statements[dialogIndex-1]
    : null

  const canTalkMore = talkActionsRemaining > 0
  const hasMoreDialog = currentSuspect
    ? dialogIndex < currentSuspect.investigation_dialog.statements.length
    : false

  return (
    <div>
      <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-3">この場所にいる人物</h4>
      {suspectsHere.length === 0 ? (
        <p className="text-gothic-muted font-serif text-sm">この場所には誰もいない</p>
      ) : (
        <div className="flex gap-2 mb-4">
          {suspectsHere.map((suspect) => (
            <button
              key={suspect.id}
              onClick={() => handleTalk(suspect)}
              disabled={!canTalkMore && !talkedSuspectIds.includes(suspect.id)}
              className={cn(
                'text-left border transition-all disabled:opacity-40',
                suspect.id === selectedSuspect ? 'border-gothic-gold' : 'border-gothic-border hover:border-gothic-accent'
              )}
            >
              <CharacterCard suspect={suspect} small />
            </button>
          ))}
        </div>
      )}

      {currentSuspect && currentDialog && (
        <div>
          <div className="mb-3 p-3 bg-stone-900 border border-gothic-border text-xs font-serif space-y-1">
            <p className="text-gothic-muted">
              <span className="text-gothic-gold">関係：</span>{currentSuspect.relationship_to_victim}
            </p>
            <p className="text-gothic-muted">
              <span className="text-gothic-gold">アリバイ：</span>{currentSuspect.alibi}
            </p>
          </div>
          <DialogBox
            text={currentDialog}
            speakerName={currentSuspect.name}
            onComplete={() => {}}
          />
          {hasMoreDialog && (
            <button
              onClick={handleNext}
              disabled={!canTalkMore}
              className="mt-2 text-gothic-muted text-xs font-serif hover:text-gothic-text transition-colors disabled:opacity-40"
            >
              続きを聞く → {!canTalkMore && '（会話回数上限）'}
            </button>
          )}
        </div>
      )}

      {!canTalkMore && suspectsHere.length > 0 && !currentSuspect && (
        <p className="text-gothic-muted font-serif text-xs mt-2">会話回数の上限に達しました</p>
      )}
    </div>
  )
}
