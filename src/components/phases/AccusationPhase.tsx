// 投票後・結末前に挿入される告発シーン。正解時は犯人との最終対決、不正解時は無実の困惑を演出する
// 館背景＋被告発者キャラクター＋ダイアログの16:9レイアウトで進行する
// 証拠選択ステップでは左特別パネルに証拠リストを表示する
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import { cn } from '../../utils/cn'
import { RightPanel } from '../layout/RightPanel'
import { LeftSpecialPanel } from '../layout/LeftSpecialPanel'
import { PanelButton } from '../layout/PanelButton'

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
  const { scenario, votedSuspectId, examinedEvidenceIds, setPhase, setMurdererEscaped } =
    useGameStore()

  const isCorrect = votedSuspectId === scenario?.murderer_id
  const [step, setStep] = useState<AccusationStep>(() => (isCorrect ? 'defense' : 'confusion'))
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)

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

  const hasLeftPanel = step === 'select_evidence' && selectableEvidence.length > 0

  const getSlot3 = () => {
    switch (step) {
      case 'defense':
        return (
          <PanelButton variant="primary" onClick={() => setStep('select_evidence')}>
            証拠を突きつける
          </PanelButton>
        )
      case 'select_evidence':
        return selectableEvidence.length === 0 ? (
          <PanelButton onClick={() => setStep('escape')}>証拠を提示できない</PanelButton>
        ) : (
          <PanelButton
            variant="primary"
            disabled={!selectedEvidenceId}
            onClick={() => {
              if (selectedEvidenceId === accusationData.correct.decisive_evidence_id) {
                setStep('refutation')
              } else {
                setStep('wrong_evidence')
              }
            }}
          >
            この証拠で反論する
          </PanelButton>
        )
      case 'wrong_evidence':
        return (
          <PanelButton
            variant="primary"
            onClick={() => {
              setSelectedEvidenceId(null)
              setStep('select_evidence')
            }}
          >
            別の証拠を選ぶ
          </PanelButton>
        )
      case 'refutation':
        return (
          <PanelButton variant="primary" onClick={() => setStep('breakdown')}>
            続きを見る
          </PanelButton>
        )
      case 'breakdown':
        return (
          <PanelButton variant="glow" onClick={() => setPhase('ending')}>
            真相を見る
          </PanelButton>
        )
      case 'escape':
        return (
          <PanelButton
            onClick={() => {
              setMurdererEscaped(true)
              setPhase('ending')
            }}
          >
            結果を見る
          </PanelButton>
        )
      case 'confusion':
        return <PanelButton onClick={() => setStep('alibi_reveal')}>続きを見る</PanelButton>
      case 'alibi_reveal':
        return <PanelButton onClick={() => setPhase('ending')}>結果を見る</PanelButton>
    }
  }

  const getSlot4 = () => {
    if (step === 'wrong_evidence' && !hasDecisiveEvidence) {
      return <PanelButton onClick={() => setStep('escape')}>これ以上の証拠はない</PanelButton>
    }
    return undefined
  }

  return (
    <div className="relative h-full overflow-hidden">
      <MansionSceneBackground phase="accusation" />

      <div className="absolute inset-x-0 bottom-24 flex justify-center">
        <CharacterCard suspect={votedSuspect} portrait selected />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className={cn('bg-gothic-panel/85 backdrop-blur-sm border-2', dialog.borderClass)}>
          <DialogBox key={step} text={dialog.text} speakerName={dialog.speakerName} />
        </div>
      </div>

      {hasLeftPanel && (
        <LeftSpecialPanel>
          <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border/60 px-3 py-2 text-center">
            <p className="font-display text-gothic-gold text-xs tracking-widest">証拠を選ぶ</p>
          </div>
          <div className="bg-gothic-panel/80 backdrop-blur-sm border border-gothic-border/60 overflow-y-auto max-h-64">
            <div className="px-2 py-2 space-y-1.5">
              {selectableEvidence.map((evidence) => (
                <button
                  key={evidence.id}
                  onClick={() => setSelectedEvidenceId(evidence.id)}
                  className={`w-full text-left border p-2 transition-all ${
                    selectedEvidenceId === evidence.id
                      ? 'border-gothic-gold bg-stone-800/60 shadow-[0_0_8px_rgba(217,119,6,0.2)]'
                      : 'border-gothic-border/60 bg-gothic-panel/60 hover:border-gothic-accent'
                  }`}
                >
                  <p className="text-gothic-text font-serif text-[11px]">{evidence.name}</p>
                  <p className="text-gothic-muted font-serif text-[10px] mt-0.5 line-clamp-2">
                    {evidence.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </LeftSpecialPanel>
      )}

      <RightPanel slot1="告発" slot3={getSlot3()} slot4={getSlot4()} />
    </div>
  )
}
