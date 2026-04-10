// 複数証拠の組み合わせで真相の断片が解放されたときに表示する発見通知オーバーレイ
import { useGameStore } from '../../stores/gameStore'
import { getEvidenceNames } from '../../utils/scenario'

// pendingCombinationIds の先頭IDに対応する組み合わせをモーダル表示するコンポーネント
export function CombinationDiscovery() {
  const { scenario, pendingCombinationIds, discoveredCombinationIds, clearPendingCombination } =
    useGameStore()

  const pendingId = pendingCombinationIds[0]
  if (!pendingId || !scenario?.evidence_combinations) return null

  const combination = scenario.evidence_combinations.find((c) => c.id === pendingId)
  if (!combination) return null

  const evidenceNames = getEvidenceNames(combination.evidence_ids, scenario.evidence)

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md border border-gothic-gold bg-gothic-panel shadow-[0_0_40px_rgba(217,119,6,0.4)] animate-fade-in">
        {/* ヘッダー */}
        <div className="border-b border-gothic-gold px-6 py-4 text-center">
          <p className="text-gothic-muted font-serif text-xs tracking-widest mb-1">
            真相の断片が解放されました
          </p>
          <h2 className="font-display text-gothic-gold text-lg tracking-widest">
            {combination.name}
          </h2>
          {combination.is_critical && (
            <span className="inline-block mt-2 text-xs font-serif border border-gothic-gold/60 text-gothic-gold px-2 py-0.5 tracking-widest">
              重要
            </span>
          )}
        </div>

        {/* 組み合わせた証拠バッジ */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-gothic-muted font-serif text-xs tracking-widest mb-2">
            組み合わせた証拠
          </p>
          <div className="flex flex-wrap gap-2">
            {evidenceNames.map((name, i) => (
              <span
                key={i}
                className="border border-gothic-border bg-stone-900/60 text-gothic-text font-serif text-xs px-2 py-1"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* 説明 */}
        <div className="px-6 py-4 border-t border-gothic-border">
          <p className="text-gothic-text font-serif text-sm leading-relaxed">
            {combination.description}
          </p>
        </div>

        {/* フッター */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <p className="text-gothic-muted font-serif text-xs">
            発見 {discoveredCombinationIds.length} / {scenario.evidence_combinations.length}
          </p>
          <button
            onClick={clearPendingCombination}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-2 px-6 text-sm transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            確認する
          </button>
        </div>
      </div>
    </div>
  )
}
