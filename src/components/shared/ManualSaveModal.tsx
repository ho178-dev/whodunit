// 手動セーブモーダル。スロット1〜3からセーブ先を選択して保存する
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getManualSlots } from '../../utils/saveLoad'
import { SaveSlotList } from './SaveSlotList'

// 保存完了メッセージの表示時間（ms）
const SAVE_CONFIRM_DURATION_MS = 1200

interface Props {
  onClose: () => void
}

// 手動セーブスロット（1〜3）を表示し、選択したスロットに保存する
export function ManualSaveModal({ onClose }: Props) {
  const manualSave = useGameStore((s) => s.manualSave)
  const [slots] = useState(getManualSlots)
  const [savedIndex, setSavedIndex] = useState<number | null>(null)

  // 保存成功メッセージを表示後に自動クローズする
  useEffect(() => {
    if (savedIndex === null) return
    const id = setTimeout(onClose, SAVE_CONFIRM_DURATION_MS)
    return () => clearTimeout(id)
  }, [savedIndex, onClose])

  const handleSelect = (slotIndex: number) => {
    manualSave(slotIndex)
    setSavedIndex(slotIndex)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md mx-4 border border-gothic-gold/50 bg-gothic-bg px-6 py-6">
        <div className="text-center mb-5">
          <p className="text-gothic-muted font-serif text-xs tracking-widest">
            ― セーブ先を選んでください ―
          </p>
        </div>

        {savedIndex !== null ? (
          <p className="text-gothic-gold font-serif text-sm text-center py-4">
            保存しました（手動 {savedIndex}）
          </p>
        ) : (
          <>
            <SaveSlotList slots={slots} onSelect={handleSelect} mode="save" baseSlotIndex={1} />

            <button
              onClick={onClose}
              className="w-full mt-4 border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 px-8 transition-all duration-200 hover:border-gothic-accent"
            >
              キャンセル
            </button>
          </>
        )}
      </div>
    </div>
  )
}
