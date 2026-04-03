// 議論フェーズの画面。館背景にキャラクターを配置し、証拠突きつけ・追及質問を管理する
// 一覧モード（スライダー）と会話モード（選択キャラ中央表示）を切り替える
// 会話モード時は左特別パネルに操作UIを表示し、ダイアログはフル幅で下部に配置する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getRootQuestionIds } from '../../utils/scenario'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { CombinationDiscovery } from '../investigation/CombinationDiscovery'
import { FakeRevealModal } from '../investigation/FakeRevealModal'
import { CharacterCard } from '../shared/CharacterCard'
import { CharacterSlider } from '../shared/CharacterSlider'
import { DialogBox } from '../shared/DialogBox'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { EvidenceSelectModal } from '../discussion/EvidenceSelectModal'
import { behaviorBorderColors, behaviorLabel } from '../../constants/npcBehavior'
import { cn } from '../../utils/cn'
import { RightPanel } from '../layout/RightPanel'
import { LeftSpecialPanel } from '../layout/LeftSpecialPanel'
import { PanelButton } from '../layout/PanelButton'
import { NotesIcon } from '../shared/Icons'
import { resolveMansionAsset } from '../../services/assetResolver'
import { DISCUSSION_CONFRONT_ACTIONS } from '../../constants/gameConfig'

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
    discussionConfrontActionsRemaining,
    consumeDiscussionConfrontAction,
  } = useGameStore()

  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null)
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [showNotesManual, setShowNotesManual] = useState(false)
  const [sliderIndex, setSliderIndex] = useState(0)
  // 追及質問クリック後、プレイヤーの発言をダイアログに表示するための一時状態
  const [pendingPlayerText, setPendingPlayerText] = useState<{
    text: string
    questionId: string
  } | null>(null)

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

  const allQuestionsAsked =
    unlockedForCurrent.length > 0 &&
    unlockedForCurrent.every(({ questionId }) => askedPursuitQuestionIds.includes(questionId))

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

  // 的外れ応答 → 追及質問回答 → 突きつけ結果(latestReaction)の優先順で表示
  const dialogReaction =
    (currentWrongResult
      ? { reaction: currentWrongResult.response, behavior: 'calm' as const }
      : null) ??
    (lastAskedQuestionData
      ? { reaction: lastAskedQuestionData.response, behavior: lastAskedQuestionData.behavior }
      : null) ??
    latestReaction

  const handleSuspectClick = (suspectId: string) => {
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
      consumeDiscussionConfrontAction()
    }
    if (pursuitWrongResult) clearPursuitWrongResult()
  }

  const handleInitiatePursuit = () => {
    if (!selectedSuspectId || !selectedEvidenceId) return
    initiatePursuitActivation(selectedSuspectId, selectedEvidenceId)
  }

  // 追及質問ボタン押下: まずプレイヤーの発言をダイアログに表示
  const handleAskPursuit = (questionId: string) => {
    if (!selectedSuspectId || !selectedEvidenceId || !selectedSuspect) return
    const qData = selectedSuspect.evidence_reactions[selectedEvidenceId]?.pursuit_questions?.find(
      (q) => q.id === questionId
    )
    if (!qData) return
    setPendingPlayerText({ text: qData.text, questionId })
  }

  // 「続ける」ボタン押下: 容疑者の返答を表示
  const handlePlayerDialogAdvance = () => {
    if (!pendingPlayerText || !selectedSuspectId || !selectedEvidenceId) return
    askPursuitQuestion(selectedSuspectId, selectedEvidenceId, pendingPlayerText.questionId)
    setPendingPlayerText(null)
  }

  const leftPanel =
    isConversationMode && selectedSuspect && selectedEvidence ? (
      <LeftSpecialPanel>
        <button
          onClick={handleBackToList}
          className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 hover:border-gothic-accent px-3 py-2 text-gothic-muted hover:text-gothic-text font-serif text-xs transition-all text-left w-full"
        >
          ← 容疑者一覧
        </button>

        {/* 突きつけコンテキスト */}
        <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-3 py-2">
          <p className="text-gothic-muted font-serif text-[10px] leading-relaxed">
            <span className="text-gothic-text">{selectedSuspect.name}</span>
            {'に'}
            <br />
            <span className="text-gothic-gold">「{selectedEvidence.name}」</span>
            {'を突きつける'}
          </p>
        </div>

        {/* 突きつけボタン */}
        <PanelButton variant="primary" onClick={handleConfront}>
          突きつける
        </PanelButton>

        {/* 矛盾を追及する */}
        {latestReaction && (hasPursuitQuestions ? !allRootUnlocked : !currentWrongResult) && (
          <button
            onClick={handleInitiatePursuit}
            className="w-full bg-yellow-950/70 backdrop-blur-sm border border-yellow-700 hover:bg-yellow-900/50 text-yellow-300 font-display tracking-widest py-2 transition-all text-[10px] flex items-center justify-center gap-1"
          >
            <span>⚑</span>
            <span>矛盾を追及</span>
          </button>
        )}

        {/* 追及質問リスト（専用コンテナでスクロール） */}
        {unlockedForCurrent.length > 0 && (
          <div className="bg-stone-900/80 backdrop-blur-sm border border-yellow-700/50 overflow-y-auto game-scrollbar max-h-44">
            <p className="font-display text-yellow-400 text-[10px] tracking-widest px-3 py-2 border-b border-yellow-700/40 flex items-center gap-1">
              <span>⚑</span>
              <span>追及質問</span>
            </p>
            <div className="px-2 py-2 space-y-1.5">
              {unlockedForCurrent.map(({ questionId }, idx) => {
                const isAsked = askedPursuitQuestionIds.includes(questionId)
                return (
                  <button
                    key={questionId}
                    onClick={() => !isAsked && handleAskPursuit(questionId)}
                    disabled={isAsked}
                    className={`w-full border px-2 py-1.5 font-display text-[10px] tracking-widest transition-all flex items-center justify-center gap-1 ${
                      isAsked
                        ? 'border-stone-700 text-stone-600 cursor-default'
                        : 'border-yellow-700 text-yellow-200 hover:bg-yellow-900/20'
                    }`}
                  >
                    {isAsked ? (
                      <>
                        <span>✓</span>
                        <span>追及済み {idx + 1}</span>
                      </>
                    ) : (
                      <>
                        <span>⚑</span>
                        <span>追及する {idx + 1}</span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
            {allQuestionsAsked && (
              <p className="text-center text-yellow-500/70 font-display text-[10px] tracking-widest py-2 border-t border-yellow-700/30">
                ── 追及完了 ──
              </p>
            )}
          </div>
        )}
      </LeftSpecialPanel>
    ) : null

  return (
    <>
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
            if (!selectedEvidenceId) {
              setSelectedSuspectId(null)
            }
          }}
        />
      )}

      <div className="relative h-full overflow-hidden">
        {/* シナリオの館背景IDを使用して背景画像を表示する */}
        <MansionSceneBackground
          phase="discussion"
          mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
        />

        {/* 一覧モード: スライダー（フル幅） */}
        {!isConversationMode && (
          <CharacterSlider
            suspects={scenario.suspects}
            sliderIndex={sliderIndex}
            onSliderIndexChange={setSliderIndex}
            onSuspectClick={handleSuspectClick}
          />
        )}

        {/* 会話モード: キャラクター中央表示（フル幅） */}
        {isConversationMode && selectedSuspect && (
          <div className="absolute inset-x-0 bottom-28 game-md:bottom-[130px] game-lg:bottom-36 flex justify-center">
            <div className="transition-all duration-300">
              <CharacterCard
                suspect={selectedSuspect}
                portrait
                selected
                onClick={() => setShowEvidenceModal(true)}
              />
            </div>
          </div>
        )}

        {/* ダイアログエリア（フル幅・下部固定） */}
        <div className="absolute inset-x-0 bottom-0 p-2 game-md:p-3">
          {pendingPlayerText ? (
            <div className="bg-gothic-panel/85 backdrop-blur-sm border-2 border-blue-700/60">
              <DialogBox
                key={`player-${pendingPlayerText.questionId}`}
                text={`「${pendingPlayerText.text}」`}
                speakerName="あなた"
              />
              <div className="px-4 pb-3 flex justify-end">
                <button
                  onClick={handlePlayerDialogAdvance}
                  className="bg-blue-900/60 border border-blue-700 text-blue-200 font-serif text-xs px-4 py-1.5 hover:bg-blue-800/60 transition-all"
                >
                  続ける →
                </button>
              </div>
            </div>
          ) : dialogReaction && selectedSuspect ? (
            <div
              className={cn(
                'bg-gothic-panel/85 backdrop-blur-sm border-2',
                behaviorBorderColors[dialogReaction.behavior]
              )}
            >
              <DialogBox
                key={`${selectedSuspectId}-${selectedEvidenceId}-${confrontationLog.length}-${currentWrongResult ? 'wrong' : ''}`}
                text={dialogReaction.reaction}
                speakerName={`${selectedSuspect.name} ─ ${currentWrongResult ? '的外れ' : behaviorLabel[dialogReaction.behavior]}`}
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

        {/* 左特別パネル（会話モード時のみ） */}
        {leftPanel}

        {/* 右パネル（slot1はGameShellの右上ヘッダーに移管） */}
        <RightPanel
          slot2={
            <div className="flex items-center gap-2">
              <span className="text-gothic-muted font-serif text-[clamp(9px,1.3vh,12px)]">
                突きつけ
              </span>
              <span className="text-gothic-gold font-pixel text-[clamp(11px,1.5vh,14px)]">
                {discussionConfrontActionsRemaining}/{DISCUSSION_CONFRONT_ACTIONS}
              </span>
            </div>
          }
          slot3={
            <PanelButton
              variant="primary"
              disabled={!selectedSuspectId}
              onClick={() => setShowEvidenceModal(true)}
            >
              証拠を選ぶ
            </PanelButton>
          }
          slot4={
            <PanelButton variant="secondary" onClick={() => setShowNotesManual(true)}>
              <span className="flex items-center justify-center gap-1.5">
                <NotesIcon size={13} />
                <span>捜査メモ</span>
              </span>
            </PanelButton>
          }
          slot5={
            <PanelButton variant="glow" onClick={() => setPhase('voting')}>
              投票へ進む
            </PanelButton>
          }
        />
      </div>
    </>
  )
}
