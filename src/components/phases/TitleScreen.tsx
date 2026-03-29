// タイトル画面。シナリオ選択・続きから・設定への起動経路を提供するコンポーネント
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getAllSlots, deleteSlot } from '../../utils/saveLoad'
import { SaveSlotList } from '../shared/SaveSlotList'
import { MansionSceneBackground } from '../shared/MansionBackground'
import type { SaveSlot } from '../../types/save'
import { isTrialMode } from '../../constants/salesConfig'
import { FIXED_SCENARIO } from '../../constants/fixedScenario'

// タイトル画面を表示し、シナリオ選択・続きから・設定への経路を分岐するコンポーネント
export function TitleScreen() {
  const { setPhase, loadSaveSlot, setScenario, setUseFixedScenario, setActiveSaveSlot } =
    useGameStore()
  const [showContinue, setShowContinue] = useState(false)
  const [slots, setSlots] = useState<SaveSlot[]>(() => getAllSlots())

  const hasSave = slots.some((s) => s !== null)
  const trial = isTrialMode()

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

  // 体験版：シナリオ選択をスキップして固定シナリオ1へ直接遷移する
  const handleStartTrial = () => {
    setActiveSaveSlot(0)
    setScenario(FIXED_SCENARIO)
    setUseFixedScenario(true)
    setPhase('scenario_briefing')
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 館背景 */}
      <MansionSceneBackground phase="title" fixed />

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
              onClick={trial ? handleStartTrial : () => setPhase('scenario_select')}
              className="w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-4 px-8 transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
            >
              シナリオを選ぶ
              <span className="block text-xs text-gothic-muted mt-1 font-serif">
                {trial ? '体験版シナリオ・ネタバレなし' : '全3本・ネタバレなし'}
              </span>
            </button>

            {/* 設定（AI生成の導線）：体験版でも設定画面からアクセス可能 */}
            <button
              onClick={() => setPhase('api_key_input')}
              className="w-full border border-gothic-border bg-transparent text-gothic-muted font-serif text-xs py-2 px-8 transition-all duration-200 hover:border-gothic-accent"
            >
              設定
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
