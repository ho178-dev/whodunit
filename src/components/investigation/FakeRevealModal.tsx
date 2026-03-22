// 偽証拠の2段階目調査時に「欺瞞を見破った！」体験を演出するモーダルコンポーネント
import { useGameStore } from '../../stores/gameStore'
import { getInspectionDescription } from '../../utils/scenario'

export function FakeRevealModal() {
  const { scenario, pendingFakeRevealId, clearFakeReveal } = useGameStore()

  if (!pendingFakeRevealId || !scenario) return null

  const evidence = scenario.evidence.find((e) => e.id === pendingFakeRevealId)
  if (!evidence) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-md border border-red-800/60 bg-gothic-panel shadow-[0_0_40px_rgba(185,28,28,0.35)] animate-fade-in">
        {/* ヘッダー */}
        <div className="border-b border-red-800/60 px-6 py-4 text-center">
          <p className="text-red-400/70 font-serif text-xs tracking-widest mb-1">
            ── 偽装が暴かれた ──
          </p>
          <h2 className="font-display text-red-400 text-lg tracking-widest">欺瞞を見破った！</h2>
        </div>

        {/* 証拠名 */}
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block border border-gothic-border bg-stone-900/60 text-gothic-gold font-display text-sm px-3 py-1 tracking-widest">
            {evidence.name}
          </span>
        </div>

        {/* Before / After 二段構成 */}
        <div className="px-6 py-4 space-y-3">
          <div className="border border-gothic-border/40 bg-stone-950/60 p-3">
            <p className="text-gothic-muted font-display text-xs tracking-widest mb-2">
              ◀ あなたが見ていたもの
            </p>
            <p className="text-gothic-text/70 font-serif text-sm leading-relaxed italic">
              「{getInspectionDescription(evidence)}」
            </p>
          </div>

          <div className="border border-red-800/40 bg-red-950/20 p-3">
            <p className="text-red-400/80 font-display text-xs tracking-widest mb-2">▶ 真実</p>
            <p className="text-gothic-text font-serif text-sm leading-relaxed">
              {evidence.examination_notes}
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 pb-5 border-t border-gothic-border flex items-center justify-between pt-4">
          <p className="text-gothic-muted font-serif text-xs leading-relaxed">
            鋭い調査が嘘を暴きました
          </p>
          <button
            onClick={clearFakeReveal}
            className="border border-red-800/60 bg-gothic-panel hover:bg-red-950/30 text-red-400 font-display tracking-widest py-2 px-6 text-sm transition-all hover:shadow-[0_0_15px_rgba(185,28,28,0.3)]"
          >
            確認する
          </button>
        </div>
      </div>
    </div>
  )
}
