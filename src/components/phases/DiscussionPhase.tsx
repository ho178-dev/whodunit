// 議論フェーズの画面。館背景にキャラクターを配置し、証拠突きつけ・追及質問を管理する
// 一覧モード（スライダー）と会話モード（選択キャラ中央表示）を切り替える
// 証拠選択は捜査メモの証拠品タブで行い、EvidenceSelectModal は廃止
// 矛盾を追求ボタン・追及質問リストは CenterActionArea に集約
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
import { behaviorBorderColors, behaviorLabel } from '../../constants/npcBehavior'
import { cn } from '../../utils/cn'
import { RightPanel } from '../layout/RightPanel'
import { LeftSpecialPanel } from '../layout/LeftSpecialPanel'
import { CenterActionArea } from '../layout/CenterActionArea'
import { PanelButton } from '../layout/PanelButton'
import { NotesIcon } from '../shared/Icons'
import { resolveMansionAsset } from '../../services/assetResolver'
import { DISCUSSION_CONFRONT_ACTIONS } from '../../constants/gameConfig'

// 議論フェーズのメインコンポーネント
export function DiscussionPhase() {
  const {
    scenario,
    setPhase,
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
  const [showNotes, setShowNotes] = useState(false)
  const [notesMode, setNotesMode] = useState<'normal' | 'evidence_select'>('normal')
  const [sliderIndex, setSliderIndex] = useState(0)
  // 追及質問クリック後、プレイヤーの発言をダイアログに表示するための一時状態
  const [pendingPlayerText, setPendingPlayerText] = useState<{
    text: string
    questionId: string
  } | null>(null)
  // 続きを聞くボタンの表示制御（追及質問の返答アニメーション完了後に表示）
  const [playerDialogDone, setPlayerDialogDone] = useState(false)

  // 追及質問モードのメモ表示（pursuitMode が有効な場合はノーマルモードを上書き）
  const shouldShowNotes = showNotes || pendingPursuitActivation !== null

  if (!scenario) return null

  const handleNotesClose = () => {
    setShowNotes(false)
    setNotesMode('normal')
    clearPursuitActivation()
  }

  const selectedEvidence = selectedEvidenceId
    ? scenario.evidence.find((e) => e.id === selectedEvidenceId)
    : null
  const selectedSuspect = selectedSuspectId
    ? scenario.suspects.find((s) => s.id === selectedSuspectId)
    : null

  // 会話モード: 突きつけ後に selectedSuspectId が設定された場合のみ（キャラクリックでは移行しない）
  const isConversationMode = selectedSuspectId !== null

  // 次回突きつけのターゲット: 選択済み容疑者 OR スライダー中央の容疑者
  const targetSuspect = selectedSuspect ?? scenario.suspects[sliderIndex] ?? null

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

  // ターゲット容疑者に対する突きつけ済み証拠IDs（捜査メモの証拠品タブで表示用）
  const confrontedEvidenceIds = targetSuspect
    ? [
        ...new Set(
          confrontationLog.filter((c) => c.suspectId === targetSuspect.id).map((c) => c.evidenceId)
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

  // キャラクリック: スライダー位置を移動するのみ（会話モードには移行しない）
  const handleSuspectClick = (suspectId: string) => {
    const idx = scenario.suspects.findIndex((s) => s.id === suspectId)
    if (idx >= 0) setSliderIndex(idx)
    if (pursuitWrongResult) clearPursuitWrongResult()
  }

  const handleBackToList = () => {
    setSelectedSuspectId(null)
    setSelectedEvidenceId(null)
    if (pursuitWrongResult) clearPursuitWrongResult()
  }

  // 証拠を選ぶボタン: 常に有効。スライダー中央（または選択済み）の容疑者に対して開く
  const handleOpenEvidenceSelect = () => {
    setNotesMode('evidence_select')
    setShowNotes(true)
  }

  // 突きつけアクション（InvestigationNotes 内の確認ボタンから呼ばれる）
  // ターゲット容疑者に突きつけ、完了後に会話モードへ移行する
  const handleConfront = (evidenceId: string) => {
    if (!targetSuspect) return
    const reaction = targetSuspect.evidence_reactions[evidenceId]
    if (reaction) {
      addConfrontation({
        suspectId: targetSuspect.id,
        evidenceId,
        reaction: reaction.reaction,
        behavior: reaction.behavior,
      })
      consumeDiscussionConfrontAction()
    }
    // 突きつけ後に会話モードへ移行し、スライダーもターゲットに合わせる
    setSelectedSuspectId(targetSuspect.id)
    setSelectedEvidenceId(evidenceId)
    const idx = scenario.suspects.findIndex((s) => s.id === targetSuspect.id)
    if (idx >= 0) setSliderIndex(idx)
    setShowNotes(false)
    setNotesMode('normal')
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
    setPlayerDialogDone(false)
  }

  // 「続きを聞く」押下: 容疑者の返答を表示
  const handlePlayerDialogAdvance = () => {
    if (!pendingPlayerText || !selectedSuspectId || !selectedEvidenceId) return
    askPursuitQuestion(selectedSuspectId, selectedEvidenceId, pendingPlayerText.questionId)
    setPendingPlayerText(null)
    setPlayerDialogDone(false)
  }

  // 追及質問リストをCenterActionAreaに表示するかどうか
  const showPursuitList = unlockedForCurrent.length > 0
  // 矛盾を追求ボタンを表示するかどうか
  const showPursuitButton =
    !!latestReaction && (hasPursuitQuestions ? !allRootUnlocked : !currentWrongResult)

  return (
    <>
      <CombinationDiscovery />
      <FakeRevealModal />
      {shouldShowNotes && (
        <InvestigationNotes
          onClose={handleNotesClose}
          pursuitMode={
            pendingPursuitActivation
              ? {
                  suspectId: pendingPursuitActivation.suspectId,
                  onSelect: (suspectId, statementIndex) => {
                    selectTestimonyForPursuit(suspectId, statementIndex)
                    setShowNotes(false)
                    setNotesMode('normal')
                  },
                  onCancel: handleNotesClose,
                }
              : undefined
          }
          evidenceSelectMode={
            notesMode === 'evidence_select' && targetSuspect
              ? {
                  suspectName: targetSuspect.name,
                  actionLabel: '突きつける',
                  confrontedEvidenceIds,
                  onConfirm: handleConfront,
                  onCancel: () => {
                    setShowNotes(false)
                    setNotesMode('normal')
                  },
                }
              : undefined
          }
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

        {/* 会話モード: 単体キャラクター表示。スライダーと同じ位置（top-1/2 -translate-y-[60%]）に配置 */}
        {isConversationMode && selectedSuspect && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-[60%] flex justify-center">
            <CharacterCard suspect={selectedSuspect} portrait selected />
          </div>
        )}

        {/* CenterActionArea: 矛盾警告バナーのみ */}
        {isConversationMode && hasContradiction && latestReaction && !currentWrongResult && (
          <CenterActionArea>
            <div className="bg-yellow-900/60 border border-yellow-500 text-yellow-200 font-serif text-xs px-4 py-2 text-center w-full max-w-md">
              ⚠ この証拠はあなたが聞いたある証言と矛盾している
            </div>
          </CenterActionArea>
        )}

        {/* ダイアログエリア（フル幅・下部固定） */}
        <div className="absolute inset-x-0 bottom-0 p-2">
          {pendingPlayerText ? (
            <div className="relative bg-gothic-panel/85 backdrop-blur-sm border-2 border-blue-700/60">
              <DialogBox
                key={`player-${pendingPlayerText.questionId}`}
                text={`「${pendingPlayerText.text}」`}
                speakerName="あなた"
                onComplete={() => setPlayerDialogDone(true)}
              />
              {playerDialogDone && (
                <button
                  onClick={handlePlayerDialogAdvance}
                  className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
                >
                  続きを聞く →
                </button>
              )}
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
            </div>
          ) : (
            <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border p-4">
              <p className="text-gothic-muted font-serif text-sm text-center">
                {isConversationMode
                  ? '「証拠を選ぶ」で証拠を選んで突きつけてください'
                  : '容疑者を選んで証拠を突きつける'}
              </p>
            </div>
          )}
        </div>

        {/* 左特別パネル（会話モード時のみ: 容疑者一覧に戻るボタン） */}
        {isConversationMode && (
          <LeftSpecialPanel>
            <button
              onClick={handleBackToList}
              className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 hover:border-gothic-accent px-3 py-2 text-gothic-muted hover:text-gothic-text font-serif text-xs transition-all text-left w-full"
            >
              ← 容疑者一覧
            </button>
          </LeftSpecialPanel>
        )}

        {/* 右パネル */}
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
            <PanelButton variant="primary" onClick={handleOpenEvidenceSelect}>
              証拠を選ぶ
            </PanelButton>
          }
          slot4={
            <div className="flex flex-col gap-2">
              <PanelButton
                variant="secondary"
                onClick={() => {
                  setNotesMode('normal')
                  setShowNotes(true)
                }}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <NotesIcon size={13} />
                  <span>捜査メモ</span>
                </span>
              </PanelButton>

              {/* 矛盾を追求ボタン（捜査メモ直下・質問リスト未解放時） */}
              {showPursuitButton && !showPursuitList && (
                <button
                  onClick={handleInitiatePursuit}
                  className="w-full bg-yellow-950/70 backdrop-blur-sm border border-yellow-700 hover:bg-yellow-900/50 text-yellow-300 font-display tracking-widest py-2 transition-all text-[10px] flex items-center justify-center gap-1"
                >
                  <span>⚑</span>
                  <span>矛盾を追及</span>
                </button>
              )}

              {/* 追及質問リスト（捜査メモ直下・質問解放後） */}
              {showPursuitList && (
                <div className="bg-stone-900/80 backdrop-blur-sm border border-yellow-700/50">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-yellow-700/40">
                    <p className="font-display text-yellow-400 text-[9px] tracking-widest flex items-center gap-1">
                      <span>⚑</span>
                      <span>追及質問</span>
                    </p>
                    {showPursuitButton && (
                      <button
                        onClick={handleInitiatePursuit}
                        className="bg-yellow-950/70 border border-yellow-700 hover:bg-yellow-900/50 text-yellow-300 font-display tracking-widest py-0.5 px-1.5 transition-all text-[9px]"
                      >
                        ＋追及
                      </button>
                    )}
                  </div>
                  <div className="px-1.5 py-1.5 space-y-1 max-h-32 overflow-y-auto game-scrollbar">
                    {unlockedForCurrent.map(({ questionId }, idx) => {
                      const isAsked = askedPursuitQuestionIds.includes(questionId)
                      return (
                        <button
                          key={questionId}
                          onClick={() => !isAsked && handleAskPursuit(questionId)}
                          disabled={isAsked}
                          className={`w-full border px-1.5 py-1 font-display text-[9px] tracking-widest transition-all flex items-center justify-center gap-1 ${
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
                    <p className="text-center text-yellow-500/70 font-display text-[9px] tracking-widest py-1.5 border-t border-yellow-700/30">
                      ── 追及完了 ──
                    </p>
                  )}
                </div>
              )}
            </div>
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
