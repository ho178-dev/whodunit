// 捜査中に収集したタイムライン・証拠品・証言・発見・仮説を閲覧・記述できるメモ画面
// 捜査・議論フェーズ共通。フルスクリーンで表示し、左サイドバーに容疑者名一覧を配置する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getEvidenceNames, getInspectionDescription } from '../../utils/scenario'
import { HypothesisNote } from './HypothesisNote'
import { isHypothesisFilled } from '../../types/game'
import { resolveCharacterAsset, resolveEvidenceAsset } from '../../services/assetResolver'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { assetUrl } from '../../utils/assetUrl'

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

const DEFAULT_CHARACTER_IMG = assetUrl('/assets/characters/default_character.png')
const DEFAULT_EVIDENCE_IMG = assetUrl('/assets/evidence/default_evidence.png')

// タイムライン・証拠・証言・発見をタブ切り替えで表示するフルスクリーンメモコンポーネント
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
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)

  if (!scenario) return null

  const discoveredEvidence = scenario.evidence.filter((e) => inspectedEvidenceIds.includes(e.id))
  const discoveredCombinations = (scenario.evidence_combinations ?? []).filter((c) =>
    discoveredCombinationIds.includes(c.id)
  )

  const talkedSuspects = scenario.suspects.filter((s) => talkedSuspectIds.includes(s.id))

  const statementsById = heardStatements.reduce<Map<string, typeof heardStatements>>(
    (acc, h) => acc.set(h.suspectId, [...(acc.get(h.suspectId) ?? []), h]),
    new Map()
  )
  const testimonyBySuspect = scenario.suspects
    .map((s) => ({
      suspect: s,
      statements: (statementsById.get(s.id) ?? []).slice().sort((a, b) => a.index - b.index),
    }))
    .filter((g) => g.statements.length > 0)

  const filledHypothesesCount = hypotheses.filter(isHypothesisFilled).length

  // 選択中タブかどうかに応じたスタイルクラスを返すユーティリティ関数
  const tabClass = (t: Tab) =>
    `px-2 py-2 text-[10px] font-display tracking-widest transition-colors whitespace-nowrap ${
      tab === t
        ? 'text-gothic-gold border-b border-gothic-gold'
        : 'text-gothic-muted hover:text-gothic-text'
    }`

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gothic-bg border border-gothic-gold/50">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gothic-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-gothic-muted hover:text-gothic-text font-serif text-xs border border-gothic-border px-3 py-1.5 hover:border-gothic-accent transition-all"
          >
            ← 戻る
          </button>
          <h2 className="font-display text-gothic-gold tracking-widest text-sm">捜査メモ</h2>
          {pursuitMode && (
            <span className="text-yellow-400 font-serif text-xs border border-yellow-700 px-2 py-0.5 animate-pulse">
              ⚑ 矛盾する証言を選択してください
            </span>
          )}
        </div>
        {pursuitMode && (
          <button
            onClick={() => pursuitMode.onCancel()}
            className="text-stone-500 hover:text-stone-300 font-serif text-xs border border-stone-700 px-2 py-0.5 transition-colors"
          >
            キャンセル
          </button>
        )}
      </div>

      {/* 被害者情報（3行レイアウト） */}
      <div className="px-4 py-2 border-b border-gothic-border bg-stone-900/50 flex-shrink-0">
        <div className="flex flex-col gap-0.5 text-xs font-serif">
          <div className="flex items-center gap-2">
            <span className="text-gothic-gold font-display tracking-widest text-[10px] w-24 flex-shrink-0">
              被害者
            </span>
            <span className="text-gothic-text">{scenario.victim.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gothic-gold font-display tracking-widest text-[10px] w-24 flex-shrink-0">
              死因
            </span>
            <span className="text-gothic-muted">{scenario.victim.cause_of_death}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gothic-gold font-display tracking-widest text-[10px] w-24 flex-shrink-0">
              推定犯行時刻
            </span>
            <span className="text-gothic-text">{scenario.murder_time_range}</span>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gothic-border flex-shrink-0 overflow-x-auto game-scrollbar">
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

      {/* メインエリア: 左サイドバー + コンテンツ */}
      <div className="flex flex-1 min-h-0">
        {/* 左サイドバー: 容疑者名一覧（画像なし） */}
        <div className="w-[80px] border-r border-gothic-border flex-shrink-0 overflow-y-auto game-scrollbar bg-stone-950/30">
          <p className="text-gothic-muted font-display text-[9px] tracking-widest text-center py-2 border-b border-gothic-border">
            容疑者
          </p>
          <div className="py-2 space-y-1 px-1.5">
            {scenario.suspects.map((suspect) => {
              const isSelected = selectedSuspectId === suspect.id
              const isPursuitTarget = pursuitMode?.suspectId === suspect.id
              const hasTalked = talkedSuspectIds.includes(suspect.id)
              return (
                <button
                  key={suspect.id}
                  onClick={() => setSelectedSuspectId(isSelected ? null : suspect.id)}
                  className={`w-full px-1.5 py-1.5 text-center border transition-all ${
                    isPursuitTarget
                      ? 'border-yellow-700 bg-yellow-950/20'
                      : isSelected
                        ? 'border-gothic-gold bg-stone-800/40'
                        : hasTalked
                          ? 'border-gothic-border/60 hover:border-gothic-gold/50'
                          : 'border-stone-800/40 opacity-50'
                  }`}
                >
                  <span
                    className={`font-display text-[9px] tracking-wide leading-tight block ${
                      isPursuitTarget
                        ? 'text-yellow-400'
                        : isSelected
                          ? 'text-gothic-gold'
                          : 'text-gothic-muted'
                    }`}
                  >
                    {suspect.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="flex-1 overflow-y-auto game-scrollbar p-4 space-y-4">
          {/* タイムライン（キャラ画像なし） */}
          {tab === 'timeline' &&
            (talkedSuspects.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-8">
                容疑者に話しかけるとタイムラインが記録されます
              </p>
            ) : (
              <div className="space-y-4">
                {talkedSuspects
                  .filter((s) => !selectedSuspectId || s.id === selectedSuspectId)
                  .map((suspect) => {
                    const totalStatements = 1 + suspect.investigation_dialog.statements.length
                    const heardCount = statementsById.get(suspect.id)?.length ?? 0
                    const allHeard = heardCount >= totalStatements
                    const remaining = totalStatements - heardCount
                    return (
                      <div key={suspect.id} className="border border-gothic-border p-3">
                        <div className="mb-2">
                          <span className="text-gothic-gold font-display text-xs tracking-widest">
                            {suspect.name}
                          </span>
                          <p className="text-gothic-muted font-serif text-[10px] mt-0.5">
                            {suspect.occupation}
                          </p>
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
            ))}

          {/* 証拠品 */}
          {tab === 'evidence' &&
            (discoveredEvidence.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-8">
                まだ証拠を発見していません
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {discoveredEvidence.map((evidence) => {
                  const examined = examinedEvidenceIds.includes(evidence.id)
                  const imgSrc = resolveEvidenceAsset(evidence.category_id)
                  return (
                    <div key={evidence.id} className="border border-gothic-border p-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-14 h-14 flex-shrink-0 border border-gothic-border/50 bg-stone-900/50 overflow-hidden">
                          <PixelImageWithFallback
                            src={imgSrc}
                            alt={evidence.name}
                            pixelSize={PIXEL_ART_CONFIG.pixelSize.evidence}
                            canvasWidth={PIXEL_ART_CONFIG.canvasSize.evidence.width}
                            canvasHeight={PIXEL_ART_CONFIG.canvasSize.evidence.height}
                            fallbackSrc={DEFAULT_EVIDENCE_IMG}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
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
                          <p className="text-gothic-text font-serif text-xs">
                            {getInspectionDescription(evidence)}
                          </p>
                        </div>
                      </div>
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
            ))}

          {/* 証言（左：キャラ画像+名前、右：証言内容） */}
          {tab === 'testimony' &&
            (testimonyBySuspect.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-8">
                まだ証言を聞いていません
              </p>
            ) : (
              <div className="space-y-4">
                {pursuitMode && (
                  <p className="text-yellow-400/80 font-serif text-xs border border-yellow-800/50 bg-yellow-950/30 px-3 py-2">
                    この証拠と矛盾する証言を選んでください。間違えた場合は容疑者が反応します。
                  </p>
                )}
                {testimonyBySuspect
                  .filter((g) => !selectedSuspectId || g.suspect.id === selectedSuspectId)
                  .map(({ suspect, statements }) => {
                    const isTargetSuspect = pursuitMode?.suspectId === suspect.id
                    const imgSrc = resolveCharacterAsset(suspect.appearance_id)
                    return (
                      <div
                        key={suspect.id}
                        className={`border p-3 flex gap-3 ${
                          pursuitMode && !isTargetSuspect
                            ? 'border-stone-800 opacity-40'
                            : 'border-gothic-border'
                        }`}
                      >
                        {/* 左カラム: キャラ画像 + 名前 */}
                        <div className="w-16 flex-shrink-0 flex flex-col items-center gap-1.5">
                          <div className="w-full aspect-[832/1216] overflow-hidden border border-gothic-border/50">
                            <PixelImageWithFallback
                              src={imgSrc}
                              alt={suspect.name}
                              pixelSize={PIXEL_ART_CONFIG.pixelSize.character}
                              canvasWidth={PIXEL_ART_CONFIG.canvasSize.character.width}
                              canvasHeight={PIXEL_ART_CONFIG.canvasSize.character.height}
                              fallbackSrc={DEFAULT_CHARACTER_IMG}
                            />
                          </div>
                          <p
                            className={`font-display text-[9px] tracking-wide text-center leading-tight ${
                              isTargetSuspect ? 'text-yellow-400' : 'text-gothic-gold'
                            }`}
                          >
                            {suspect.name}
                            {isTargetSuspect && pursuitMode && (
                              <span className="block text-yellow-600 font-serif normal-case tracking-normal text-[8px] mt-0.5">
                                証言を選択
                              </span>
                            )}
                          </p>
                        </div>

                        {/* 右カラム: 証言内容 */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {statements.map((s) => {
                            const isSelectable = pursuitMode && isTargetSuspect && s.index >= 0
                            return (
                              <div key={s.index} className="flex gap-2">
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
            ))}

          {/* 発見（証拠クロス参照） */}
          {tab === 'discovery' &&
            (discoveredCombinations.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-8">
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
                      <div className="flex flex-wrap gap-2 mb-2">
                        {combo.evidence_ids.map((eid) => {
                          const ev = scenario.evidence.find((e) => e.id === eid)
                          if (!ev) return null
                          const imgSrc = resolveEvidenceAsset(ev.category_id)
                          return (
                            <div key={eid} className="flex items-center gap-1">
                              <div className="w-8 h-8 overflow-hidden border border-gothic-border/50 bg-stone-900/50">
                                <PixelImageWithFallback
                                  src={imgSrc}
                                  alt={ev.name}
                                  pixelSize={PIXEL_ART_CONFIG.pixelSize.evidence}
                                  canvasWidth={PIXEL_ART_CONFIG.canvasSize.evidence.width}
                                  canvasHeight={PIXEL_ART_CONFIG.canvasSize.evidence.height}
                                  fallbackSrc={DEFAULT_EVIDENCE_IMG}
                                />
                              </div>
                              <span className="border border-gothic-border text-gothic-muted font-serif text-xs px-1.5 py-0.5">
                                {evidenceNames[combo.evidence_ids.indexOf(eid)]}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-gothic-text font-serif text-xs leading-relaxed">
                        {combo.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            ))}

          {/* 推理ノート */}
          {tab === 'hypothesis' && <HypothesisNote />}
        </div>
      </div>
    </div>
  )
}
