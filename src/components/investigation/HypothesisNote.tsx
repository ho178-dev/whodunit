// 容疑者ごとに動機・機会・手段・自由メモを記述できる推理ノートコンポーネント
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import type { SuspectHypothesis } from '../../types/game'
import { isHypothesisFilled } from '../../types/game'
import { SuspectProfileFields } from '../shared/SuspectProfileFields'

// フォームフィールドの定義（テンプレート行）
const TEMPLATE_FIELDS: {
  key: keyof Omit<SuspectHypothesis, 'suspectId'>
  label: string
  hint: string
  rows: number
}[] = [
  {
    key: 'motive',
    label: '動機',
    hint: '例：遺産を狙っていた、秘密を暴かれそうだった…',
    rows: 2,
  },
  {
    key: 'opportunity',
    label: '機会',
    hint: '例：推定犯行時刻に単独行動していた、現場に近い部屋にいた…',
    rows: 2,
  },
  {
    key: 'means',
    label: '手段',
    hint: '例：〇〇の証拠を使って、△△という方法で…',
    rows: 2,
  },
  {
    key: 'notes',
    label: '自由メモ',
    hint: '気になる点、矛盾、他の容疑者との関連など自由に…',
    rows: 4,
  },
]

// 容疑者選択と仮説フォームを提供する推理ノートコンポーネント
export function HypothesisNote() {
  const { scenario, hypotheses, updateHypothesis, viewedSuspectProfileIds } = useGameStore()
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)

  if (!scenario) return null

  const selectedSuspect = scenario.suspects.find((s) => s.id === selectedSuspectId)
  const hypothesis: Omit<SuspectHypothesis, 'suspectId'> = hypotheses.find(
    (h) => h.suspectId === selectedSuspectId
  ) ?? { motive: '', opportunity: '', means: '', notes: '' }

  const hasEntry = (suspectId: string) => {
    const h = hypotheses.find((e) => e.suspectId === suspectId)
    return !!h && isHypothesisFilled(h)
  }

  return (
    <div className="space-y-4">
      {/* 容疑者選択ボタン群 */}
      <div>
        <p className="text-gothic-muted font-serif text-xs mb-2 leading-relaxed">
          容疑者を選んで仮説を書き込む。動機・機会・手段が揃えば犯人特定に近づく。
        </p>
        <div className="flex flex-wrap gap-2">
          {scenario.suspects.map((suspect) => (
            <button
              key={suspect.id}
              onClick={() => setSelectedSuspectId(suspect.id)}
              className={`px-3 py-1.5 text-xs font-display tracking-wide transition-colors border ${
                selectedSuspectId === suspect.id
                  ? 'border-gothic-gold text-gothic-gold bg-stone-900/50'
                  : 'border-gothic-border text-gothic-muted hover:text-gothic-text hover:border-gothic-text'
              }`}
            >
              {suspect.name}
              {/* 入力済みインジケーター */}
              {hasEntry(suspect.id) && (
                <span className="ml-1.5 text-gothic-gold text-[10px]">●</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 仮説フォーム */}
      {selectedSuspect ? (
        <div className="border border-gothic-border p-3 space-y-3">
          {/* 容疑者ヘッダー + プロフィール（閲覧済みの場合のみ表示） */}
          <div className="pb-2 border-b border-gothic-border space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-gothic-gold font-display text-xs tracking-widest">
                {selectedSuspect.name}
              </span>
              <span className="text-gothic-muted font-serif text-xs">
                {selectedSuspect.age}歳・{selectedSuspect.occupation}
              </span>
            </div>
            {viewedSuspectProfileIds.includes(selectedSuspect.id) ? (
              <SuspectProfileFields suspect={selectedSuspect} />
            ) : (
              <p className="text-gothic-muted/60 font-serif text-xs italic">
                人物の名前をクリックするとプロフィールが記録されます
              </p>
            )}
          </div>

          {/* テンプレート行 + 自由メモ */}
          {TEMPLATE_FIELDS.map(({ key, label, hint, rows }) => (
            <div key={key}>
              <label className="block text-gothic-muted font-display text-[11px] tracking-widest mb-1">
                {label}
              </label>
              <textarea
                value={hypothesis[key]}
                onChange={(e) => updateHypothesis(selectedSuspectId!, key, e.target.value)}
                placeholder={hint}
                rows={rows}
                className="w-full bg-transparent border border-gothic-border text-gothic-text font-serif text-xs p-2 resize-none focus:outline-none focus:border-gothic-gold placeholder:text-gothic-muted/40 leading-relaxed"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gothic-border/50 p-6 text-center">
          <p className="text-gothic-muted font-serif text-sm">
            容疑者を選択して推理を始めてください
          </p>
          <p className="text-gothic-muted/60 font-serif text-xs mt-2">
            答えを「作る」のはあなた自身です
          </p>
        </div>
      )}
    </div>
  )
}
