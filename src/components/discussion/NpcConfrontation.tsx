// 議論フェーズで容疑者を選んで証拠を突きつけ、リアクションと追及質問を表示するコンポーネント
import { useGameStore } from '../../stores/gameStore'
import { getRootQuestionIds } from '../../utils/scenario'
import { GothicPanel } from '../layout/GothicPanel'
import { CharacterCard } from '../shared/CharacterCard'
import { ReactionDisplay } from './ReactionDisplay'

interface NpcConfrontationProps {
  selectedEvidenceId: string | null
  selectedSuspectId: string | null
  onSelectSuspect: (id: string) => void
}

// 容疑者選択と証拠突きつけ操作、リアクション・追及質問表示を担うコンポーネント
export function NpcConfrontation({
  selectedEvidenceId,
  selectedSuspectId,
  onSelectSuspect,
}: NpcConfrontationProps) {
  const {
    scenario,
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
  if (!scenario) return null

  const selectedEvidence = selectedEvidenceId
    ? scenario.evidence.find((e) => e.id === selectedEvidenceId)
    : null
  const selectedSuspect = selectedSuspectId
    ? scenario.suspects.find((s) => s.id === selectedSuspectId)
    : null

  const latestReaction =
    selectedSuspectId && selectedEvidenceId
      ? confrontationLog
          .filter((c) => c.suspectId === selectedSuspectId && c.evidenceId === selectedEvidenceId)
          .slice(-1)[0]
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

  // true=本物チェーン、false=フェイク追及（区別してボタン表示を制御）
  const hasPursuitQuestions =
    !!selectedSuspect &&
    !!selectedEvidenceId &&
    !!selectedSuspect.evidence_reactions[selectedEvidenceId]?.pursuit_questions?.length

  const allRootUnlocked = (() => {
    if (!selectedSuspect || !selectedEvidenceId) return false
    const pqs = selectedSuspect.evidence_reactions[selectedEvidenceId]?.pursuit_questions ?? []
    const rootIds = getRootQuestionIds(pqs)
    return (
      rootIds.length > 0 &&
      rootIds.every((id) => unlockedForCurrent.some((u) => u.questionId === id))
    )
  })()

  const lastAskedQuestion = unlockedForCurrent
    .filter((u) => askedPursuitQuestionIds.includes(u.questionId))
    .slice(-1)[0]
  const lastAskedQuestionData = lastAskedQuestion
    ? selectedSuspect?.evidence_reactions[lastAskedQuestion.evidenceId]?.pursuit_questions?.find(
        (q) => q.id === lastAskedQuestion.questionId
      )
    : null

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

  const currentWrongResult =
    pursuitWrongResult?.suspectId === selectedSuspectId ? pursuitWrongResult : null

  return (
    <GothicPanel title="証拠を突きつける">
      <div className="space-y-4">
        <div>
          <h4 className="font-display text-gothic-muted text-xs tracking-widest mb-2">
            容疑者を選択
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {scenario.suspects.map((suspect) => (
              <button
                key={suspect.id}
                onClick={() => onSelectSuspect(suspect.id)}
                className="text-left"
              >
                <CharacterCard
                  suspect={suspect}
                  small
                  selected={suspect.id === selectedSuspectId}
                />
              </button>
            ))}
          </div>
        </div>

        {selectedSuspect && selectedEvidence && (
          <div>
            <p className="text-gothic-muted font-serif text-sm mb-3">
              <span className="text-gothic-text">{selectedSuspect.name}</span>に
              <span className="text-gothic-gold">「{selectedEvidence.name}」</span>を突きつける
            </p>
            <button
              onClick={handleConfront}
              className="w-full border border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text font-display tracking-widest py-3 transition-all text-sm"
            >
              突きつける
            </button>
          </div>
        )}

        {latestReaction && selectedSuspect && (
          <ReactionDisplay
            reaction={latestReaction.reaction}
            behavior={latestReaction.behavior}
            suspectName={selectedSuspect.name}
            hasContradiction={hasContradiction}
          />
        )}

        {/* 追及ボタン：証拠突きつけ済みなら全員表示（本物チェーン=未完了まで、フェイク=初回のみ） */}
        {latestReaction &&
          selectedSuspect &&
          (hasPursuitQuestions ? !allRootUnlocked : !currentWrongResult) && (
            <button
              onClick={handleInitiatePursuit}
              className="w-full border border-yellow-700 bg-yellow-950/20 hover:bg-yellow-900/30 text-yellow-300 font-display tracking-widest py-2 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>⚑</span>
              <span>矛盾を追及する</span>
            </button>
          )}

        {/* 誤った証言を選択したときのフィードバック */}
        {currentWrongResult && selectedSuspect && (
          <div className="border border-stone-600 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm text-stone-400">{selectedSuspect.name}</span>
              <span className="text-xs border border-stone-700 text-stone-500 px-2 py-0.5 font-serif">
                的外れ
              </span>
            </div>
            <p className="font-serif text-stone-400 text-sm">「{currentWrongResult.response}」</p>
          </div>
        )}

        {/* アンロック済み追及質問エリア */}
        {unlockedForCurrent.length > 0 && selectedSuspect && (
          <div className="border border-yellow-700/60 bg-stone-900/60 p-3 space-y-2">
            <h4 className="font-display text-yellow-400 text-xs tracking-widest flex items-center gap-2">
              <span>⚑</span>
              <span>追及質問</span>
            </h4>
            {unlockedForCurrent.map(({ questionId, evidenceId }) => {
              const qData = selectedSuspect.evidence_reactions[evidenceId]?.pursuit_questions?.find(
                (q) => q.id === questionId
              )
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

        {/* 最後に質問した追及質問のレスポンス */}
        {lastAskedQuestionData && selectedSuspect && (
          <ReactionDisplay
            reaction={lastAskedQuestionData.response}
            behavior={lastAskedQuestionData.behavior}
            suspectName={selectedSuspect.name}
          />
        )}
      </div>
    </GothicPanel>
  )
}
