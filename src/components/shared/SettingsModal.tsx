// 設定モーダル。セーブ・表示・音声・画面サイズの設定を統合する
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
const TAB_BASE = 'flex-1 py-2.5 font-display text-xs tracking-widest transition-colors'
const TAB_ACTIVE = 'text-gothic-gold border-b-2 border-gothic-gold -mb-px'
const TAB_INACTIVE = 'text-gothic-muted hover:text-gothic-text'

const TEXT_SPEED_OPTIONS: { key: TextSpeed; label: string }[] = [
  { key: 'slow', label: 'ゆっくり' },
  { key: 'normal', label: '普通' },
  { key: 'fast', label: '速い' },
]

// セーブ・表示・音声・画面サイズの設定を1つのモーダルにまとめたコンポーネント
export function SettingsModal({ onClose, showSave }: Props) {
  const manualSave = useGameStore((s) => s.manualSave)
  const loadSaveSlot = useGameStore((s) => s.loadSaveSlot)
  const setPhase = useGameStore((s) => s.setPhase)
  const { bgmVolume, seVolume, setBgmVolume, setSeVolume } = useAudioStore()
  const { skipInterlude, textSpeed, setSkipInterlude } = useSettingsStore()
  const [allSlots] = useState(getAllSlots)
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
              {/* セーブ/ロード切り替えタブ */}
              <div className="flex border border-gothic-border mb-4">
                <button
                  onClick={() => setSaveSubMode('save')}
                  className={cn(
                    'flex-1 py-1.5 font-display text-xs tracking-widest transition-colors',
                    saveSubMode === 'save'
                      ? 'bg-gothic-panel text-gothic-gold'
                      : 'text-gothic-muted hover:text-gothic-text'
                  )}
                >
                  セーブ
                </button>
                <button
                  onClick={() => setSaveSubMode('load')}
                  className={cn(
                    'flex-1 py-1.5 font-display text-xs tracking-widest transition-colors border-l border-gothic-border',
                    saveSubMode === 'load'
                      ? 'bg-gothic-panel text-gothic-gold'
                      : 'text-gothic-muted hover:text-gothic-text'
                  )}
                >
                  ロード
                </button>
              </div>

              {saveSubMode === 'save' ? (
                savedIndex !== null ? (
                  <div className="h-[156px] flex items-center justify-center">
                    <p className="text-gothic-gold font-serif text-sm text-center">
                      保存しました（手動 {savedIndex}）
                    </p>
                  </div>
                ) : (
                  <div className="h-[156px] overflow-y-auto">
                    <SaveSlotList
                      slots={slots}
                      onSelect={handleSave}
                      mode="save"
                      baseSlotIndex={1}
                    />
                  </div>
                )
              ) : (
                <div className="h-[156px] overflow-y-auto">
                  <SaveSlotList
                    slots={allSlots}
                    onSelect={handleLoad}
                    mode="load"
                    baseSlotIndex={0}
                  />
                </div>
              )}
            </>
          )}

          {tab === 'view' && (
            <div className="space-y-6">
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
                      'absolute top-0.5 w-5 h-5 rounded-full bg-gothic-bg transition-transform duration-200',
                      skipInterlude ? 'translate-x-6' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* テキスト速度（タイプライター演出実装まで無効） */}
              <div className="opacity-40">
                <p className="font-display text-xs text-gothic-muted tracking-widest mb-1">
                  テキスト速度
                </p>
                <p className="font-serif text-[10px] text-gothic-muted/60 mb-3">
                  ※ タイプライター演出実装後に有効化されます
                </p>
                <div className="flex gap-2">
                  {TEXT_SPEED_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      disabled
                      className={cn(
                        'flex-1 border py-2 font-display text-xs tracking-widest transition-all',
                        textSpeed === key
                          ? 'border-gothic-gold text-gothic-gold bg-gothic-panel'
                          : 'border-gothic-border text-gothic-muted'
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
            <div className="space-y-6">
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
        <div className="border-t border-gothic-border px-6 pb-5 pt-4 space-y-2">
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
            <>
              <button
                onClick={() => setShowTitleConfirm(true)}
                className="w-full border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 transition-all duration-200 hover:border-gothic-gold hover:text-gothic-gold"
              >
                タイトルへ戻る
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => window.electronAPI?.windowControls.minimize()}
                  className="flex-1 border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 transition-all duration-200 hover:border-gothic-accent hover:text-gothic-text"
                >
                  最小化
                </button>
                <button
                  onClick={() => window.electronAPI?.windowControls.quit()}
                  className="flex-1 border border-red-900/60 bg-transparent text-red-400/70 font-serif text-xs py-2 transition-all duration-200 hover:border-red-700 hover:text-red-400"
                >
                  ゲームを終了
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 transition-all duration-200 hover:border-gothic-accent"
              >
                閉じる
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
