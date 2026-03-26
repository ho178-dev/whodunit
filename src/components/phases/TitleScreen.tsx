// ゲームのタイトル画面。固定シナリオ選択またはAI生成シナリオへの起動経路を分岐するコンポーネント
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getAllSlots, deleteSlot } from '../../utils/saveLoad'
import { SaveSlotList } from '../shared/SaveSlotList'
import type { SaveSlot } from '../../types/save'

// タイトル画面を表示し、固定シナリオ選択またはAI生成シナリオへの起動経路を分岐するコンポーネント
export function TitleScreen() {
  const { setPhase, loadSaveSlot } = useGameStore()
  const [showContinue, setShowContinue] = useState(false)
  const [slots, setSlots] = useState<SaveSlot[]>(() => getAllSlots())

  const hasSave = slots.some((s) => s !== null)

  // スロットを選択してゲームを復元する（loadSaveSlot が activeSaveSlot も設定する）
  const handleSelectSlot = (index: number) => {
    loadSaveSlot(index)
    setShowContinue(false)
  }

  // スロットを削除してリストをインプレース更新する
  const handleDeleteSlot = (index: number) => {
    deleteSlot(index)
    setSlots((prev) => prev.map((s, i) => (i === index ? null : s)))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.15)_0%,_transparent_70%)]" />

      <div className="relative z-10 text-center max-w-2xl">
        {/* ロゴ */}
        <div className="mb-2">
          <div className="inline-block border border-gothic-gold/50 px-8 py-1">
            <span className="font-display text-gothic-muted text-xs tracking-[0.5em]">
              MURDER MYSTERY
            </span>
          </div>
        </div>

        <h1 className="font-title text-5xl md:text-7xl text-gothic-gold mb-2 tracking-wider">
          WhoDuNiT
        </h1>

        <div className="border-t border-b border-gothic-border/50 py-4 mb-8">
          <p className="text-gothic-muted font-serif text-sm tracking-widest">
            ― 犯人は、この中にいる ―
          </p>
        </div>

        {/* 続きから（セーブデータがある場合のみ表示） */}
        {!showContinue ? (
          <div className="space-y-4">
            {hasSave && (
              <button
                onClick={() => {
                  setSlots(getAllSlots())
                  setShowContinue(true)
                }}
                className="w-full border border-gothic-gold bg-gothic-gold/10 hover:bg-gothic-gold/20 text-gothic-gold font-display tracking-widest py-4 px-8 transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]"
              >
                続きから
                <span className="block text-xs text-gothic-muted mt-1 font-serif">
                  セーブデータを選ぶ
                </span>
              </button>
            )}

            <button
              onClick={() => setPhase('scenario_select')}
              className="w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-8 transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
            >
              固定シナリオを選ぶ
              <span className="block text-xs text-gothic-muted mt-1 font-serif">
                全3本・ネタバレなし
              </span>
            </button>

            <button
              onClick={() => setPhase('api_key_input')}
              className="w-full border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted font-display tracking-widest py-3 px-8 transition-all duration-200 text-sm"
            >
              AIでシナリオ生成
              <span className="block text-xs mt-1 font-serif">Gemini APIキーが必要</span>
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gothic-muted font-serif text-xs tracking-widest mb-4">
              ― セーブデータを選んでください ―
            </p>
            <SaveSlotList slots={slots} onSelect={handleSelectSlot} onDelete={handleDeleteSlot} />
            <button
              onClick={() => setShowContinue(false)}
              className="w-full mt-4 border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 px-8 transition-all duration-200 hover:border-gothic-accent"
            >
              戻る
            </button>
          </div>
        )}

        <p className="mt-8 text-gothic-muted text-xs font-serif">一人用マーダーミステリー</p>
      </div>
    </div>
  )
}
