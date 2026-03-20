import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'

type Tab = 'timeline' | 'evidence' | 'testimony'

interface InvestigationNotesProps {
  onClose: () => void
}

export function InvestigationNotes({ onClose }: InvestigationNotesProps) {
  const { scenario, talkedSuspectIds, discoveredEvidenceIds, heardStatements } = useGameStore()
  const [tab, setTab] = useState<Tab>('timeline')

  if (!scenario) return null

  const discoveredEvidence = scenario.evidence.filter((e) => discoveredEvidenceIds.includes(e.id))

  // 話しかけた容疑者のtimeline
  const talkedSuspects = scenario.suspects.filter((s) => talkedSuspectIds.includes(s.id))

  // 聞き込み記録：容疑者ごとにグルーピング
  const testimonyBySuspect = scenario.suspects
    .map((s) => ({
      suspect: s,
      statements: heardStatements
        .filter((h) => h.suspectId === s.id)
        .sort((a, b) => a.index - b.index),
    }))
    .filter((g) => g.statements.length > 0)

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-xs font-display tracking-widest transition-colors ${
      tab === t
        ? 'text-gothic-gold border-b border-gothic-gold'
        : 'text-gothic-muted hover:text-gothic-text'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-start p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg max-h-[80vh] flex flex-col border border-gothic-gold bg-gothic-panel shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gothic-border">
          <h2 className="font-display text-gothic-gold tracking-widest text-sm">操作メモ</h2>
          <button
            onClick={onClose}
            className="text-gothic-muted hover:text-gothic-text font-serif text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* 被害者情報（常時表示） */}
        <div className="px-4 py-3 border-b border-gothic-border bg-stone-900/50 text-xs font-serif space-y-1">
          <p className="text-gothic-gold font-display tracking-widest text-xs mb-1">被害者</p>
          <p className="text-gothic-text">
            <span className="text-gothic-muted">氏名：</span>
            {scenario.victim.name}
          </p>
          <p className="text-gothic-text">
            <span className="text-gothic-muted">死因：</span>
            {scenario.victim.cause_of_death}
          </p>
          <p className="text-gothic-text">
            <span className="text-gothic-muted">推定犯行時刻：</span>
            <span className="text-gothic-gold font-semibold">{scenario.murder_time_range}</span>
          </p>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gothic-border">
          <button onClick={() => setTab('timeline')} className={tabClass('timeline')}>
            タイムライン {talkedSuspects.length > 0 && `(${talkedSuspects.length})`}
          </button>
          <button onClick={() => setTab('evidence')} className={tabClass('evidence')}>
            証拠品 {discoveredEvidence.length > 0 && `(${discoveredEvidence.length})`}
          </button>
          <button onClick={() => setTab('testimony')} className={tabClass('testimony')}>
            証言 {heardStatements.length > 0 && `(${heardStatements.length})`}
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* タイムライン */}
          {tab === 'timeline' && (
            <div>
              {talkedSuspects.length === 0 ? (
                <p className="text-gothic-muted font-serif text-sm text-center py-4">
                  容疑者に話しかけるとタイムラインが記録されます
                </p>
              ) : (
                <div className="space-y-4">
                  {talkedSuspects.map((suspect) => {
                    const totalStatements = 1 + suspect.investigation_dialog.statements.length // greeting + statements
                    const heardCount = heardStatements.filter(
                      (h) => h.suspectId === suspect.id
                    ).length
                    const allHeard = heardCount >= totalStatements
                    const remaining = totalStatements - heardCount
                    return (
                      <div key={suspect.id} className="border border-gothic-border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gothic-gold font-display text-xs tracking-widest">
                            {suspect.name}
                          </span>
                          <span className="text-gothic-muted text-xs font-serif">の証言</span>
                        </div>
                        {allHeard ? (
                          <p className="text-gothic-text font-serif text-xs leading-relaxed whitespace-pre-wrap">
                            {suspect.timeline}
                          </p>
                        ) : (
                          <p className="text-gothic-muted font-serif text-xs italic">
                            あと{remaining}つの証言を聞くとタイムラインが確認できます
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* 証拠品 */}
          {tab === 'evidence' && (
            <div>
              {discoveredEvidence.length === 0 ? (
                <p className="text-gothic-muted font-serif text-sm text-center py-4">
                  まだ証拠を発見していません
                </p>
              ) : (
                <div className="space-y-3">
                  {discoveredEvidence.map((evidence) => (
                    <div key={evidence.id} className="border border-gothic-border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gothic-gold font-display text-xs tracking-widest">
                          {evidence.name}
                        </span>
                        {evidence.is_fake && (
                          <span className="text-xs text-gothic-muted font-serif border border-gothic-muted px-1">
                            要検討
                          </span>
                        )}
                      </div>
                      <p className="text-gothic-text font-serif text-xs mb-2">
                        {evidence.description}
                      </p>
                      <div className="border-t border-gothic-border pt-2">
                        <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">
                          調査メモ
                        </p>
                        <p className="text-gothic-muted font-serif text-xs leading-relaxed">
                          {evidence.examination_notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 証言 */}
          {tab === 'testimony' && (
            <div>
              {testimonyBySuspect.length === 0 ? (
                <p className="text-gothic-muted font-serif text-sm text-center py-4">
                  まだ証言を聞いていません
                </p>
              ) : (
                <div className="space-y-4">
                  {testimonyBySuspect.map(({ suspect, statements }) => (
                    <div key={suspect.id} className="border border-gothic-border p-3">
                      <p className="text-gothic-gold font-display text-xs tracking-widest mb-2">
                        {suspect.name}
                      </p>
                      <div className="space-y-2">
                        {statements.map((s) => (
                          <div key={s.index} className="flex gap-2">
                            <span className="text-gothic-muted text-xs font-serif shrink-0">
                              {s.index === -1 ? '挨拶' : `証言${s.index + 1}`}
                            </span>
                            <p className="text-gothic-text font-serif text-xs leading-relaxed">
                              {s.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
