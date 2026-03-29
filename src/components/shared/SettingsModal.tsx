// 設定モーダル。セーブスロット選択と画面サイズ変更を統合する
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getManualSlots } from '../../utils/saveLoad'
import { SaveSlotList } from './SaveSlotList'
import { cn } from '../../utils/cn'

// 画面サイズのプリセット（exe想定: 1280×720 / 1600×900 / 1920×1080）
const SCREEN_SIZES = [
  { label: '1280 × 720', width: 1280, height: 720 },
  { label: '1600 × 900', width: 1600, height: 900 },
  { label: '1920 × 1080', width: 1920, height: 1080 },
] as const

const SCREEN_SIZE_KEY = 'whodunit_screen_size'
const SAVE_CONFIRM_DURATION_MS = 1200

type Tab = 'save' | 'display'

interface Props {
  onClose: () => void
  /** trueのときセーブタブを表示する（固定シナリオかつセーブ可能フェーズのみ） */
  showSave: boolean
}

// 保存済み画面サイズ設定をlocalStorageから読み込む
function loadScreenSize(): { width: number; height: number } | null {
  try {
    const raw = localStorage.getItem(SCREEN_SIZE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { width: number; height: number }
  } catch {
    return null
  }
}

// 画面サイズをlocalStorageに保存してウィンドウをリサイズする（Electron専用。ブラウザでは無視）
function applyScreenSize(width: number, height: number) {
  localStorage.setItem(SCREEN_SIZE_KEY, JSON.stringify({ width, height }))
  try {
    window.resizeTo(width, height)
  } catch {
    // ブラウザのセキュリティ制限により失敗する場合は無視する
  }
}

// タブボタンの共通スタイル
const TAB_BASE = 'flex-1 py-2.5 font-display text-xs tracking-widest transition-colors'
const TAB_ACTIVE = 'text-gothic-gold border-b-2 border-gothic-gold -mb-px'
const TAB_INACTIVE = 'text-gothic-muted hover:text-gothic-text'

// セーブスロット選択と画面サイズ変更を1つのモーダルにまとめたコンポーネント
export function SettingsModal({ onClose, showSave }: Props) {
  const manualSave = useGameStore((s) => s.manualSave)
  const [slots] = useState(getManualSlots)
  const [savedIndex, setSavedIndex] = useState<number | null>(null)
  const [tab, setTab] = useState<Tab>(showSave ? 'save' : 'display')
  const [selectedSize, setSelectedSize] = useState<{ width: number; height: number } | null>(
    loadScreenSize
  )

  // 保存成功後に自動クローズ
  useEffect(() => {
    if (savedIndex === null) return
    const id = setTimeout(onClose, SAVE_CONFIRM_DURATION_MS)
    return () => clearTimeout(id)
  }, [savedIndex, onClose])

  const handleSave = (slotIndex: number) => {
    manualSave(slotIndex)
    setSavedIndex(slotIndex)
  }

  const handleSizeSelect = (width: number, height: number) => {
    setSelectedSize({ width, height })
    applyScreenSize(width, height)
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    ...(showSave ? [{ id: 'save' as Tab, label: 'セーブ' }] : []),
    { id: 'display', label: '画面サイズ' },
  ]

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md mx-4 border border-gothic-gold/50 bg-gothic-bg">
        {/* ヘッダー */}
        <div className="border-b border-gothic-border px-6 py-4 flex items-center justify-between">
          <p className="font-display text-gothic-gold tracking-widest text-sm">設定</p>
          <button
            onClick={onClose}
            className="text-gothic-muted hover:text-gothic-gold font-serif text-lg transition-colors leading-none"
          >
            ×
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gothic-border">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(TAB_BASE, tab === id ? TAB_ACTIVE : TAB_INACTIVE)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-5">
          {tab === 'save' && showSave && (
            <>
              <p className="text-gothic-muted font-serif text-xs tracking-widest text-center mb-4">
                ― セーブ先を選んでください ―
              </p>
              {savedIndex !== null ? (
                <p className="text-gothic-gold font-serif text-sm text-center py-4">
                  保存しました（手動 {savedIndex}）
                </p>
              ) : (
                <SaveSlotList slots={slots} onSelect={handleSave} mode="save" baseSlotIndex={1} />
              )}
            </>
          )}

          {tab === 'display' && (
            <>
              <p className="text-gothic-muted font-serif text-xs tracking-widest text-center mb-4">
                ― 画面サイズを選んでください ―
              </p>
              <div className="space-y-2">
                {SCREEN_SIZES.map(({ label, width, height }) => {
                  const isActive = selectedSize?.width === width && selectedSize?.height === height
                  return (
                    <button
                      key={label}
                      onClick={() => handleSizeSelect(width, height)}
                      className={cn(
                        'w-full border px-4 py-3 font-display text-sm tracking-wider transition-all duration-200 text-left',
                        isActive
                          ? 'border-gothic-gold text-gothic-gold bg-gothic-panel shadow-[0_0_12px_rgba(217,119,6,0.3)]'
                          : 'border-gothic-border text-gothic-muted bg-gothic-panel hover:border-gothic-accent hover:text-gothic-text'
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <span>{label}</span>
                        {isActive && <span className="text-gothic-gold text-xs">✓ 選択中</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="text-gothic-muted font-serif text-[10px] text-center mt-4">
                ※ exe版でウィンドウサイズを変更します
              </p>
            </>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-gothic-border px-6 pb-5 pt-4">
          <button
            onClick={onClose}
            className="w-full border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 transition-all duration-200 hover:border-gothic-accent"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
