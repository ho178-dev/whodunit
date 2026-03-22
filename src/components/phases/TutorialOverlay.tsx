// ゲームの遊び方をステップ形式で説明するチュートリアルオーバーレイ
import { useState } from 'react'

const STEPS = [
  {
    title: 'あなたの役割',
    content: `あなたはこの事件を調査するために招かれた探偵です。
館に集まった容疑者たちに話を聞き、証拠を集め、犯人を見つけ出してください。`,
  },
  {
    title: 'ゲームの流れ',
    content: `このゲームは3つのフェーズで進みます。
①【捜査フェーズ】各部屋を訪れて証拠を収集し、容疑者に話を聞く。
②【議論フェーズ】集めた証拠を容疑者に突きつけて反応を確認する。
③【投票フェーズ】犯人だと思う人物に投票して事件を解決する。`,
  },
  {
    title: 'アクションポイントの使い方',
    content: `捜査フェーズでは20アクションが使えます。
・証拠を調査する → 1アクション消費
・新しい容疑者に話しかける → 1アクション消費
（一度話した容疑者には何度でも無料で話せます）
アクションを使い切ると自動的に議論フェーズへ進みます。計画的に行動しましょう。`,
  },
  {
    title: '証拠の調査メモを活用する',
    content: `証拠を調査すると「調査メモ」が解放されます。
調査メモには他の証拠や証言との論理的なつながりが記されています。
発見した証拠をクリックすると調査メモが展開されます。
複数の証拠をつなぎ合わせることで犯人を特定できます。`,
  },
  {
    title: '議論フェーズで証拠を突きつける',
    content: `議論フェーズでは容疑者を選んで証拠を提示できます。
証拠を突きつけると容疑者が独自のリアクションを返します。
犯人は核心を突く証拠に対して動揺・怒り・言い逃れなど不自然な反応を示します。
全ての証拠を試して矛盾を見つけましょう。`,
  },
  {
    title: '投票と解決',
    content: `証拠と証言を総合して犯人を特定したら投票フェーズへ。
容疑者の中から犯人だと思う一人を選んで投票します。
正解すれば事件解決。不正解でも真相が明かされます。
動機・機会・手段の3つが揃えば犯人は一人に絞れます。`,
  },
]

interface TutorialOverlayProps {
  onClose: () => void
}

export function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md mx-4 border border-gothic-gold bg-gothic-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-gothic-gold tracking-widest text-lg">遊び方</h2>
          <span className="text-gothic-muted text-xs font-serif">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <h3 className="font-display text-gothic-accent tracking-wider text-sm mb-3">
          {current.title}
        </h3>
        <p className="text-gothic-text font-serif text-sm leading-relaxed whitespace-pre-line mb-6">
          {current.content}
        </p>

        <div className="flex gap-3 justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="border border-gothic-border text-gothic-muted font-serif text-sm px-4 py-2 disabled:opacity-30 hover:border-gothic-accent hover:text-gothic-text transition-all"
          >
            ← 前へ
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="border border-gothic-gold text-gothic-gold font-display tracking-widest text-sm px-6 py-2 hover:bg-stone-800 transition-all"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="border border-gothic-gold text-gothic-gold font-display tracking-widest text-sm px-6 py-2 hover:bg-stone-800 transition-all"
            >
              閉じる
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
