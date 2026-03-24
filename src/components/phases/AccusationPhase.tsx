// 投票後・結末前に挿入される告発シーン。正解時は犯人との最終対決、不正解時は無実の困惑を演出する
// 館背景＋被告発者キャラクター＋ダイアログの16:9レイアウトで進行する
import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import { cn } from '../../utils/cn'

// 告発シーンの進行ステップ
type AccusationStep =
  | 'defense' // 正解: 犯人の最終弁明
  | 'select_evidence' // 正解: プレイヤーが決定的証拠を選択
  | 'wrong_evidence' // 正解: 誤った証拠を選んだ時の犯人リアクション
  | 'refutation' // 正解: 正しい証拠による論破
  | 'breakdown' // 正解: 犯人の崩壊・告白
  | 'escape' // 正解: 証拠不足で犯人が逃げ切る
  | 'confusion' // 不正解: 無実の人物の困惑
  | 'alibi_reveal' // 不正解: アリバイ提示

// ステップごとのダイアログ設定
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
  // 不正解時に必要な個別データを事前に取得
  const incorrectData =
    !isCorrect && accusationData && votedSuspectId
      ? (accusationData.incorrect[votedSuspectId] ?? null)
      : null

  // 調査済みの本物の証拠のみを選択肢として表示する
  const selectableEvidence = scenario
    ? scenario.evidence.filter((e) => examinedEvidenceIds.includes(e.id) && !e.is_fake)
    : []

  // 決定的証拠が選択肢に含まれているか（証拠ループ脱出ボタンの表示制御用）
  const hasDecisiveEvidence = accusationData
    ? selectableEvidence.some((e) => e.id === accusationData.correct.decisive_evidence_id)
    : false

  // 告発データが存在しない場合はスキップして直接 ending へ
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

  // ステップに応じたダイアログ内容を導出する
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
          speakerName: `${votedSuspect.name} ─ 告白`,
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

  return (
    <div className="min-h-screen px-4 py-4">
      <div className="max-w-6xl mx-auto">
        {/* フェーズヘッダー */}
        <div className="mb-4">
          <h1 className="font-display text-xl text-red-400 tracking-widest">告発フェーズ</h1>
        </div>

        {/* メインビジュアル（16:9） */}
        <div
          className="relative w-full border border-gothic-border overflow-hidden"
          style={{ aspectRatio: '16 / 9' }}
        >
          <MansionSceneBackground phase="accusation" />

          {/* 被告発者キャラクター */}
          <div className="absolute inset-x-0 bottom-24 flex justify-center">
            <CharacterCard suspect={votedSuspect} portrait selected />
          </div>

          {/* ダイアログ */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className={cn('bg-gothic-panel/85 backdrop-blur-sm border-2', dialog.borderClass)}>
              <DialogBox key={step} text={dialog.text} speakerName={dialog.speakerName} />
            </div>
          </div>
        </div>

        {/* アクションパネル */}
        <div className="mt-4">
          {/* 正解: 弁明 → 証拠突きつけボタン */}
          {step === 'defense' && (
            <div className="flex justify-center">
              <button
                onClick={() => setStep('select_evidence')}
                className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
              >
                証拠を突きつける
              </button>
            </div>
          )}

          {/* 正解: 証拠選択 */}
          {step === 'select_evidence' &&
            (selectableEvidence.length === 0 ? (
              <div className="flex justify-center">
                <button
                  onClick={() => setStep('escape')}
                  className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
                >
                  証拠を提示できない
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {selectableEvidence.map((evidence) => (
                    <button
                      key={evidence.id}
                      onClick={() => setSelectedEvidenceId(evidence.id)}
                      className={`w-full text-left border p-4 transition-all ${
                        selectedEvidenceId === evidence.id
                          ? 'border-gothic-gold bg-stone-800/60 shadow-[0_0_10px_rgba(217,119,6,0.2)]'
                          : 'border-gothic-border bg-gothic-panel hover:border-gothic-accent'
                      }`}
                    >
                      <p className="text-gothic-text font-serif text-sm">{evidence.name}</p>
                      <p className="text-gothic-muted font-serif text-xs mt-1">
                        {evidence.description}
                      </p>
                    </button>
                  ))}
                </div>
                {selectedEvidenceId && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        if (selectedEvidenceId === accusationData.correct.decisive_evidence_id) {
                          setStep('refutation')
                        } else {
                          setStep('wrong_evidence')
                        }
                      }}
                      className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                    >
                      この証拠で反論する
                    </button>
                  </div>
                )}
              </>
            ))}

          {/* 正解: 誤った証拠 */}
          {step === 'wrong_evidence' && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  setSelectedEvidenceId(null)
                  setStep('select_evidence')
                }}
                className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all"
              >
                別の証拠を選ぶ
              </button>
              {!hasDecisiveEvidence && (
                <button
                  onClick={() => setStep('escape')}
                  className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all text-sm"
                >
                  これ以上の証拠はない
                </button>
              )}
            </div>
          )}

          {/* 正解: 論破 */}
          {step === 'refutation' && (
            <div className="flex justify-center">
              <button
                onClick={() => setStep('breakdown')}
                className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
              >
                続きを見る
              </button>
            </div>
          )}

          {/* 正解: 告白 */}
          {step === 'breakdown' && (
            <div className="flex justify-center">
              <button
                onClick={() => setPhase('ending')}
                className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
              >
                真相を見る
              </button>
            </div>
          )}

          {/* 正解: 証拠不足逃亡 */}
          {step === 'escape' && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setMurdererEscaped(true)
                  setPhase('ending')
                }}
                className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
              >
                結果を見る
              </button>
            </div>
          )}

          {/* 不正解: 困惑 */}
          {step === 'confusion' && (
            <div className="flex justify-center">
              <button
                onClick={() => setStep('alibi_reveal')}
                className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
              >
                続きを見る
              </button>
            </div>
          )}

          {/* 不正解: アリバイ提示 */}
          {step === 'alibi_reveal' && (
            <div className="flex justify-center">
              <button
                onClick={() => setPhase('ending')}
                className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
              >
                結果を見る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
