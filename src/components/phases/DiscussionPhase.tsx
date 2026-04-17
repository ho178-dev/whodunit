// 議論フェーズの画面。館背景にキャラクターを配置し、証拠突きつけ・追及質問を管理する
// 一覧モード（スライダー）と会話モード（選択キャラ中央表示）を切り替える
// 証拠選択は捜査メモの証拠品タブで行い、EvidenceSelectModal は廃止
// 矛盾を追求ボタン・追及質問リストは CenterActionArea に集約
import { useState, useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getRootQuestionIds } from '../../utils/scenario'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { CombinationDiscovery } from '../investigation/CombinationDiscovery'
import { FakeRevealModal } from '../investigation/FakeRevealModal'
import { CharacterCard } from '../shared/CharacterCard'
import { CharacterSlider } from '../shared/CharacterSlider'
import { DialogBox, type DialogBoxHandle } from '../shared/DialogBox'
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
import type { BystanderReaction } from '../../types/scenario'

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
  // 「追求する」ボタンの表示制御（プレイヤー発言ダイアログのタイプライター完了後に進行可能）
  const [playerDialogDone, setPlayerDialogDone] = useState(false)
  // 矛盾追及成功時に表示する他キャラのリアクション
  const [bystanderReactions, setBystanderReactions] = useState<BystanderReaction[]>([])
  const [bystanderIndex, setBystanderIndex] = useState(0)
  // 容疑者返答ダイアログのタイプライター完了状態（次の追求ボタン表示に使用）
  const [dialogReactionDone, setDialogReactionDone] = useState(false)
  // プレイヤー発言ダイアログのref（タイプライター中にボタンからスキップするために使用）
  const playerDialogRef = useRef<DialogBoxHandle>(null)

  // 追及質問モードのメモ表示（pursuitMode が有効な場合はノーマルモードを上書き）
  const shouldShowNotes = showNotes || pendingPursuitActivation !== null

  const dialogReactionKey = `${selectedSuspectId ?? ''}-${selectedEvidenceId ?? ''}-${confrontationLog.length}-${askedPursuitQuestionIds.length}-${pursuitWrongResult ? 'w' : 'n'}`
  const [prevDialogReactionKey, setPrevDialogReactionKey] = useState(dialogReactionKey)
  if (dialogReactionKey !== prevDialogReactionKey) {
    setPrevDialogReactionKey(dialogReactionKey)
    setDialogReactionDone(false)
  }

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

  const allQuestionsAsked =
    unlockedForCurrent.length > 0 &&
    unlockedForCurrent.every(({ questionId }) => askedPursuitQuestionIds.includes(questionId))

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
  // 矛盾を追求ボタンを表示するかどうか（突きつけ済み・追求質問あり・未開放時のみ）
  const showPursuitButton =
    !!latestReaction &&
    !!selectedSuspect &&
    !!selectedEvidenceId &&
    !!selectedSuspect.evidence_reactions[selectedEvidenceId]?.pursuit_questions?.length &&
    !unlockedPursuitQuestions.some(
      (u) => u.suspectId === selectedSuspectId && u.evidenceId === selectedEvidenceId
    )
  // 次に聞ける追及質問（解放済みかつ未回答の最初の質問）
  const nextPursuitQuestion =
    unlockedForCurrent.find((u) => !askedPursuitQuestionIds.includes(u.questionId)) ?? null

  // 追求状態バナーの内容（追求完了 > 追求中 > 矛盾警告 の優先順）
  const pursuitBanner = allQuestionsAsked
    ? { green: true, text: '追求完了' }
    : showPursuitList
      ? { green: false, text: '追求中' }
      : hasContradiction
        ? { green: false, text: '⚠ この証拠はあなたが聞いたある証言と矛盾している' }
        : null

  const currentBystanderReaction = bystanderReactions[bystanderIndex] ?? null
  const currentBystanderSuspect = currentBystanderReaction
    ? (scenario.suspects.find((s) => s.id === currentBystanderReaction.suspectId) ?? null)
    : null
  const isBystanderLast = bystanderIndex >= bystanderReactions.length - 1

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
                    // 追及前に pending 情報を保存してから実行（成功判定に使用）
                    const pending = pendingPursuitActivation
                    selectTestimonyForPursuit(suspectId, statementIndex)
                    // 成功判定: 追及後に pursuitWrongResult が null のまま → 正解
                    const { pursuitWrongResult: wr, unlockedPursuitQuestions: newUnlocked } =
                      useGameStore.getState()
                    if (!wr && pending) {
                      const suspect = scenario.suspects.find((s) => s.id === pending.suspectId)
                      const reactions =
                        suspect?.evidence_reactions[pending.evidenceId]?.bystander_reactions ?? []
                      if (reactions.length > 0) {
                        setBystanderReactions(reactions)
                        setBystanderIndex(0)
                        // バイスタンダー表示後に追求Q1を自動表示する（閉じるボタンで処理）
                      } else {
                        // バイスタンダーなし: 追求Q1を即時自動表示
                        const pqs =
                          suspect?.evidence_reactions[pending.evidenceId]?.pursuit_questions ?? []
                        const rootQIds = getRootQuestionIds(pqs)
                        const firstRoot = newUnlocked.find(
                          (u) =>
                            u.suspectId === pending.suspectId &&
                            u.evidenceId === pending.evidenceId &&
                            rootQIds.includes(u.questionId)
                        )
                        if (firstRoot) {
                          const qData = pqs.find((q) => q.id === firstRoot.questionId)
                          if (qData) {
                            setPendingPlayerText({ text: qData.text, questionId: qData.id })
                            setPlayerDialogDone(false)
                          }
                        }
                      }
                    }
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

        {/* 会話モード: キャラクター表示
            バイスタンダーあり → 2人横並び（NpcDialogと同様）: バイスタンダー左・メイン右
            バイスタンダーなし → メイン容疑者を中央に単体表示 */}
        {isConversationMode &&
          selectedSuspect &&
          (currentBystanderReaction && currentBystanderSuspect ? (
            <div className="absolute inset-x-0 bottom-28 flex items-end justify-between px-40">
              <CharacterCard suspect={currentBystanderSuspect} portrait selected />
              <CharacterCard suspect={selectedSuspect} portrait selected />
            </div>
          ) : (
            <div className="absolute inset-x-0 top-1/2 -translate-y-[60%] flex justify-center">
              <CharacterCard suspect={selectedSuspect} portrait selected />
            </div>
          ))}

        {/* CenterActionArea: 追求状態バナー（バイスタンダー表示中は非表示）
            追求完了 > 追求中 > 矛盾警告 の優先順で表示 */}
        {isConversationMode &&
          latestReaction &&
          !currentWrongResult &&
          !currentBystanderReaction && (
            <CenterActionArea>
              {pursuitBanner && (
                <div
                  className={cn(
                    'font-serif text-xs px-4 py-2 text-center w-full max-w-md',
                    pursuitBanner.green
                      ? 'bg-green-900/60 border border-green-500 text-green-200'
                      : 'bg-yellow-900/60 border border-yellow-500 text-yellow-200'
                  )}
                >
                  {pursuitBanner.text}
                </div>
              )}
            </CenterActionArea>
          )}

        {/* ダイアログエリア（フル幅・下部固定）
            優先順: バイスタンダー反応 > プレイヤー発言 > メイン容疑者反応 > デフォルト */}
        <div className="absolute inset-x-0 bottom-0 p-2">
          {currentBystanderReaction && currentBystanderSuspect ? (
            <div className="relative bg-gothic-panel/85 backdrop-blur-sm border-2 border-yellow-600/70 outline outline-1 outline-yellow-600/20 [outline-offset:-4px]">
              <DialogBox
                key={`bystander-${bystanderIndex}`}
                text={currentBystanderReaction.text}
                speakerName={`${currentBystanderSuspect.name} ─ 反応`}
              />
              <button
                onClick={() => {
                  if (isBystanderLast) {
                    setBystanderReactions([])
                    setBystanderIndex(0)
                    // バイスタンダー終了後、未回答の追求質問があれば自動表示
                    if (nextPursuitQuestion && selectedSuspect && selectedEvidenceId) {
                      handleAskPursuit(nextPursuitQuestion.questionId)
                    }
                  } else {
                    setBystanderIndex((i) => i + 1)
                  }
                }}
                className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
              >
                続きを聞く →
              </button>
            </div>
          ) : pendingPlayerText ? (
            <div className="relative bg-gothic-panel/85 backdrop-blur-sm border-2 border-blue-700/60 outline outline-1 outline-blue-700/20 [outline-offset:-4px]">
              <DialogBox
                ref={playerDialogRef}
                key={`player-${pendingPlayerText.questionId}`}
                text={`「${pendingPlayerText.text}」`}
                speakerName="あなた"
                onComplete={() => setPlayerDialogDone(true)}
              />
              {/* タイプライタ中: クリックで全文表示 / 完了後: 容疑者の返答へ進む */}
              <button
                onClick={() => {
                  if (!playerDialogDone) {
                    playerDialogRef.current?.skip()
                  } else {
                    handlePlayerDialogAdvance()
                  }
                }}
                className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
              >
                追求する →
              </button>
            </div>
          ) : dialogReaction && selectedSuspect ? (
            <div
              className={cn(
                'relative bg-gothic-panel/85 backdrop-blur-sm border-2',
                behaviorBorderColors[dialogReaction.behavior]
              )}
            >
              <DialogBox
                key={`${selectedSuspectId}-${selectedEvidenceId}-${confrontationLog.length}-${currentWrongResult ? 'wrong' : ''}`}
                text={dialogReaction.reaction}
                speakerName={`${selectedSuspect.name} ─ ${currentWrongResult ? '的外れ' : behaviorLabel[dialogReaction.behavior]}`}
                onComplete={() => setDialogReactionDone(true)}
              />
              {/* 容疑者返答完了後、次の追求質問があればダイアログ上から直接進める */}
              {dialogReactionDone && nextPursuitQuestion && !pendingPlayerText && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAskPursuit(nextPursuitQuestion.questionId)
                  }}
                  className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
                >
                  追求する →
                </button>
              )}
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
              className="game-button bg-gothic-panel border border-gothic-border/60 hover:border-gothic-accent px-3 py-2 text-gothic-muted hover:text-gothic-text font-serif text-xs transition-all text-left w-full"
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
          }
          slot4={
            <div className="flex flex-col gap-2">
              <PanelButton variant="primary" onClick={handleOpenEvidenceSelect}>
                証拠を選ぶ
              </PanelButton>

              {/* 矛盾を追及ボタン（追求質問解放前のみ表示） */}
              {showPursuitButton && (
                <button
                  onClick={handleInitiatePursuit}
                  className="game-button w-full bg-yellow-950/80 backdrop-blur-sm border border-yellow-700 hover:bg-yellow-900/70 text-yellow-300 font-display tracking-widest py-2 transition-all text-[10px] flex items-center justify-center gap-1"
                >
                  <span>⚑</span>
                  <span>矛盾を追及</span>
                </button>
              )}
            </div>
          }
          slot5={
            <PanelButton variant="glow" onClick={() => setPhase('voting')}>
              告発へ進む
            </PanelButton>
          }
        />
      </div>
    </>
  )
}
