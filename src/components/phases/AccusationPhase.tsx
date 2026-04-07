// 投票後・結末前に挿入される告発シーン。正解時は犯人との最終対決、不正解時は無実の困惑を演出する
// 館背景＋被告発者キャラクター＋ダイアログの16:9レイアウトで進行する
// 証拠選択は左パネルを廃止し捜査メモの証拠品タブで行う
// 特殊ボタン（この証拠で反論する・真相を見る）はCenterActionAreaに配置する
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { cn } from '../../utils/cn'
import { RightPanel } from '../layout/RightPanel'
import { CenterActionArea } from '../layout/CenterActionArea'
import { PanelButton } from '../layout/PanelButton'
import { NotesIcon } from '../shared/Icons'
import { resolveMansionAsset } from '../../services/assetResolver'
import { ACCUSATION_CONFRONT_ACTIONS } from '../../constants/gameConfig'

// 告発シーンの進行ステップ
type AccusationStep =
  | 'defense'
  | 'select_evidence'
  | 'wrong_evidence'
  | 'refutation'
  | 'breakdown'
  | 'escape'
  | 'confusion'
  | 'alibi_reveal'

interface StepDialog {
  text: string
  speakerName: string
  borderClass: string
}

// 告発シーンのメインコンポーネント。内部ステートマシンで段階的に進行する
export function AccusationPhase() {
  const {
    scenario,
    votedSuspectId,
    examinedEvidenceIds,
    setPhase,
    setMurdererEscaped,
    accusationConfrontActionsRemaining,
    consumeAccusationConfrontAction,
  } = useGameStore()

  const isCorrect = votedSuspectId === scenario?.murderer_id
  const [step, setStep] = useState<AccusationStep>(() => (isCorrect ? 'defense' : 'confusion'))
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [showNotes, setShowNotes] = useState(false)
  // refutation/confusion ステップで「続きを聞く」ボタンを表示するためのフラグ
  // ステップと紐付けることで、ステップ変更時に自動リセット（useEffect不要）
  const [dialogDoneStep, setDialogDoneStep] = useState<AccusationStep | null>(null)
  const dialogDone = dialogDoneStep === step

  const accusationData = scenario?.accusation_data ?? null
  const incorrectData =
    !isCorrect && accusationData && votedSuspectId
      ? (accusationData.incorrect[votedSuspectId] ?? null)
      : null

  const selectableEvidence = scenario
    ? scenario.evidence.filter((e) => examinedEvidenceIds.includes(e.id) && !e.is_fake)
    : []

  const hasDecisiveEvidence = accusationData
    ? selectableEvidence.some((e) => e.id === accusationData.correct.decisive_evidence_id)
    : false

  const shouldSkip =
    !scenario || !votedSuspectId || !accusationData || (!isCorrect && !incorrectData)
  useEffect(() => {
    if (shouldSkip) setPhase('ending')
  }, [shouldSkip, setPhase])

  if (shouldSkip) return null

  const votedSuspect = scenario.suspects.find((s) => s.id === votedSuspectId)!
  const decisiveEvidence = accusationData
    ? scenario.evidence.find((e) => e.id === accusationData.correct.decisive_evidence_id)
    : null

  const getStepDialog = (): StepDialog => {
    switch (step) {
      case 'defense':
        return {
          text: accusationData.correct.defense_statement,
          speakerName: votedSuspect.name,
          borderClass: 'border-gothic-gold',
        }
      case 'select_evidence':
        return {
          text:
            selectableEvidence.length === 0
              ? '提示できる証拠がない——調査が足りなかったようだ。'
              : `${votedSuspect.name}の弁明を覆す、決定的な証拠を一つ提示せよ。`,
          speakerName: '── 告発',
          borderClass: 'border-gothic-border',
        }
      case 'wrong_evidence':
        return {
          text: accusationData.correct.wrong_evidence_reaction,
          speakerName: `${votedSuspect.name} ─ 反論`,
          borderClass: 'border-red-800',
        }
      case 'refutation':
        return {
          text: accusationData.correct.refutation_text,
          speakerName: decisiveEvidence ? `── 反駁 ─ ${decisiveEvidence.name}` : '── 反駁',
          borderClass: 'border-gothic-gold',
        }
      case 'breakdown':
        return {
          text: accusationData.correct.breakdown_statement,
          speakerName: `${votedSuspect.name} ─ 独白`,
          borderClass: 'border-gothic-gold',
        }
      case 'escape': {
        const escapeText =
          accusationData.correct.escape_statement ??
          '……証拠もなしに犯人呼ばわりとは。疑惑だけでは人を裁けない。——私はここを去らせてもらう。'
        return {
          text: escapeText,
          speakerName: `${votedSuspect.name} ─ 逃亡`,
          borderClass: 'border-red-900',
        }
      }
      case 'confusion':
        return {
          text: incorrectData!.confusion_statement,
          speakerName: `${votedSuspect.name} ─ 困惑`,
          borderClass: 'border-gothic-border',
        }
      case 'alibi_reveal':
        return {
          text: incorrectData!.alibi_reveal,
          speakerName: '── アリバイ',
          borderClass: 'border-red-900',
        }
    }
  }

  const dialog = getStepDialog()

  // 証拠選択モードでメモを開く
  const handleOpenEvidenceSelect = () => {
    setSelectedEvidenceId(null)
    setShowNotes(true)
  }

  // 証拠選択後の反論アクション実行
  const handleRefute = (evidenceId: string) => {
    consumeAccusationConfrontAction()
    setSelectedEvidenceId(evidenceId)
    setShowNotes(false)
    if (evidenceId === accusationData!.correct.decisive_evidence_id) {
      setStep('refutation')
    } else {
      setStep('wrong_evidence')
    }
  }

  const selectedEvidenceItem = selectedEvidenceId
    ? scenario.evidence.find((e) => e.id === selectedEvidenceId)
    : null

  // 右パネルのslot3ボタン
  const getRightSlot3 = () => {
    switch (step) {
      case 'defense':
        return (
          <PanelButton
            variant="primary"
            onClick={() => {
              setStep('select_evidence')
              setShowNotes(true)
            }}
          >
            証拠を突きつける
          </PanelButton>
        )
      case 'select_evidence':
        return (
          <PanelButton variant="secondary" onClick={handleOpenEvidenceSelect}>
            証拠を選び直す
          </PanelButton>
        )
      case 'wrong_evidence':
        return (
          <PanelButton
            variant="secondary"
            onClick={() => {
              setSelectedEvidenceId(null)
              setStep('select_evidence')
              setShowNotes(true)
            }}
          >
            別の証拠を選ぶ
          </PanelButton>
        )
      case 'escape':
        return (
          <PanelButton
            variant="primary"
            onClick={() => {
              setMurdererEscaped(true)
              setPhase('ending')
            }}
          >
            結果を見る
          </PanelButton>
        )
      case 'alibi_reveal':
        return (
          <PanelButton variant="primary" onClick={() => setPhase('ending')}>
            結果を見る
          </PanelButton>
        )
      default:
        return undefined
    }
  }

  const getRightSlot4 = () => {
    if (step === 'wrong_evidence' && !hasDecisiveEvidence) {
      return (
        <PanelButton variant="dimmed" onClick={() => setStep('escape')}>
          これ以上の証拠はない
        </PanelButton>
      )
    }
    if (step === 'select_evidence' && selectableEvidence.length === 0) {
      return (
        <PanelButton variant="dimmed" onClick={() => setStep('escape')}>
          証拠を提示できない
        </PanelButton>
      )
    }
    return undefined
  }

  return (
    <div className="relative h-full overflow-hidden">
      {showNotes && (
        <InvestigationNotes
          onClose={() => setShowNotes(false)}
          evidenceSelectMode={
            step === 'select_evidence'
              ? {
                  suspectName: votedSuspect.name,
                  actionLabel: 'この証拠で反論する',
                  onConfirm: handleRefute,
                  onCancel: () => setShowNotes(false),
                }
              : undefined
          }
        />
      )}

      {/* シナリオの館背景IDを使用して背景画像を表示する */}
      <MansionSceneBackground
        phase="accusation"
        mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
      />

      <div className="absolute inset-x-0 top-1/2 -translate-y-[60%] flex justify-center">
        <CharacterCard suspect={votedSuspect} portrait selected />
      </div>

      {/* CenterActionArea: 選択済み証拠での反論ボタン・真相を見るボタン */}
      <CenterActionArea>
        {/* select_evidence: 証拠選択後に反論ボタンを表示 */}
        {step === 'select_evidence' && selectedEvidenceItem && (
          <button
            onClick={() => handleRefute(selectedEvidenceId!)}
            className="bg-gothic-gold/10 border border-gothic-gold text-gothic-gold font-display tracking-widest text-xs px-6 py-2 hover:bg-gothic-gold/20 transition-all hover:shadow-[0_0_12px_rgba(217,119,6,0.4)]"
          >
            {selectedEvidenceItem.name} で反論する
          </button>
        )}

        {/* breakdown: 真相を見るボタン */}
        {step === 'breakdown' && (
          <button
            onClick={() => setPhase('ending')}
            className="bg-gothic-gold/20 border border-gothic-gold text-gothic-gold font-display tracking-widest text-xs px-8 py-2.5 hover:bg-gothic-gold/30 transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]"
          >
            真相を見る
          </button>
        )}
      </CenterActionArea>

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
          {/* refutation/confusion ステップ: 「続きを聞く」でダイアログ内から次へ進む */}
          {step === 'refutation' && dialogDone && (
            <button
              onClick={() => setStep('breakdown')}
              className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
            >
              続きを聞く →
            </button>
          )}
          {step === 'confusion' && dialogDone && (
            <button
              onClick={() => setStep('alibi_reveal')}
              className="absolute bottom-2 right-3 text-gothic-muted text-xs font-serif hover:text-gothic-gold transition-colors"
            >
              続きを聞く →
            </button>
          )}
        </div>
      </div>

      {/* 右パネル */}
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
        slot3={getRightSlot3()}
        slot4={
          getRightSlot4() ?? (
            <PanelButton variant="secondary" onClick={() => setShowNotes(true)}>
              <span className="flex items-center justify-center gap-1.5">
                <NotesIcon size={13} />
                <span>捜査メモ</span>
              </span>
            </PanelButton>
          )
        }
      />
    </div>
  )
}
