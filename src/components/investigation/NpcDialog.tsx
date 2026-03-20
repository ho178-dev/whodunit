import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { DialogBox } from '../shared/DialogBox'
import { CharacterCard } from '../shared/CharacterCard'
import { cn } from '../../utils/cn'

interface NpcDialogProps {
  roomId: string
}

export function NpcDialog({ roomId }: NpcDialogProps) {
  const { scenario, talkedSuspectIds, talkToSuspect, consumeAction, actionsRemaining } = useGameStore()
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null)
  const [dialogIndex, setDialogIndex] = useState(0)

  if (!scenario) return null

  // この部屋にいる容疑者（部屋ランダム割り当てはないので全員が各部屋にいる想定）
  // 実際は全容疑者が館内を歩いているという設定で、1部屋に1-2人割り当て
  // 簡略化：現在選択中の部屋IDのhash値で容疑者を割り当て
  const roomIndex = scenario.rooms.findIndex((r) => r.id === roomId)
  const suspectsHere = scenario.suspects.slice(roomIndex % 2, roomIndex % 2 + 2)

  const currentSuspect = selectedSuspect ? scenario.suspects.find((s) => s.id === selectedSuspect) : null

  const handleTalk = (suspectId: string) => {
    if (actionsRemaining > 0) {
      setSelectedSuspect(suspectId)
      setDialogIndex(0)
      if (!talkedSuspectIds.includes(suspectId)) {
        talkToSuspect(suspectId)
        consumeAction()
      }
    }
  }

  const currentDialog = currentSuspect
    ? dialogIndex === 0
      ? currentSuspect.investigation_dialog.greeting
      : currentSuspect.investigation_dialog.statements[dialogIndex - 1] ?? currentSuspect.investigation_dialog.greeting
    : null

  return (
    <div>
      <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-3">この場所にいる人物</h4>
      <div className="flex gap-2 mb-4">
        {suspectsHere.map((suspect) => (
          <button
            key={suspect.id}
            onClick={() => handleTalk(suspect.id)}
            className={cn(
              'text-left border transition-all',
              suspect.id === selectedSuspect ? 'border-gothic-gold' : 'border-gothic-border hover:border-gothic-accent'
            )}
          >
            <CharacterCard suspect={suspect} small />
          </button>
        ))}
      </div>

      {currentSuspect && currentDialog && (
        <div>
          <DialogBox
            text={currentDialog}
            speakerName={currentSuspect.name}
            onComplete={() => {}}
          />
          {dialogIndex < currentSuspect.investigation_dialog.statements.length && (
            <button
              onClick={() => setDialogIndex((i) => Math.min(i + 1, currentSuspect.investigation_dialog.statements.length))}
              className="mt-2 text-gothic-muted text-xs font-serif hover:text-gothic-text transition-colors"
            >
              続きを聞く →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
