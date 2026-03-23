// 議論フェーズの画面。館背景にキャラクターを配置し、証拠突きつけ・追及質問を管理する
// 一覧モード（スライダー）と会話モード（選択キャラ中央表示）を切り替える
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getRootQuestionIds } from '../../utils/scenario'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { CombinationDiscovery } from '../investigation/CombinationDiscovery'
import { FakeRevealModal } from '../investigation/FakeRevealModal'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { MANSION_DEFAULT_ASSET } from '../../services/assetResolver'
import { EvidenceSelectModal } from '../discussion/EvidenceSelectModal'
import { behaviorBorderColors, behaviorLabel } from '../../constants/npcBehavior'
import { cn } from '../../utils/cn'

const sliderArrowClass =
  'shrink-0 border border-gothic-border/60 bg-gothic-panel/80 backdrop-blur-sm hover:border-gothic-accent text-gothic-muted hover:text-gothic-gold w-8 h-8 flex items-center justify-center transition-all'

// 議論フェーズのメインコンポーネント
export function DiscussionPhase() {
  const {
    scenario,
    setPhase,
    inspectedEvidenceIds,
    pendingPursuitActivation,
    selectTestimonyForPursuit,
    clearPursuitActivation,
    addConfrontation,
    confrontationLog,
    heardStatements,
    unlockedPursuitQuestions,
    askedPursuitQuestionIds,
    askPursuitQuestion,
    initiatePursuitActivation,
    pursuitWrongResult,
    clearPursuitWrongResult,
  } = useGameStore()

  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [showNotesManual, setShowNotesManual] = useState(false)
  const [sliderIndex, setSliderIndex] = useState(0)

  const showNotes = showNotesManual || pendingPursuitActivation !== null

  if (!scenario) return null

  const handleNotesClose = () => {
    setShowNotesManual(false)
    clearPursuitActivation()
  }

  const selectedEvidence = selectedEvidenceId
    ? scenario.evidence.find((e) => e.id === selectedEvidenceId)
    : null
  const selectedSuspect = selectedSuspectId
    ? scenario.suspects.find((s) => s.id === selectedSuspectId)
    : null

  // 会話モード: 容疑者と証拠の両方が選択済みの場合のみ
  const isConversationMode = selectedSuspectId !== null && selectedEvidenceId !== null

  const latestReaction =
    selectedSuspectId && selectedEvidenceId
      ? (confrontationLog
          .filter((c) => c.suspectId === selectedSuspectId && c.evidenceId === selectedEvidenceId)
          .at(-1) ?? null)
      : null

  const contradictIdx =
    selectedSuspect && selectedEvidence
      ? selectedSuspect.evidence_reactions[selectedEvidence.id]?.contradicts_statement_index
      : undefined
  const hasContradiction =
    contradictIdx !== undefined &&
    heardStatements.some((s) => s.suspectId === selectedSuspectId && s.index === contradictIdx)

  const unlockedForCurrent =
    selectedSuspectId && selectedEvidenceId
      ? unlockedPursuitQuestions.filter(
          (u) => u.suspectId === selectedSuspectId && u.evidenceId === selectedEvidenceId
        )
      : []

  const hasPursuitQuestions =
    !!selectedSuspect &&
    !!selectedEvidenceId &&
    !!selectedSuspect.evidence_reactions[selectedEvidenceId]?.pursuit_questions?.length

  // 追及質問のルートがすべてアンロック済みか（会話モード時のみ意味がある）
  const rootIds =
    isConversationMode && selectedSuspect && selectedEvidenceId
      ? getRootQuestionIds(
          selectedSuspect.evidence_reactions[selectedEvidenceId]?.pursuit_questions ?? []
        )
      : []
  const allRootUnlocked =
    rootIds.length > 0 && rootIds.every((id) => unlockedForCurrent.some((u) => u.questionId === id))

  const lastAskedQuestion = unlockedForCurrent
    .filter((u) => askedPursuitQuestionIds.includes(u.questionId))
    .at(-1)
  const lastAskedQuestionData = lastAskedQuestion
    ? selectedSuspect?.evidence_reactions[lastAskedQuestion.evidenceId]?.pursuit_questions?.find(
        (q) => q.id === lastAskedQuestion.questionId
      )
    : null

  const currentWrongResult =
    pursuitWrongResult?.suspectId === selectedSuspectId ? pursuitWrongResult : null

  const confrontedEvidenceIds = selectedSuspectId
    ? [
        ...new Set(
          confrontationLog.filter((c) => c.suspectId === selectedSuspectId).map((c) => c.evidenceId)
        ),
      ]
    : []

  // 突きつけ結果が優先、なければ最後の追及質問の回答を表示
  const dialogReaction =
    latestReaction ??
    (lastAskedQuestionData
      ? { reaction: lastAskedQuestionData.response, behavior: lastAskedQuestionData.behavior }
      : null)

  // スライダーで表示する3人分のインデックス（中央 + 前後1人）
  const total = scenario.suspects.length
  const visibleIndices = [(sliderIndex - 1 + total) % total, sliderIndex, (sliderIndex + 1) % total]

  // --- ハンドラ ---
  const handleSuspectClick = (suspectId: string) => {
    // スライダー位置を選択した容疑者に同期
    const idx = scenario.suspects.findIndex((s) => s.id === suspectId)
    if (idx >= 0) setSliderIndex(idx)
    setSelectedSuspectId(suspectId)
    setSelectedEvidenceId(null)
    setShowEvidenceModal(true)
    if (pursuitWrongResult) clearPursuitWrongResult()
  }

  const handleBackToList = () => {
    setSelectedSuspectId(null)
    setSelectedEvidenceId(null)
    if (pursuitWrongResult) clearPursuitWrongResult()
  }

  const handleEvidenceSelect = (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId)
    setShowEvidenceModal(false)
  }

  const handleConfront = () => {
    if (!selectedSuspect || !selectedEvidence) return
    const reaction = selectedSuspect.evidence_reactions[selectedEvidence.id]
    if (reaction) {
      addConfrontation({
        suspectId: selectedSuspect.id,
        evidenceId: selectedEvidence.id,
        reaction: reaction.reaction,
        behavior: reaction.behavior,
      })
    }
    if (pursuitWrongResult) clearPursuitWrongResult()
  }

  const handleInitiatePursuit = () => {
    if (!selectedSuspectId || !selectedEvidenceId) return
    initiatePursuitActivation(selectedSuspectId, selectedEvidenceId)
  }

  const handleAskPursuit = (questionId: string) => {
    if (!selectedSuspectId || !selectedEvidenceId) return
    askPursuitQuestion(selectedSuspectId, selectedEvidenceId, questionId)
  }

  return (
    <div className="min-h-screen px-4 py-4">
      <CombinationDiscovery />
      <FakeRevealModal />
      {showNotes && (
        <InvestigationNotes
          onClose={handleNotesClose}
          pursuitMode={
            pendingPursuitActivation
              ? {
                  suspectId: pendingPursuitActivation.suspectId,
                  onSelect: (suspectId, statementIndex) => {
                    selectTestimonyForPursuit(suspectId, statementIndex)
                    setShowNotesManual(false)
                  },
                  onCancel: handleNotesClose,
                }
              : undefined
          }
        />
      )}
      {showEvidenceModal && selectedSuspect && (
        <EvidenceSelectModal
          suspectName={selectedSuspect.name}
          discoveredIds={inspectedEvidenceIds}
          confrontedEvidenceIds={confrontedEvidenceIds}
          onSelect={handleEvidenceSelect}
          onClose={() => {
            setShowEvidenceModal(false)
            // 証拠未選択のままモーダルを閉じた場合、スライダーに戻す
            if (!selectedEvidenceId) {
              setSelectedSuspectId(null)
            }
          }}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h1 className="font-display text-xl text-gothic-gold tracking-widest">議論フェーズ</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotesManual(true)}
              className="border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted hover:text-gothic-text font-serif text-xs py-2 px-3 transition-all"
            >
              捜査メモ
            </button>
            <button
              onClick={() => setPhase('voting')}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display text-xs tracking-widest py-2 px-4 transition-all hover:shadow-[0_0_12px_rgba(217,119,6,0.3)]"
            >
              投票へ進む
            </button>
          </div>
        </div>

        {/* メインビジュアル */}
        <div
          className="relative w-full border border-gothic-border overflow-hidden"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="absolute inset-0">
            <PixelImageWithFallback
              src={MANSION_DEFAULT_ASSET}
              alt="館"
              pixelSize={PIXEL_ART_CONFIG.pixelSize.mansion}
              canvasWidth={PIXEL_ART_CONFIG.canvasSize.mansion.width}
              canvasHeight={PIXEL_ART_CONFIG.canvasSize.mansion.height}
              fallbackSrc={MANSION_DEFAULT_ASSET}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* 一覧モード: スライダー */}
          {!isConversationMode && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-[60%] flex items-center justify-center gap-3 sm:gap-5 px-4">
              <button
                onClick={() => setSliderIndex((prev) => (prev <= 0 ? total - 1 : prev - 1))}
                className={sliderArrowClass}
              >
                <span className="font-display text-sm">◀</span>
              </button>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-end justify-center gap-3 sm:gap-5">
                  {visibleIndices.map((idx, pos) => (
                    <div
                      key={scenario.suspects[idx].id}
                      className={cn(
                        'transition-all duration-300',
                        pos === 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
                      )}
                    >
                      <CharacterCard
                        suspect={scenario.suspects[idx]}
                        portrait
                        selected={pos === 1}
                        onClick={() => handleSuspectClick(scenario.suspects[idx].id)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {scenario.suspects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSliderIndex(i)}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-all',
                        i === sliderIndex
                          ? 'bg-gothic-gold'
                          : 'bg-gothic-border/60 hover:bg-gothic-muted'
                      )}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSliderIndex((prev) => (prev >= total - 1 ? 0 : prev + 1))}
                className={sliderArrowClass}
              >
                <span className="font-display text-sm">▶</span>
              </button>
            </div>
          )}

          {/* 会話モード */}
          {isConversationMode && selectedSuspect && (
            <>
              <button
                onClick={handleBackToList}
                className="absolute top-3 left-3 z-10 bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border hover:border-gothic-accent text-gothic-muted hover:text-gothic-text font-serif text-xs py-1.5 px-3 transition-all"
              >
                ← 容疑者一覧
              </button>

              <div className="absolute inset-x-0 bottom-24 flex justify-center">
                <div className="transition-all duration-300">
                  <CharacterCard
                    suspect={selectedSuspect}
                    portrait
                    selected
                    onClick={() => setShowEvidenceModal(true)}
                  />
                </div>
              </div>
            </>
          )}

          {/* ダイアログエリア */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            {dialogReaction && selectedSuspect ? (
              <div
                className={cn(
                  'bg-gothic-panel/85 backdrop-blur-sm border-2',
                  behaviorBorderColors[dialogReaction.behavior]
                )}
              >
                <DialogBox
                  key={`${selectedSuspectId}-${selectedEvidenceId}-${confrontationLog.length}`}
                  text={dialogReaction.reaction}
                  speakerName={`${selectedSuspect.name} ─ ${behaviorLabel[dialogReaction.behavior]}`}
                />
                {hasContradiction && latestReaction && (
                  <p className="px-4 pb-3 border-t border-yellow-700/50 pt-2 text-yellow-400 font-serif text-xs">
                    ⚠ この証拠はあなたが聞いたある証言と矛盾している
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border p-4">
                <p className="text-gothic-muted font-serif text-sm text-center">
                  容疑者をクリックして証拠を突きつける
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 操作パネル */}
        {selectedSuspect && selectedEvidence && (
          <div className="mt-4 space-y-3">
            <div className="border border-gothic-border bg-gothic-panel p-4">
              <p className="text-gothic-muted font-serif text-sm mb-3">
                <span className="text-gothic-text">{selectedSuspect.name}</span>に
                <span className="text-gothic-gold">「{selectedEvidence.name}」</span>を突きつける
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfront}
                  className="flex-1 border border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text font-display tracking-widest py-3 transition-all text-sm"
                >
                  突きつける
                </button>
                <button
                  onClick={() => setShowEvidenceModal(true)}
                  className="border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted font-serif py-3 px-4 transition-all text-sm"
                >
                  証拠を変更
                </button>
              </div>
            </div>

            {latestReaction && (hasPursuitQuestions ? !allRootUnlocked : !currentWrongResult) && (
              <button
                onClick={handleInitiatePursuit}
                className="w-full border border-yellow-700 bg-yellow-950/20 hover:bg-yellow-900/30 text-yellow-300 font-display tracking-widest py-2 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>⚑</span>
                <span>矛盾を追及する</span>
              </button>
            )}

            {currentWrongResult && (
              <div className="border border-stone-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm text-stone-400">
                    {selectedSuspect.name}
                  </span>
                  <span className="text-xs border border-stone-700 text-stone-500 px-2 py-0.5 font-serif">
                    的外れ
                  </span>
                </div>
                <p className="font-serif text-stone-400 text-sm">
                  「{currentWrongResult.response}」
                </p>
              </div>
            )}

            {unlockedForCurrent.length > 0 && (
              <div className="border border-yellow-700/60 bg-stone-900/60 p-3 space-y-2">
                <h4 className="font-display text-yellow-400 text-xs tracking-widest flex items-center gap-2">
                  <span>⚑</span>
                  <span>追及質問</span>
                </h4>
                {unlockedForCurrent.map(({ questionId, evidenceId }) => {
                  const qData = selectedSuspect.evidence_reactions[
                    evidenceId
                  ]?.pursuit_questions?.find((q) => q.id === questionId)
                  if (!qData) return null
                  const isAsked = askedPursuitQuestionIds.includes(questionId)
                  return (
                    <button
                      key={questionId}
                      onClick={() => !isAsked && handleAskPursuit(questionId)}
                      disabled={isAsked}
                      className={`w-full text-left border px-3 py-2 font-serif text-sm transition-all ${
                        isAsked
                          ? 'border-stone-700 text-stone-600 cursor-default'
                          : 'border-yellow-700 text-yellow-200 hover:bg-yellow-900/20 hover:border-yellow-500'
                      }`}
                    >
                      {isAsked && <span className="text-stone-600 mr-2">✓</span>}「{qData.text}」
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
