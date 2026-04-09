// 捜査中に収集したタイムライン・証拠品・証言・発見・仮説を閲覧・記述できるメモ画面
// 捜査・議論・告発フェーズ共通。フルスクリーンで表示し、左サイドバーに容疑者名一覧を配置する
// タイムライン・証言タブは全容疑者を一覧表示し、左サイドバークリックで該当セクションへスクロール
import { useRef, useState } from 'react'
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

/** 証拠品タブで証拠を選択し、確認ボタンで一括アクションを実行するモード */
interface EvidenceSelectMode {
  /** 突きつけ/反論対象の容疑者名（確認ボタンのラベルに使用） */
  suspectName: string
  /** 確認ボタンのラベル（例: "突きつける" / "この証拠で反論する"） */
  actionLabel: string
  /** すでに突きつけ済みの証拠ID（dimmed 表示） */
  confrontedEvidenceIds?: string[]
  /** 確認ボタン押下時に呼ばれるコールバック（選択した証拠IDを渡す） */
  onConfirm: (evidenceId: string) => void
  onCancel: () => void
}

interface InvestigationNotesProps {
  onClose: () => void
  /** 証言選択モード（追及質問の証言ゲート） */
  pursuitMode?: PursuitSelectionMode
  /** 証拠品選択モード（議論・告発フェーズでの突きつけ/反論） */
  evidenceSelectMode?: EvidenceSelectMode
}

const DEFAULT_CHARACTER_IMG = assetUrl('/assets/characters/default_character.png')
const DEFAULT_EVIDENCE_IMG = assetUrl('/assets/evidence/default_evidence.png')

// タイムライン・証拠・証言・発見・推理ノートをタブ切り替えで表示するフルスクリーンメモコンポーネント
export function InvestigationNotes({
  onClose,
  pursuitMode,
  evidenceSelectMode,
}: InvestigationNotesProps) {
  const {
    scenario,
    talkedSuspectIds,
    inspectedEvidenceIds,
    examinedEvidenceIds,
    heardStatements,
    discoveredCombinationIds,
    hypotheses,
    revealedFakeEvidenceIds,
    askedPursuitQuestionIds,
    tryCombineEvidence,
  } = useGameStore()

  // evidenceSelectMode が有効な場合は証拠品タブを強制表示
  const defaultTab: Tab = evidenceSelectMode ? 'evidence' : pursuitMode ? 'testimony' : 'timeline'
  const [tab, setTab] = useState<Tab>(defaultTab)
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)
  // evidenceSelectMode 使用時に選択中の証拠ID
  const [pendingEvidenceId, setPendingEvidenceId] = useState<string | null>(null)
  // 証拠品組み合わせ検討モードで選択中の証拠IDリスト
  const [combinationSelectedIds, setCombinationSelectedIds] = useState<string[]>([])
  // 組み合わせ検討の結果（no_match: 不一致, hint: 方向性は合っているが情報不足, already: 発見済み）
  const [combineResult, setCombineResult] = useState<null | 'no_match' | 'hint' | 'already'>(null)

  // タイムライン・証言タブの各容疑者セクションへのref（スクロール用）
  const timelineRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const testimonyRefs = useRef<Map<string, HTMLDivElement>>(new Map())

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

  // 容疑者IDごとの追及Q&Aマップ（質問済みのもののみ）
  const askedPursuitQABySuspect = new Map<
    string,
    { questionText: string; response: string; evidenceName: string }[]
  >()
  for (const suspect of scenario.suspects) {
    const qas: { questionText: string; response: string; evidenceName: string }[] = []
    for (const [evidenceId, reaction] of Object.entries(suspect.evidence_reactions ?? {})) {
      for (const pq of reaction.pursuit_questions ?? []) {
        if (askedPursuitQuestionIds.includes(pq.id)) {
          const evidenceName =
            scenario.evidence.find((e) => e.id === evidenceId)?.name ?? evidenceId
          qas.push({ questionText: pq.text, response: pq.response, evidenceName })
        }
      }
    }
    if (qas.length > 0) askedPursuitQABySuspect.set(suspect.id, qas)
  }

  // 選択中タブかどうかに応じたスタイルクラスを返すユーティリティ関数
  const tabClass = (t: Tab) =>
    `px-2 py-2 text-[10px] font-display tracking-widest transition-colors whitespace-nowrap ${
      tab === t
        ? 'text-gothic-gold border-b border-gothic-gold'
        : 'text-gothic-muted hover:text-gothic-text'
    }`

  // 左サイドバーの容疑者クリック: 選択してタイムライン/証言タブの該当セクションへスクロール
  const handleSidebarClick = (suspectId: string) => {
    const isSelected = selectedSuspectId === suspectId
    setSelectedSuspectId(isSelected ? null : suspectId)

    if (tab === 'timeline') {
      timelineRefs.current.get(suspectId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (tab === 'testimony') {
      testimonyRefs.current.get(suspectId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // evidenceSelectMode の確認ボタン押下
  const handleEvidenceConfirm = () => {
    if (!pendingEvidenceId || !evidenceSelectMode) return
    evidenceSelectMode.onConfirm(pendingEvidenceId)
  }

  // 組み合わせ検討: 証拠の選択トグル（詳しく調べた証拠のみ選択可能）
  const toggleCombinationSelect = (evidenceId: string) => {
    if (!examinedEvidenceIds.includes(evidenceId)) return
    setCombineResult(null)
    setCombinationSelectedIds((prev) =>
      prev.includes(evidenceId) ? prev.filter((id) => id !== evidenceId) : [...prev, evidenceId]
    )
  }

  // 組み合わせ検討ボタン押下
  const handleTryCombine = () => {
    if (combinationSelectedIds.length < 2) return
    const result = tryCombineEvidence(combinationSelectedIds)
    if (result.matched) {
      setCombinationSelectedIds([])
      setCombineResult(null)
    } else if (result.alreadyDiscovered) {
      setCombineResult('already')
    } else if (result.hint) {
      setCombineResult('hint')
    } else {
      setCombineResult('no_match')
    }
  }

  const isSpecialMode = !!pursuitMode || !!evidenceSelectMode

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
          {evidenceSelectMode && (
            <span className="text-gothic-gold font-serif text-xs border border-gothic-gold/60 px-2 py-0.5">
              証拠を選択: {evidenceSelectMode.suspectName}
            </span>
          )}
        </div>
        {isSpecialMode && (
          <button
            onClick={() => {
              pursuitMode?.onCancel()
              evidenceSelectMode?.onCancel()
            }}
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
                  onClick={() => handleSidebarClick(suspect.id)}
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
          {/* タイムライン: 全容疑者を一覧表示（左サイドバークリックで該当セクションへスクロール） */}
          {tab === 'timeline' &&
            (talkedSuspects.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-8">
                容疑者に話しかけるとタイムラインが記録されます
              </p>
            ) : (
              <div className="space-y-4">
                {talkedSuspects.map((suspect) => {
                  const totalStatements = 1 + suspect.investigation_dialog.statements.length
                  const heardCount = statementsById.get(suspect.id)?.length ?? 0
                  const allHeard = heardCount >= totalStatements
                  const remaining = totalStatements - heardCount
                  return (
                    <div
                      key={suspect.id}
                      ref={(el) => {
                        if (el) timelineRefs.current.set(suspect.id, el)
                      }}
                      className="border border-gothic-border p-3"
                    >
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

          {/* 証拠品: evidenceSelectMode 時は突きつけ選択UI、通常時は組み合わせ検討UI */}
          {tab === 'evidence' &&
            (discoveredEvidence.length === 0 ? (
              <p className="text-gothic-muted font-serif text-sm text-center py-8">
                まだ証拠を発見していません
              </p>
            ) : (
              <>
                {/* 通常モード: 組み合わせ検討の案内 */}
                {!evidenceSelectMode && (
                  <p className="text-gothic-muted/70 font-serif text-xs mb-3">
                    詳しく調べた証拠品を2つ以上選んで「検討する」
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {discoveredEvidence.map((evidence) => {
                    const examined = examinedEvidenceIds.includes(evidence.id)
                    const imgSrc = resolveEvidenceAsset(evidence.category_id)
                    const isConfronted = evidenceSelectMode?.confrontedEvidenceIds?.includes(
                      evidence.id
                    )
                    const isSelectModeSelected = pendingEvidenceId === evidence.id
                    const isCombineSelected = combinationSelectedIds.includes(evidence.id)

                    const handleClick = evidenceSelectMode
                      ? () => setPendingEvidenceId(evidence.id)
                      : examined
                        ? () => toggleCombinationSelect(evidence.id)
                        : undefined

                    const isActive = evidenceSelectMode ? isSelectModeSelected : isCombineSelected
                    const borderClass =
                      !evidenceSelectMode && !examined
                        ? 'border-gothic-border opacity-60'
                        : isActive
                          ? 'border-gothic-gold bg-stone-800/60 shadow-[0_0_12px_rgba(217,119,6,0.4)] cursor-pointer'
                          : 'border-gothic-border hover:border-gothic-gold/50 cursor-pointer'

                    return (
                      <div
                        key={evidence.id}
                        onClick={handleClick}
                        className={`border p-3 transition-all ${borderClass}`}
                      >
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
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-gothic-gold font-display text-xs tracking-widest">
                                {evidence.name}
                              </span>
                              {revealedFakeEvidenceIds.includes(evidence.id) && (
                                <span className="text-xs text-red-400/70 font-serif border border-red-800/50 px-1">
                                  偽証拠
                                </span>
                              )}
                              {isConfronted && (
                                <span className="text-xs text-gothic-muted font-serif border border-gothic-border px-1">
                                  突きつけ済
                                </span>
                              )}
                              {!evidenceSelectMode && isCombineSelected && (
                                <span className="text-xs text-gothic-gold font-serif border border-gothic-gold/60 px-1">
                                  選択中
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
              </>
            ))}

          {/* 証言: 全容疑者を一覧表示（左サイドバークリックで該当セクションへスクロール） */}
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
                {testimonyBySuspect.map(({ suspect, statements }) => {
                  const isTargetSuspect = pursuitMode?.suspectId === suspect.id
                  const imgSrc = resolveCharacterAsset(suspect.appearance_id)
                  return (
                    <div
                      key={suspect.id}
                      ref={(el) => {
                        if (el) testimonyRefs.current.set(suspect.id, el)
                      }}
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
                        {/* 追及Q&A: 質問済みの追及質問と返答を表示 */}
                        {(askedPursuitQABySuspect.get(suspect.id) ?? []).map((qa) => (
                          <div
                            key={`${qa.evidenceName}-${qa.questionText}`}
                            className="mt-2 border-t border-yellow-900/40 pt-2 space-y-1"
                          >
                            <div className="flex gap-2">
                              <span className="text-yellow-600/80 text-xs font-serif shrink-0">
                                追及
                              </span>
                              <p className="text-yellow-300/80 font-serif text-xs leading-relaxed">
                                {qa.questionText}
                              </p>
                            </div>
                            <div className="flex gap-2 pl-2">
                              <span className="text-gothic-muted text-xs font-serif shrink-0">
                                返答
                              </span>
                              <p className="text-gothic-text font-serif text-xs leading-relaxed">
                                {qa.response}
                              </p>
                            </div>
                          </div>
                        ))}
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
                証拠品タブで証拠を組み合わせて検討すると決定的事実が解放されます
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
                        {combo.evidence_ids.map((eid, idx) => {
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
                                {evidenceNames[idx]}
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

          {/* 推理ノート: 左サイドバーで選択した容疑者のフォームを表示 */}
          {tab === 'hypothesis' && <HypothesisNote selectedSuspectId={selectedSuspectId} />}
        </div>
      </div>

      {/* evidenceSelectMode: 証拠選択後に表示される確認ボタン（スティッキーフッター） */}
      {evidenceSelectMode && (
        <div className="flex-shrink-0 border-t border-gothic-border bg-gothic-panel/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
          {pendingEvidenceId ? (
            <>
              <span className="text-gothic-text font-serif text-xs">
                <span className="text-gothic-gold">
                  {scenario.evidence.find((e) => e.id === pendingEvidenceId)?.name ?? ''}
                </span>
                {' → '}
                {evidenceSelectMode.suspectName}
              </span>
              <button
                onClick={handleEvidenceConfirm}
                className="bg-gothic-gold/10 border border-gothic-gold text-gothic-gold font-display tracking-widest text-xs px-4 py-2 hover:bg-gothic-gold/20 transition-all whitespace-nowrap"
              >
                {evidenceSelectMode.actionLabel}
              </button>
            </>
          ) : (
            <p className="text-gothic-muted font-serif text-xs">証拠品を選択してください</p>
          )}
        </div>
      )}

      {/* 証拠品組み合わせ検討フッター（通常モードかつ証拠品タブ表示中） */}
      {!evidenceSelectMode && tab === 'evidence' && (
        <div className="flex-shrink-0 border-t border-gothic-border bg-gothic-panel/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {combineResult === 'no_match' && (
              <p className="text-gothic-muted font-serif text-xs">
                これらの証拠品に関連性は見つかりませんでした
              </p>
            )}
            {combineResult === 'hint' && (
              <p className="text-gothic-gold/70 font-serif text-xs italic">
                何かが足りない気がする...
              </p>
            )}
            {combineResult === 'already' && (
              <p className="text-gothic-muted font-serif text-xs">すでに発見済みの組み合わせです</p>
            )}
            {combineResult === null && (
              <p className="text-gothic-muted/60 font-serif text-xs">
                {combinationSelectedIds.length === 0
                  ? '詳しく調べた証拠品を選んでください'
                  : `${combinationSelectedIds.length}件選択中`}
              </p>
            )}
          </div>
          <button
            onClick={handleTryCombine}
            disabled={combinationSelectedIds.length < 2}
            className="bg-gothic-gold/10 border border-gothic-gold text-gothic-gold font-display tracking-widest text-xs px-4 py-2 hover:bg-gothic-gold/20 transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            検討する
          </button>
        </div>
      )}
    </div>
  )
}
