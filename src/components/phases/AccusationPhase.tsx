// 断罪フェーズ。投票後・結末前に挿入される告発シーン。正解時は犯人との最終対決、不正解時も同一フローで進行し
// APが尽きると惜敗エンド（証拠不足型 or 誤告発型）へ移行する
// Step1: 証拠提示 → Step2: 反論 → Step3: 推理を突きつける → Step4: 紐づき判定
// 証拠・推理の選択は推理メモ（InvestigationNotes）上で行う
import { useState, useEffect, useMemo } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { audioManager } from '../../services/audioManager'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { CombinationDiscovery } from '../investigation/CombinationDiscovery'
import { cn } from '../../utils/cn'
import { RightPanel } from '../layout/RightPanel'
import { CenterActionArea } from '../layout/CenterActionArea'
import { PanelButton } from '../layout/PanelButton'
import { NotesIcon } from '../shared/Icons'
import { resolveMansionAsset } from '../../services/assetResolver'
import { ACCUSATION_CONFRONT_ACTIONS } from '../../constants/gameConfig'
import type { EvidenceCombination } from '../../types/scenario'

// 断罪シーンの進行ステップ
type AccusationStep =
  | 'defense'
  | 'select_evidence'
  | 'evidence_rebuttal'
  | 'select_reasoning'
  | 'wrong_link'
  | 'refutation'
  | 'breakdown'

interface StepDialog {
  text: string
  speakerName: string
  borderClass: string
}

// 断罪シーンのメインコンポーネント。内部ステートマシンで段階的に進行する
export function AccusationPhase() {
  const {
    scenario,
    votedSuspectId,
    inspectedEvidenceIds,
    successfulPursuitSuspectIds,
    setPhase,
    setMurdererEscaped,
    accusationConfrontActionsRemaining,
    consumeAccusationConfrontAction,
  } = useGameStore()

  const isCorrect = votedSuspectId === scenario?.murderer_id
  const [step, setStep] = useState<AccusationStep>('defense')
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [selectedCombinationId, setSelectedCombinationId] = useState<string | null>(null)
  const [showNotes, setShowNotes] = useState(false)
  const [dialogDoneStep, setDialogDoneStep] = useState<AccusationStep | null>(null)
  const dialogDone = dialogDoneStep === step

  const accusationData = scenario?.accusation_data ?? null
  const incorrectData =
    !isCorrect && accusationData && votedSuspectId
      ? (accusationData.incorrect[votedSuspectId] ?? null)
      : null

  // Step1 で選択できる証拠（発見済みの証拠品であれば提示可能）
  const selectableEvidence = useMemo(() => {
    return (scenario?.evidence ?? []).filter((e) => inspectedEvidenceIds.includes(e.id))
  }, [scenario?.evidence, inspectedEvidenceIds])

  const shouldSkip =
    !scenario || !votedSuspectId || !accusationData || (!isCorrect && !incorrectData)

  useEffect(() => {
    if (shouldSkip) setPhase('ending')
  }, [shouldSkip, setPhase])

  if (shouldSkip) return null

  const votedSuspect = scenario.suspects.find((s) => s.id === votedSuspectId)!

  // Step1 で選択した証拠オブジェクト
  const selectedEvidence = selectedEvidenceId
    ? scenario.evidence.find((e) => e.id === selectedEvidenceId)
    : null

  // Step3 で選択した推理（組み合わせ）オブジェクト
  const selectedCombination = selectedCombinationId
    ? (scenario.evidence_combinations ?? []).find((c) => c.id === selectedCombinationId)
    : null

  // 正解判定: 正しい容疑者 かつ 選択した推理が選択した証拠を含む かつ 議論フェーズで犯人追及済み
  const isCorrectConclusion = (combination: EvidenceCombination): boolean =>
    isCorrect &&
    combination.evidence_ids.includes(selectedEvidenceId ?? '') &&
    successfulPursuitSuspectIds.includes(scenario.murderer_id)

  const getActiveRebuttalText = (): string => {
    if (isCorrect) return accusationData!.correct.evidence_rebuttal
    return incorrectData!.evidence_rebuttal
  }

  const getWrongLinkText = (): string => {
    if (isCorrect) return accusationData!.correct.wrong_link_rebuttal
    return incorrectData!.wrong_link_rebuttal
  }

  // 証拠を選択してStep2へ（AP消費）
  const handleSelectEvidence = (evidenceId: string) => {
    audioManager.playSe('confront')
    consumeAccusationConfrontAction()
    setSelectedEvidenceId(evidenceId)
    setDialogDoneStep(null)
    setStep('evidence_rebuttal')
  }

  // 推理を選択してStep4（紐づき判定）
  const handleSelectCombination = (combination: EvidenceCombination) => {
    audioManager.playSe('confront')
    setSelectedCombinationId(combination.id)
    if (isCorrectConclusion(combination)) {
      setDialogDoneStep(null)
      setStep('refutation')
    } else {
      consumeAccusationConfrontAction()
      const nextAP = accusationConfrontActionsRemaining - 1
      if (nextAP <= 0) {
        triggerNearDefeat()
      } else {
        setDialogDoneStep(null)
        setStep('wrong_link')
      }
    }
  }

  // 証拠不足でエンディングへ移行: 正しい容疑者のみ inescaped フラグを立てる
  const triggerNearDefeat = () => {
    if (isCorrect) setMurdererEscaped(true)
    setPhase('ending')
  }

  // 「証拠を突きつける」: 選択状態をリセットして証拠選択へ（AP不足時は惜敗）
  const handleConfrontAction = () => {
    if (accusationConfrontActionsRemaining <= 0) {
      triggerNearDefeat()
    } else {
      setSelectedEvidenceId(null)
      setSelectedCombinationId(null)
      setDialogDoneStep(null)
      setStep('select_evidence')
      setShowNotes(true)
    }
  }

  // 「推理を語る」: 推理選択モードで捜査メモを開く
  const handleReasoningAction = () => {
    setStep('select_reasoning')
    setShowNotes(true)
  }

  const getStepDialog = (): StepDialog => {
    switch (step) {
      case 'defense':
        return {
          text: isCorrect
            ? accusationData!.correct.defense_statement
            : incorrectData!.defense_statement,
          speakerName: votedSuspect.name,
          borderClass: 'border-gothic-gold',
        }
      case 'select_evidence':
        return {
          text:
            selectableEvidence.length === 0
              ? '提示できる根拠がない——まだ調査が足りないようだ。'
              : '根拠となる証拠品を捜査メモで選んで提示せよ。',
          speakerName: '── 断罪',
          borderClass: 'border-gothic-border',
        }
      case 'evidence_rebuttal':
        return {
          text: getActiveRebuttalText(),
          speakerName: `${votedSuspect.name} ─ 反論`,
          borderClass: 'border-red-800',
        }
      case 'select_reasoning':
        return {
          text: `${selectedEvidence?.name ?? '証拠品'}をもとに、捜査メモで探偵の推理を選べ。`,
          speakerName: '── 推理',
          borderClass: 'border-gothic-border',
        }
      case 'wrong_link':
        return {
          text: getWrongLinkText(),
          speakerName: `${votedSuspect.name} ─ 反論`,
          borderClass: 'border-red-800',
        }
      case 'refutation':
        return {
          text: selectedCombination?.refutation_text ?? accusationData!.correct.refutation_text,
          speakerName: selectedCombination ? `── 推理 ─ ${selectedCombination.name}` : '── 推理',
          borderClass: 'border-gothic-gold',
        }
      case 'breakdown':
        return {
          text: accusationData!.correct.breakdown_statement,
          speakerName: `${votedSuspect.name} ─ 独白`,
          borderClass: 'border-gothic-gold',
        }
    }
  }

  const dialog = getStepDialog()

  // 捜査メモを開く（stepに応じてモードを自動選択）
  const handleOpenNotes = () => setShowNotes(true)

  // slot4: 「証拠を突きつける」は常時表示（refutation/breakdown除く）
  // 「推理を語る」は証拠提示済みかつ推理選択可能な状態のとき表示
  const getRightSlot4 = () => {
    if (step === 'refutation' || step === 'breakdown') return undefined

    const showReasoning =
      selectedEvidenceId !== null &&
      ((step === 'evidence_rebuttal' && dialogDone) ||
        step === 'select_reasoning' ||
        step === 'wrong_link')

    return (
      <div className="flex flex-col gap-2">
        <PanelButton variant="primary" onClick={handleConfrontAction}>
          証拠を突きつける
        </PanelButton>
        {showReasoning && (
          <PanelButton variant="primary" onClick={handleReasoningAction}>
            推理を語る
          </PanelButton>
        )}
      </div>
    )
  }

  // slot5: フェーズ遷移ボタン（最下部固定）
  const getRightSlot5 = () => {
    if (step === 'select_evidence' || step === 'select_reasoning' || step === 'wrong_link') {
      return (
        <PanelButton variant="secondary" onClick={triggerNearDefeat}>
          これ以上の証拠はない
        </PanelButton>
      )
    }
    if (step === 'breakdown' && dialogDone) {
      return (
        <PanelButton variant="glow" onClick={() => setPhase('ending')}>
          真相を見る
        </PanelButton>
      )
    }
    return undefined
  }

  return (
    <>
      {/* 組み合わせ発見ダイアログ（z-60でメモの上に重なる） */}
      <CombinationDiscovery />

      {/* 推理メモ: 証拠・推理選択時は対応するモードで開く */}
      {showNotes && (
        <InvestigationNotes
          onClose={() => setShowNotes(false)}
          evidenceSelectMode={
            step === 'select_evidence'
              ? {
                  suspectName: votedSuspect.name,
                  actionLabel: '証拠を提示する',
                  filterEvidenceIds: selectableEvidence.map((e) => e.id),
                  onConfirm: (evidenceId) => {
                    setShowNotes(false)
                    handleSelectEvidence(evidenceId)
                  },
                  onCancel: () => setShowNotes(false),
                }
              : undefined
          }
          reasoningSelectMode={
            step === 'select_reasoning'
              ? {
                  onSelect: (combinationId) => {
                    const combo = (scenario.evidence_combinations ?? []).find(
                      (c) => c.id === combinationId
                    )
                    if (combo) {
                      setShowNotes(false)
                      handleSelectCombination(combo)
                    }
                  },
                  onCancel: () => setShowNotes(false),
                }
              : undefined
          }
        />
      )}

      <div className="relative h-full overflow-hidden">
        {/* 館背景 */}
        <MansionSceneBackground
          phase="accusation"
          mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
        />

        {/* キャラクターカード */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-[60%] flex justify-center">
          <CharacterCard suspect={votedSuspect} portrait selected />
        </div>

        {/* CenterActionArea: 選択した証拠の確認表示 */}
        <CenterActionArea>
          {step === 'evidence_rebuttal' && selectedEvidence && (
            <div className="bg-gothic-panel/60 border border-gothic-border px-4 py-1.5 text-center">
              <p className="text-gothic-gold font-display text-[10px] tracking-widest">
                {selectedEvidence.name}
              </p>
            </div>
          )}
          {step === 'select_reasoning' && selectedEvidence && (
            <div className="bg-gothic-panel/60 border border-gothic-gold/40 px-4 py-1.5 text-center">
              <p className="text-gothic-muted font-serif text-[9px]">提示した証拠</p>
              <p className="text-gothic-gold font-display text-[10px] tracking-widest">
                {selectedEvidence.name}
              </p>
            </div>
          )}
        </CenterActionArea>

        {/* ダイアログボックス */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div
            className={cn(
              'relative bg-gothic-panel/85 backdrop-blur-sm border-2',
              dialog.borderClass
            )}
          >
            <DialogBox
              key={step}
              text={dialog.text}
              speakerName={dialog.speakerName}
              onComplete={() => setDialogDoneStep(step)}
            />
            {step === 'refutation' && dialogDone && (
              <button
                onClick={() => setStep('breakdown')}
                className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
              >
                続きを聞く →
              </button>
            )}
          </div>
        </div>

        {/* 右パネル: slot3=捜査メモ固定、slot4=状況依存アクション、slot5=フェーズ遷移 */}
        <RightPanel
          slot2={
            <div className="flex items-center gap-2">
              <span className="text-gothic-muted font-serif text-[clamp(9px,1.3vh,12px)]">
                突きつけ
              </span>
              <span className="text-gothic-gold font-pixel text-[clamp(11px,1.5vh,14px)]">
                {accusationConfrontActionsRemaining}/{ACCUSATION_CONFRONT_ACTIONS}
              </span>
            </div>
          }
          slot3={
            <PanelButton variant="secondary" onClick={handleOpenNotes}>
              <span className="flex items-center justify-center gap-1.5">
                <NotesIcon size={13} />
                <span>捜査メモ</span>
              </span>
            </PanelButton>
          }
          slot4={getRightSlot4()}
          slot5={getRightSlot5()}
        />
      </div>
    </>
  )
}
