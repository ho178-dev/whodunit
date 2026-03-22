// 捜査中に収集したタイムライン・証拠品・証言・発見・仮説を閲覧・記述できるメモパネル
import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getEvidenceNames, getInspectionDescription } from '../../utils/scenario'
import { HypothesisNote } from './HypothesisNote'
import { isHypothesisFilled } from '../../types/game'

type Tab = 'timeline' | 'evidence' | 'testimony' | 'discovery' | 'hypothesis'

interface PursuitSelectionMode {
  suspectId: string // 追及対象の容疑者ID
  onSelect: (suspectId: string, statementIndex: number) => void
  onCancel: () => void
}

interface InvestigationNotesProps {
  onClose: () => void
  pursuitMode?: PursuitSelectionMode // 証言選択モード（追及質問の証言ゲート）
}

// タイムライン・証拠・証言・発見をタブ切り替えで表示するメモパネルコンポーネント
export function InvestigationNotes({ onClose, pursuitMode }: InvestigationNotesProps) {
  const {
    scenario,
    talkedSuspectIds,
    inspectedEvidenceIds,
    examinedEvidenceIds,
    heardStatements,
    discoveredCombinationIds,
    hypotheses,
    revealedFakeEvidenceIds,
  } = useGameStore()
  const [tab, setTab] = useState<Tab>(pursuitMode ? 'testimony' : 'timeline')
  const [position, setPosition] = useState({ x: 16, y: 80 })
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    }
    e.preventDefault()
  }

  // windowに登録してパネル外でもドラッグを継続できるようにする
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.isDragging) return
    setPosition({
      x: dragRef.current.originX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (e.clientY - dragRef.current.startY),
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    dragRef.current.isDragging = false
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  if (!scenario) return null

  const discoveredEvidence = scenario.evidence.filter((e) => inspectedEvidenceIds.includes(e.id))
  const discoveredCombinations = (scenario.evidence_combinations ?? []).filter((c) =>
    discoveredCombinationIds.includes(c.id)
  )

  // 話しかけた容疑者のtimeline
  const talkedSuspects = scenario.suspects.filter((s) => talkedSuspectIds.includes(s.id))

  const statementsById = Map.groupBy(heardStatements, (h) => h.suspectId)
  const testimonyBySuspect = scenario.suspects
    .map((s) => ({
      suspect: s,
      statements: (statementsById.get(s.id) ?? []).slice().sort((a, b) => a.index - b.index),
    }))
    .filter((g) => g.statements.length > 0)

  const filledHypothesesCount = hypotheses.filter(isHypothesisFilled).length

  // 選択中タブかどうかに応じたスタイルクラスを返すユーティリティ関数
  const tabClass = (t: Tab) =>
    `px-3 py-2 text-xs font-display tracking-widest transition-colors ${
      tab === t
        ? 'text-gothic-gold border-b border-gothic-gold'
        : 'text-gothic-muted hover:text-gothic-text'
    }`

  const handleClose = () => onClose()

  return (
    <div
      className="fixed z-50 w-full max-w-lg max-h-[80vh] flex flex-col border border-gothic-gold bg-gothic-panel shadow-[0_0_30px_rgba(0,0,0,0.8)]"
      style={{ left: position.x, top: position.y }}
    >
      {/* ヘッダー（ドラッグハンドル） */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gothic-border cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-display text-gothic-gold tracking-widest text-sm">操作メモ</h2>
          {pursuitMode && (
            <span className="text-yellow-400 font-serif text-xs border border-yellow-700 px-2 py-0.5 animate-pulse">
              ⚑ 矛盾する証言を選択してください
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {pursuitMode && (
            <button
              onClick={() => pursuitMode.onCancel()}
              className="text-stone-500 hover:text-stone-300 font-serif text-xs border border-stone-700 px-2 py-0.5 transition-colors"
            >
              キャンセル
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-gothic-muted hover:text-gothic-text font-serif text-lg leading-none"
          >
            ×
          </button>
        </div>
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
        <button
          onClick={() => setTab('testimony')}
          className={`${tabClass('testimony')} ${pursuitMode ? 'text-yellow-400' : ''}`}
        >
          証言 {heardStatements.length > 0 && `(${heardStatements.length})`}
          {pursuitMode && ' ◀'}
        </button>
        <button onClick={() => setTab('discovery')} className={tabClass('discovery')}>
          発見
          {discoveredCombinations.length > 0 && (
            <span className="ml-1 text-gothic-gold">({discoveredCombinations.length})</span>
          )}
        </button>
        <button onClick={() => setTab('hypothesis')} className={tabClass('hypothesis')}>
          推理ノート
          {filledHypothesesCount > 0 && (
            <span className="ml-1 text-gothic-gold">({filledHypothesesCount})</span>
          )}
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
                {discoveredEvidence.map((evidence) => {
                  const examined = examinedEvidenceIds.includes(evidence.id)
                  return (
                    <div key={evidence.id} className="border border-gothic-border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gothic-gold font-display text-xs tracking-widest">
                          {evidence.name}
                        </span>
                        {revealedFakeEvidenceIds.includes(evidence.id) && (
                          <span className="text-xs text-red-400/70 font-serif border border-red-800/50 px-1">
                            偽証拠
                          </span>
                        )}
                      </div>
                      <p className="text-gothic-text font-serif text-xs mb-2">
                        {getInspectionDescription(evidence)}
                      </p>
                      {examined ? (
                        <div className="border-t border-gothic-border pt-2">
                          <p className="text-gothic-gold text-xs font-display tracking-widest mb-1">
                            調査メモ
                          </p>
                          <p className="text-gothic-muted font-serif text-xs leading-relaxed">
                            {evidence.examination_notes}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gothic-muted font-serif text-xs italic border-t border-gothic-border pt-2">
                          詳細調査が必要です
                        </p>
                      )}
                    </div>
                  )
                })}
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
                {pursuitMode && (
                  <p className="text-yellow-400/80 font-serif text-xs border border-yellow-800/50 bg-yellow-950/30 px-3 py-2">
                    この証拠と矛盾する証言を選んでください。間違えた場合は容疑者が反応します。
                  </p>
                )}
                {testimonyBySuspect.map(({ suspect, statements }) => {
                  const isTargetSuspect = pursuitMode?.suspectId === suspect.id
                  return (
                    <div
                      key={suspect.id}
                      className={`border p-3 ${
                        pursuitMode && !isTargetSuspect
                          ? 'border-stone-800 opacity-40'
                          : 'border-gothic-border'
                      }`}
                    >
                      <p
                        className={`font-display text-xs tracking-widest mb-2 ${
                          isTargetSuspect ? 'text-yellow-400' : 'text-gothic-gold'
                        }`}
                      >
                        {suspect.name}
                        {isTargetSuspect && pursuitMode && (
                          <span className="ml-2 text-yellow-600 font-serif normal-case tracking-normal">
                            — 証言を選択
                          </span>
                        )}
                      </p>
                      <div className="space-y-2">
                        {statements.map((s) => {
                          // greeting（index -1）は追及対象外
                          const isSelectable = pursuitMode && isTargetSuspect && s.index >= 0
                          return (
                            <div
                              key={s.index}
                              className={`flex gap-2 ${isSelectable ? 'group' : ''}`}
                            >
                              <span className="text-gothic-muted text-xs font-serif shrink-0">
                                {s.index === -1 ? '挨拶' : `証言${s.index + 1}`}
                              </span>
                              {isSelectable ? (
                                <button
                                  onClick={() => pursuitMode.onSelect(suspect.id, s.index)}
                                  className="text-left text-gothic-text font-serif text-xs leading-relaxed hover:text-yellow-200 hover:bg-yellow-900/20 px-1 -mx-1 rounded transition-colors border border-transparent hover:border-yellow-800/50 w-full"
                                >
                                  {s.text}
                                </button>
                              ) : (
                                <p className="text-gothic-text font-serif text-xs leading-relaxed">
                                  {s.text}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 発見（証拠クロス参照） */}
        {tab === 'discovery' && (
          <div>
            {discoveredCombinations.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-4">
                複数の証拠を詳しく調査すると決定的事実が解放されます
              </p>
            ) : (
              <div className="space-y-4">
                {discoveredCombinations.map((combo) => {
                  const evidenceNames = getEvidenceNames(combo.evidence_ids, scenario.evidence)
                  return (
                    <div
                      key={combo.id}
                      className="border border-gothic-gold/40 p-3 bg-stone-900/30"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-gothic-gold font-display text-xs tracking-widest leading-snug">
                          {combo.name}
                        </span>
                        {combo.is_critical && (
                          <span className="shrink-0 text-xs font-serif border border-gothic-gold/60 text-gothic-gold px-1">
                            重要
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {evidenceNames.map((name, i) => (
                          <span
                            key={i}
                            className="border border-gothic-border text-gothic-muted font-serif text-xs px-1.5 py-0.5"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                      <p className="text-gothic-text font-serif text-xs leading-relaxed">
                        {combo.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {/* 推理ノート */}
        {tab === 'hypothesis' && <HypothesisNote />}
      </div>
    </div>
  )
}
