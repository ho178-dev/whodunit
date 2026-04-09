// 設定画面。セーブ・表示・音声・画面サイズの設定を統合する（全画面表示）
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useAudioStore } from '../../stores/audioStore'
import { useSettingsStore } from '../../stores/settingsStore'
import type { TextSpeed } from '../../stores/settingsStore'
import { getAllSlots } from '../../utils/saveLoad'
import { SaveSlotList } from './SaveSlotList'
import { cn } from '../../utils/cn'
import { GAME_BASE_WIDTH, GAME_BASE_HEIGHT } from '../../constants/gameConfig'

// 画面サイズのプリセット（exe想定: GAME_BASE がデフォルト起動サイズ）
const SCREEN_SIZES = [
  {
    label: `${GAME_BASE_WIDTH} × ${GAME_BASE_HEIGHT}`,
    width: GAME_BASE_WIDTH,
    height: GAME_BASE_HEIGHT,
  },
  { label: '1280 × 720', width: 1280, height: 720 },
  { label: '1600 × 900', width: 1600, height: 900 },
  { label: '1920 × 1080', width: 1920, height: 1080 },
] as const

const SCREEN_SIZE_KEY = 'whodunit_screen_size'
const SAVE_CONFIRM_DURATION_MS = 1200

type Tab = 'save' | 'view' | 'audio' | 'display'

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
const TAB_BASE =
  'px-5 py-3 font-display text-xs tracking-widest transition-colors whitespace-nowrap border-b-2'
const TAB_ACTIVE = 'text-gothic-gold border-gothic-gold'
const TAB_INACTIVE = 'text-gothic-muted border-transparent hover:text-gothic-text'

// セーブ/ロードサブモードボタンの共通スタイル
const SUB_BTN_BASE = 'flex-1 py-1.5 font-display text-xs tracking-widest transition-colors'
const SUB_BTN_ACTIVE = 'bg-gothic-panel text-gothic-gold'
const SUB_BTN_INACTIVE = 'text-gothic-muted hover:text-gothic-text'

const TEXT_SPEED_OPTIONS: { key: TextSpeed; label: string }[] = [
  { key: 'slow', label: 'ゆっくり' },
  { key: 'normal', label: '普通' },
  { key: 'fast', label: '速い' },
]

// セーブ・表示・音声・画面サイズの設定を全画面で表示するコンポーネント
export function SettingsModal({ onClose, showSave }: Props) {
  const manualSave = useGameStore((s) => s.manualSave)
  const loadSaveSlot = useGameStore((s) => s.loadSaveSlot)
  const setPhase = useGameStore((s) => s.setPhase)
  const { bgmVolume, seVolume, setBgmVolume, setSeVolume } = useAudioStore()
  const { skipInterlude, textSpeed, setSkipInterlude, setTextSpeed } = useSettingsStore()
  const allSlots = getAllSlots()
  const slots = allSlots.slice(1)
  const [savedIndex, setSavedIndex] = useState<number | null>(null)
  const [saveSubMode, setSaveSubMode] = useState<'save' | 'load'>('save')
  const [tab, setTab] = useState<Tab>(showSave ? 'save' : 'view')
  const [selectedSize, setSelectedSize] = useState<{ width: number; height: number } | null>(
    loadScreenSize
  )
  const [showTitleConfirm, setShowTitleConfirm] = useState(false)

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

  const handleLoad = (slotIndex: number) => {
    loadSaveSlot(slotIndex)
    onClose()
  }

  const handleGoToTitle = () => {
    setPhase('title')
    onClose()
  }

  const handleSizeSelect = (width: number, height: number) => {
    setSelectedSize({ width, height })
    applyScreenSize(width, height)
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    ...(showSave ? [{ id: 'save' as Tab, label: 'セーブ' }] : []),
    { id: 'view', label: '表示' },
    { id: 'audio', label: '音声' },
    { id: 'display', label: '画面サイズ' },
  ]

  return (
    <div className="h-full flex flex-col bg-gothic-bg">
      {/* ヘッダー */}
      <div className="border-b border-gothic-border px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="text-gothic-muted hover:text-gothic-text font-serif text-xs border border-gothic-border px-3 py-1.5 hover:border-gothic-accent transition-all"
        >
          ← 戻る
        </button>
        <h2 className="font-display text-gothic-gold tracking-widest text-sm">設定</h2>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gothic-border flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-8 py-8">
          {tab === 'save' && showSave && (
            <>
              {/* セーブ/ロード切り替えタブ */}
              <div className="flex border border-gothic-border mb-6">
                <button
                  onClick={() => setSaveSubMode('save')}
                  className={cn(
                    SUB_BTN_BASE,
                    saveSubMode === 'save' ? SUB_BTN_ACTIVE : SUB_BTN_INACTIVE
                  )}
                >
                  セーブ
                </button>
                <button
                  onClick={() => setSaveSubMode('load')}
                  className={cn(
                    SUB_BTN_BASE,
                    'border-l border-gothic-border',
                    saveSubMode === 'load' ? SUB_BTN_ACTIVE : SUB_BTN_INACTIVE
                  )}
                >
                  ロード
                </button>
              </div>

              {saveSubMode === 'save' ? (
                savedIndex !== null ? (
                  <div className="py-12 flex items-center justify-center">
                    <p className="text-gothic-gold font-serif text-sm text-center">
                      保存しました（手動 {savedIndex}）
                    </p>
                  </div>
                ) : (
                  <SaveSlotList slots={slots} onSelect={handleSave} mode="save" baseSlotIndex={1} />
                )
              ) : (
                <SaveSlotList
                  slots={allSlots}
                  onSelect={handleLoad}
                  mode="load"
                  baseSlotIndex={0}
                />
              )}
            </>
          )}

          {tab === 'view' && (
            <div className="space-y-8">
              {/* 幕間スキップ */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-xs text-gothic-muted tracking-widest mb-0.5">
                    幕間スキップ
                  </p>
                  <p className="font-serif text-[10px] text-gothic-muted/60">
                    フェーズ切り替え時の演出をスキップする
                  </p>
                </div>
                <button
                  onClick={() => setSkipInterlude(!skipInterlude)}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
                    skipInterlude ? 'bg-gothic-gold' : 'bg-gothic-border'
                  )}
                  role="switch"
                  aria-checked={skipInterlude}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                      skipInterlude ? 'translate-x-6' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* テキスト速度 */}
              <div>
                <p className="font-display text-xs text-gothic-muted tracking-widest mb-3">
                  テキスト速度
                </p>
                <div className="flex gap-2">
                  {TEXT_SPEED_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTextSpeed(key)}
                      className={cn(
                        'flex-1 border py-2.5 font-display text-xs tracking-widest transition-all',
                        textSpeed === key
                          ? 'border-gothic-gold text-gothic-gold bg-gothic-panel'
                          : 'border-gothic-border text-gothic-muted hover:border-gothic-accent hover:text-gothic-text'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'audio' && (
            <div className="space-y-8">
              {/* BGM音量 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-display text-xs text-gothic-muted tracking-widest">
                    BGM
                  </label>
                  <span className="font-serif text-xs text-gothic-text">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(bgmVolume * 100)}
                  onChange={(e) => setBgmVolume(Number(e.target.value) / 100)}
                  className="w-full accent-gothic-gold"
                />
              </div>
              {/* SE音量 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-display text-xs text-gothic-muted tracking-widest">
                    SE
                  </label>
                  <span className="font-serif text-xs text-gothic-text">
                    {Math.round(seVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(seVolume * 100)}
                  onChange={(e) => setSeVolume(Number(e.target.value) / 100)}
                  className="w-full accent-gothic-gold"
                />
              </div>
            </div>
          )}

          {tab === 'display' && (
            <>
              <p className="text-gothic-muted font-serif text-xs tracking-widest text-center mb-6">
                ― 画面サイズを選んでください ―
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SCREEN_SIZES.map(({ label, width, height }) => {
                  const isActive = selectedSize?.width === width && selectedSize?.height === height
                  return (
                    <button
                      key={label}
                      onClick={() => handleSizeSelect(width, height)}
                      className={cn(
                        'border px-4 py-4 font-display text-sm tracking-wider transition-all duration-200 text-left',
                        isActive
                          ? 'border-gothic-gold text-gothic-gold bg-gothic-panel shadow-[0_0_12px_rgba(217,119,6,0.3)]'
                          : 'border-gothic-border text-gothic-muted bg-gothic-panel hover:border-gothic-accent hover:text-gothic-text'
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <span>{label}</span>
                        {isActive && <span className="text-gothic-gold text-xs">✓</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="border-t border-gothic-border px-8 py-4 flex-shrink-0 space-y-2">
        {showTitleConfirm ? (
          <div className="border border-gothic-border bg-gothic-panel/60 px-4 py-3 space-y-2">
            <p className="text-gothic-muted font-serif text-xs text-center">
              タイトルに戻りますか？（未セーブの進行は失われます）
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleGoToTitle}
                className="flex-1 border border-gothic-gold bg-transparent text-gothic-gold font-serif text-xs py-2 transition-all duration-200 hover:bg-gothic-gold/10"
              >
                戻る
              </button>
              <button
                onClick={() => setShowTitleConfirm(false)}
                className="flex-1 border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 transition-all duration-200 hover:border-gothic-accent"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setShowTitleConfirm(true)}
              className="flex-1 border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 transition-all duration-200 hover:border-gothic-gold hover:text-gothic-gold"
            >
              タイトルへ戻る
            </button>
            <button
              onClick={() => window.electronAPI?.windowControls.quit()}
              className="flex-1 border border-red-900/60 bg-transparent text-red-400/70 font-serif text-xs py-2 transition-all duration-200 hover:border-red-700 hover:text-red-400"
            >
              ゲームを終了
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
