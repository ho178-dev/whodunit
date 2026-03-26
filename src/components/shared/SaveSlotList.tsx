// セーブスロット一覧表示コンポーネント（続きから/手動セーブの両用途に使用）
import type { SaveSlot } from '../../types/save'
import { PHASE_DISPLAY } from '../../constants/phaseConfig'

interface Props {
  slots: SaveSlot[]
  /** スロット選択時のコールバック。実際のスロット番号（baseSlotIndex + 配列インデックス）を渡す */
  onSelect: (index: number) => void
  /** スロット削除時のコールバック（省略時は削除ボタン非表示） */
  onDelete?: (index: number) => void
  /** 'load': 空スロットはクリック不可（デフォルト）。'save': 空スロットもクリック可 */
  mode?: 'load' | 'save'
  /** 配列インデックスに加算して実際のスロット番号を算出するオフセット（デフォルト 0） */
  baseSlotIndex?: number
}

// セーブスロット一覧を表示する
export function SaveSlotList({
  slots,
  onSelect,
  onDelete,
  mode = 'load',
  baseSlotIndex = 0,
}: Props) {
  return (
    <div className="space-y-2">
      {slots.map((slot, index) => {
        const actualIndex = baseSlotIndex + index
        const isAutoSave = actualIndex === 0
        const slotLabel = isAutoSave ? 'オートセーブ' : `手動 ${actualIndex}`
        const isClickable = mode === 'save' || slot !== null

        return (
          <div key={actualIndex} className="flex items-stretch gap-2">
            <button
              onClick={() => isClickable && onSelect(actualIndex)}
              disabled={!isClickable}
              className={[
                'flex-1 border text-left px-4 py-3 font-serif transition-all duration-200',
                isClickable
                  ? 'border-gothic-gold bg-gothic-panel hover:bg-stone-800 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] cursor-pointer'
                  : 'border-gothic-border bg-gothic-panel/50 cursor-default opacity-50',
              ].join(' ')}
            >
              {slot ? (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gothic-gold font-display tracking-wider text-sm">
                      {slot.scenarioTitle}
                    </span>
                    <span className="text-gothic-muted text-xs shrink-0">{slotLabel}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gothic-muted text-xs">
                      {PHASE_DISPLAY[slot.phase] ?? slot.phase}
                    </span>
                    <span className="text-gothic-border text-xs">·</span>
                    <span className="text-gothic-muted text-xs">
                      {new Date(slot.savedAt).toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-gothic-border text-xs">·</span>
                    <span className="text-gothic-muted text-xs">{slot.difficulty}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-gothic-muted font-serif text-sm">
                    {mode === 'save' ? '— ここに保存 —' : '空きスロット'}
                  </span>
                  <span className="text-gothic-muted text-xs">{slotLabel}</span>
                </div>
              )}
            </button>

            {/* 削除ボタン（データがある場合のみ表示） */}
            {onDelete && slot && (
              <button
                onClick={() => onDelete(actualIndex)}
                className="border border-gothic-border bg-gothic-panel hover:border-red-900 hover:text-red-700 text-gothic-muted text-xs px-3 transition-all duration-200"
                title="このセーブを削除"
              >
                ×
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
