// 投票後・結末前に挿入される告発シーン。正解時は犯人との最終対決、不正解時は無実の困惑を演出する
import { useState, useEffect, type ReactNode } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'

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

// 告発シーン各ステップ共通のレイアウトシェル
function AccusationLayout({
  label,
  labelColor = 'text-gothic-muted',
  title,
  titleColor = 'text-gothic-gold',
  titleSize = 'text-2xl',
  subtitle,
  children,
}: {
  label: string
  labelColor?: string
  title: string
  titleColor?: string
  titleSize?: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className={`${labelColor} font-serif text-xs tracking-widest mb-2`}>{label}</p>
          <h1 className={`font-display ${titleSize} ${titleColor} tracking-widest`}>{title}</h1>
          {subtitle && <p className="text-gothic-muted font-serif text-sm mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

// 告発シーンのメインコンポーネント。内部ステートマシンで段階的に進行する
export function AccusationPhase() {
  const { scenario, votedSuspectId, examinedEvidenceIds, setPhase, setMurdererEscaped } =
    useGameStore()

  const isCorrect = votedSuspectId === scenario?.murderer_id
  const [step, setStep] = useState<AccusationStep>(() => (isCorrect ? 'defense' : 'confusion'))
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)

  const accusationData = scenario?.accusation_data ?? null
  // 不正解時に必要な個別データを事前に取得（レンダリング中の条件分岐でsetPhaseを呼ばないため）
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

  // 正解ルート: 弁明表示
  if (step === 'defense') {
    return (
      <AccusationLayout label="告発" title={`${votedSuspect.name}への告発`}>
        <GothicPanel className="mb-6 animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-gothic-gold font-display text-sm shrink-0">
              {votedSuspect.name}
            </span>
          </div>
          <p className="text-gothic-text font-serif leading-relaxed whitespace-pre-line">
            {accusationData.correct.defense_statement}
          </p>
        </GothicPanel>

        <div className="flex justify-center">
          <button
            onClick={() => setStep('select_evidence')}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            証拠を突きつける
          </button>
        </div>
      </AccusationLayout>
    )
  }

  // 正解ルート: 証拠選択
  if (step === 'select_evidence') {
    return (
      <AccusationLayout
        label="告発"
        titleSize="text-xl"
        title="決定的な証拠を選べ"
        subtitle={`${votedSuspect.name}の弁明を覆す証拠を1つ選んでください`}
      >
        {selectableEvidence.length === 0 ? (
          <>
            <GothicPanel className="mb-6">
              <p className="text-gothic-muted font-serif text-sm text-center">
                提示できる証拠がない——調査が足りなかったようだ。
              </p>
            </GothicPanel>
            <div className="flex justify-center">
              <button
                onClick={() => setStep('escape')}
                className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
              >
                証拠を提示できない
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 mb-6">
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
        )}
      </AccusationLayout>
    )
  }

  // 正解ルート: 誤った証拠を選んだ場合
  if (step === 'wrong_evidence') {
    return (
      <AccusationLayout
        label="不十分"
        labelColor="text-red-400/70"
        title="その証拠では不十分だ"
        titleColor="text-red-400"
        titleSize="text-xl"
      >
        <GothicPanel className="mb-6 border-red-900/40 animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-gothic-gold font-display text-sm shrink-0">
              {votedSuspect.name}
            </span>
          </div>
          <p className="text-gothic-text font-serif leading-relaxed">
            {accusationData.correct.wrong_evidence_reaction}
          </p>
        </GothicPanel>

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
      </AccusationLayout>
    )
  }

  // 正解ルート: 論破ナレーション
  if (step === 'refutation') {
    const decisiveEvidence = scenario.evidence.find(
      (e) => e.id === accusationData.correct.decisive_evidence_id
    )

    return (
      <AccusationLayout label="反駁" labelColor="text-gothic-gold/70" title="論破">
        {decisiveEvidence && (
          <div className="text-center mb-4">
            <span className="inline-block border border-gothic-gold bg-stone-900/60 text-gothic-gold font-serif text-sm px-4 py-1">
              {decisiveEvidence.name}
            </span>
          </div>
        )}

        <GothicPanel className="mb-6 border-gothic-gold animate-fade-in">
          <p className="text-gothic-text font-serif leading-relaxed">
            {accusationData.correct.refutation_text}
          </p>
        </GothicPanel>

        <div className="flex justify-center">
          <button
            onClick={() => setStep('breakdown')}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            続きを見る
          </button>
        </div>
      </AccusationLayout>
    )
  }

  // 正解ルート: 犯人の崩壊・告白
  if (step === 'breakdown') {
    return (
      <AccusationLayout label="告白" labelColor="text-gothic-gold/70" title="真相の告白">
        <GothicPanel className="mb-6 border-gothic-gold animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-red-400 font-display text-sm shrink-0">{votedSuspect.name}</span>
          </div>
          <p className="text-gothic-text font-serif leading-relaxed whitespace-pre-line">
            {accusationData.correct.breakdown_statement}
          </p>
        </GothicPanel>

        <div className="flex justify-center">
          <button
            onClick={() => setPhase('ending')}
            className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 px-8 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
          >
            真相を見る
          </button>
        </div>
      </AccusationLayout>
    )
  }

  // 正解ルート: 証拠不足で犯人が逃げ切る
  if (step === 'escape') {
    const escapeText =
      accusationData.correct.escape_statement ??
      '……証拠もなしに犯人呼ばわりとは。疑惑だけでは人を裁けない。——私はここを去らせてもらう。'

    return (
      <AccusationLayout
        label="逃亡"
        labelColor="text-red-400/70"
        title="犯人を逃した"
        titleColor="text-red-400"
      >
        <GothicPanel className="mb-6 border-red-900/40 animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-gothic-gold font-display text-sm shrink-0">
              {votedSuspect.name}
            </span>
          </div>
          <p className="text-gothic-text font-serif leading-relaxed whitespace-pre-line">
            {escapeText}
          </p>
        </GothicPanel>

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
      </AccusationLayout>
    )
  }

  // 不正解ルート: 無実の人物の困惑
  if (step === 'confusion') {
    return (
      <AccusationLayout label="告発" title={`${votedSuspect.name}への告発`}>
        <GothicPanel className="mb-6 animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-gothic-gold font-display text-sm shrink-0">
              {votedSuspect.name}
            </span>
          </div>
          <p className="text-gothic-text font-serif leading-relaxed">
            {incorrectData.confusion_statement}
          </p>
        </GothicPanel>

        <div className="flex justify-center">
          <button
            onClick={() => setStep('alibi_reveal')}
            className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
          >
            続きを見る
          </button>
        </div>
      </AccusationLayout>
    )
  }

  // 不正解ルート: アリバイ提示
  if (step === 'alibi_reveal') {
    return (
      <AccusationLayout
        label="誤謬"
        labelColor="text-red-400/70"
        title="告発は誤りだった"
        titleColor="text-red-400"
        titleSize="text-xl"
      >
        <GothicPanel className="mb-6 border-red-900/40 animate-fade-in">
          <p className="text-gothic-text font-serif leading-relaxed">
            {incorrectData.alibi_reveal}
          </p>
        </GothicPanel>

        <div className="flex justify-center">
          <button
            onClick={() => setPhase('ending')}
            className="border border-gothic-border bg-gothic-panel hover:bg-stone-800 text-gothic-muted font-display tracking-widest py-3 px-8 transition-all"
          >
            結果を見る
          </button>
        </div>
      </AccusationLayout>
    )
  }

  return null
}
