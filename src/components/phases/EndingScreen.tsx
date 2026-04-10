// ゲーム終了画面。投票結果の正否と真相（犯人・動機・真実）を表示する。固定シナリオのみスコアを保存する
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { isTrialMode } from '../../constants/salesConfig'
import { GothicPanel } from '../layout/GothicPanel'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import {
  ACTIONS,
  TALK_ACTIONS,
  DISCUSSION_CONFRONT_ACTIONS,
  ACCUSATION_CONFRONT_ACTIONS,
} from '../../constants/gameConfig'
import { getEvidenceNames } from '../../utils/scenario'
import { saveScore } from '../../utils/score'
import { resolveMansionAsset } from '../../services/assetResolver'

export function EndingScreen() {
  const {
    scenario,
    votedSuspectId,
    murdererEscaped,
    discoveredCombinationIds,
    examinedEvidenceIds,
    actionsRemaining,
    talkActionsRemaining,
    discussionConfrontActionsRemaining,
    accusationConfrontActionsRemaining,
    useFixedScenario,
    setPhase,
    resetGame,
  } = useGameStore()

  const [showTruth, setShowTruth] = useState(false)
  // 正解時の独白→エピローグ→結果 のステップ管理
  const [confessionStep, setConfessionStep] = useState<'confession' | 'epilogue' | 'done'>(
    'confession'
  )
  // 惜敗エンド演出のステップインデックス（0 から順に進む）
  const [nearDefeatStepIndex, setNearDefeatStepIndex] = useState(0)
  // スコア保存済みフラグ（StrictModeの二重発火防止）
  const scoreSaved = useRef(false)

  const trial = isTrialMode()
  const usedActions = ACTIONS - actionsRemaining
  const usedTalkActions = TALK_ACTIONS - talkActionsRemaining
  const usedDiscussionConfront = DISCUSSION_CONFRONT_ACTIONS - discussionConfrontActionsRemaining
  const usedAccusationConfront = ACCUSATION_CONFRONT_ACTIONS - accusationConfrontActionsRemaining

  // 固定シナリオかつエンディング到達時にスコアを保存する（1回のみ・early return の前に配置）
  useEffect(() => {
    if (!useFixedScenario || !scenario || !votedSuspectId || scoreSaved.current) return
    scoreSaved.current = true
    const cleared = votedSuspectId === scenario.murderer_id && !murdererEscaped
    saveScore(scenario.title, { cleared, usedActions, usedTalkActions })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 意図的にマウント時1回のみ実行

  if (!scenario || !votedSuspectId) return null

  const isCorrect = votedSuspectId === scenario.murderer_id
  const murderer = scenario.suspects.find((s) => s.id === scenario.murderer_id)!
  const voted = scenario.suspects.find((s) => s.id === votedSuspectId)!

  // 惜敗エンド演出データを構築（キャラの言葉 → 地の文の順）
  const nearDefeatSteps: Array<{ text: string; speakerName: string; showCharacter: boolean }> = []
  if (murdererEscaped) {
    // キャラの言葉（証拠不足型: 犯人の逃亡セリフ / 誤告発型: 無実の容疑者の弁明）
    const charDialogText = isCorrect
      ? (scenario.accusation_data?.correct.escape_statement ?? '')
      : (scenario.accusation_data?.incorrect?.[votedSuspectId]?.defense_statement ?? '')
    if (charDialogText) {
      nearDefeatSteps.push({
        text: charDialogText,
        speakerName: isCorrect ? murderer.name : voted.name,
        showCharacter: true,
      })
    }
    // 地の文（ナレーション）
    const narrationText = isCorrect
      ? (scenario.accusation_data?.correct.near_defeat_evidence_text ?? '')
      : (scenario.accusation_data?.near_defeat_wrong_suspect_text ?? '')
    if (narrationText) {
      nearDefeatSteps.push({ text: narrationText, speakerName: '── 幕', showCharacter: false })
    }
  }
  const currentNearDefeatStep = nearDefeatSteps[nearDefeatStepIndex]

  const confessionText =
    isCorrect && !murdererEscaped
      ? (murderer.confession_statement ?? scenario.accusation_data?.correct.breakdown_statement)
      : undefined
  const epilogueText =
    isCorrect && !murdererEscaped ? scenario.accusation_data?.correct.epilogue_text : undefined

  // 独白・エピローグステップ（正解時の館シーン）
  if (confessionText && confessionStep !== 'done') {
    const isEpilogue = confessionStep === 'epilogue'
    const displayText = isEpilogue ? (epilogueText ?? confessionText) : confessionText
    return (
      <div className="h-full relative">
        {/* シナリオの館背景IDを使用して背景画像を表示する */}
        <MansionSceneBackground
          phase="ending"
          fixed
          mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-6 px-4">
          <div className="w-full max-w-2xl">
            {!isEpilogue && <CharacterCard suspect={murderer} portrait />}
            <div className={!isEpilogue ? 'mt-4' : undefined}>
              <DialogBox text={displayText} speakerName={isEpilogue ? '── 幕' : murderer.name} />
            </div>
            <button
              onClick={() => setConfessionStep(!isEpilogue && epilogueText ? 'epilogue' : 'done')}
              className="mt-4 w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 transition-all"
            >
              {isEpilogue ? '真相を見る' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 惜敗エンド演出（キャラの言葉 → 地の文）
  if (murdererEscaped && currentNearDefeatStep) {
    const nearDefeatCharacter = isCorrect ? murderer : voted
    return (
      <div className="h-full relative">
        <MansionSceneBackground
          phase="ending"
          fixed
          mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-6 px-4">
          <div className="w-full max-w-2xl">
            {currentNearDefeatStep.showCharacter && (
              <CharacterCard suspect={nearDefeatCharacter} portrait />
            )}
            <div className={currentNearDefeatStep.showCharacter ? 'mt-4' : undefined}>
              <DialogBox
                key={nearDefeatStepIndex}
                text={currentNearDefeatStep.text}
                speakerName={currentNearDefeatStep.speakerName}
              />
            </div>
            <button
              onClick={() => setNearDefeatStepIndex(nearDefeatStepIndex + 1)}
              className="mt-4 w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 transition-all"
            >
              {nearDefeatStepIndex < nearDefeatSteps.length - 1 ? '次へ' : '結末を見る'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 犯人を正しく特定できたか（完全正解 or 証拠不足で逃亡）
  const isMurdererIdentified = isCorrect || murdererEscaped

  // 完勝以外：is_critical な組み合わせのうち未発見のものが「見逃した真相の断片」
  const missedCombinations =
    isCorrect && !murdererEscaped
      ? []
      : (scenario.evidence_combinations ?? []).filter(
          (c) => c.is_critical && !discoveredCombinationIds.includes(c.id)
        )

  // 犯人特定時：プレイヤーが発見した組み合わせ（発見順を保持）
  const discoveredCombinations = isMurdererIdentified
    ? discoveredCombinationIds
        .map((id) => scenario.evidence_combinations?.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => c !== undefined)
    : []

  // 推理の軌跡用：犯人特定時に未発見の is_critical 組み合わせ（完全正解でも表示）
  const missedCritical = isMurdererIdentified
    ? (scenario.evidence_combinations ?? []).filter(
        (c) => c.is_critical && !discoveredCombinationIds.includes(c.id)
      )
    : []

  // 惜敗/不正解のカラーテーマ（完勝時は使用しない）
  const missedTheme = murdererEscaped
    ? {
        panel: 'border-amber-900/60',
        header: 'text-amber-500/80',
        border: 'border-amber-900/40',
        bg: 'bg-amber-950/10',
        accent: 'text-amber-500/70',
        faded: 'text-amber-500/50',
        emptyText: '証拠を突きつけることができなかった。',
      }
    : {
        panel: 'border-red-900/60',
        header: 'text-red-400/80',
        border: 'border-red-900/40',
        bg: 'bg-red-950/10',
        accent: 'text-red-400/70',
        faded: 'text-red-400/50',
        emptyText: '真犯人を見誤った。',
      }

  // 結果ラベル（ヘッダー用）
  const resultLabelData =
    isCorrect && !murdererEscaped
      ? {
          color: 'text-gothic-gold',
          subColor: 'text-gothic-gold',
          label: '真実',
          subtitle: '── 謎は解けた',
        }
      : murdererEscaped
        ? {
            color: 'text-amber-500',
            subColor: 'text-amber-500/70',
            label: '惜敗',
            subtitle: '── あと一歩及ばなかった',
          }
        : {
            color: 'text-red-400',
            subColor: 'text-red-400/70',
            label: '誤謬',
            subtitle: '── 真犯人を見逃した',
          }
  const resultLabel = (
    <div className="flex items-center gap-3">
      <span className={`${resultLabelData.color} font-display text-2xl`}>
        {resultLabelData.label}
      </span>
      <span className={`${resultLabelData.subColor} font-display text-sm tracking-widest`}>
        {resultLabelData.subtitle}
      </span>
    </div>
  )

  return (
    <div className="h-full relative flex flex-col">
      <MansionSceneBackground phase="ending" fixed />

      {/* ヘッダー：結果ラベル */}
      <div className="relative z-10 flex-shrink-0 px-4 py-2 border-b border-gothic-border bg-gothic-panel/85 backdrop-blur-sm">
        {resultLabel}
      </div>

      {/* 2カラムメイン */}
      <div className="relative z-10 flex-1 min-h-0 flex gap-2 px-3 py-2">
        {/* 左カラム：真相・証拠関連 */}
        <div className="flex-1 overflow-y-auto game-scrollbar flex flex-col gap-2 pr-1">
          {/* キャラクターカード（犯人特定時のみ）: flex-shrink-0 で真相テキストと重ならないようにする */}
          {isMurdererIdentified && (
            <div className="flex-shrink-0 flex justify-center">
              <CharacterCard suspect={murderer} portrait />
            </div>
          )}

          {murdererEscaped && (
            <GothicPanel className="border-amber-900/60">
              <p className="text-gothic-muted font-serif text-xs leading-relaxed">
                犯人は <span className="text-amber-500">{murderer.name}</span>
                ——あなたの推理は正しかった。
                <br />
                しかし、決定的な証拠を突きつけることができず、犯人は逃げ切った。
              </p>
            </GothicPanel>
          )}

          {!isMurdererIdentified && (
            <GothicPanel className="border-red-900">
              <p className="text-gothic-muted font-serif text-xs">
                あなたが告発したのは <span className="text-gothic-text">{voted.name}</span>{' '}
                でしたが…
              </p>
            </GothicPanel>
          )}

          {(murdererEscaped || (!isMurdererIdentified && showTruth)) && (
            <GothicPanel className={missedTheme.panel}>
              {missedCombinations.length === 0 ? (
                <p className="text-gothic-muted font-serif text-xs leading-relaxed">
                  決定的証拠はすべて揃えていた——それでも、{missedTheme.emptyText}
                </p>
              ) : (
                <>
                  <p className={`font-display text-xs tracking-widest mb-3 ${missedTheme.header}`}>
                    ── 見逃した真相の断片 ──
                  </p>
                  <div className="space-y-3">
                    {missedCombinations.map((combo) => (
                      <div
                        key={combo.id}
                        className={`border ${missedTheme.border} ${missedTheme.bg} p-2`}
                      >
                        <p className="text-gothic-text font-serif text-xs mb-1.5">{combo.name}</p>
                        <div className="space-y-1">
                          {combo.evidence_ids.map((eid) => {
                            const evidence = scenario.evidence.find((e) => e.id === eid)
                            if (!evidence) return null
                            const examined = examinedEvidenceIds.includes(eid)
                            return (
                              <div key={eid} className="flex items-center gap-2">
                                <span
                                  className={examined ? 'text-gothic-muted' : missedTheme.accent}
                                >
                                  {examined ? '◦' : '✕'}
                                </span>
                                <span
                                  className={`font-serif text-xs ${examined ? 'text-gothic-muted' : missedTheme.accent}`}
                                >
                                  {evidence.name}
                                  {!examined && (
                                    <span className={`ml-1 ${missedTheme.faded}`}>（未調査）</span>
                                  )}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </GothicPanel>
          )}

          {/* 真相：正解時は常に / 不正解時は「真相を見る」後のみ */}
          {(isMurdererIdentified || showTruth) && (
            <GothicPanel title="真相">
              <div className="space-y-3">
                <div>
                  <span className="text-gothic-gold font-display text-xs tracking-widest">
                    真犯人
                  </span>
                  <p className="text-gothic-text font-serif mt-0.5 text-sm">{murderer.name}</p>
                </div>
                <div>
                  <span className="text-gothic-gold font-display text-xs tracking-widest">
                    動機
                  </span>
                  <p className="text-gothic-text font-serif mt-0.5 text-xs leading-relaxed">
                    {scenario.motive}
                  </p>
                </div>
                <div>
                  <span className="text-gothic-gold font-display text-xs tracking-widest">
                    真相
                  </span>
                  <p className="text-gothic-text font-serif mt-0.5 text-xs leading-relaxed">
                    {scenario.truth}
                  </p>
                </div>
                {scenario.main_reasoning_path && (
                  <div className="border-t border-gothic-border pt-3">
                    <span className="text-gothic-gold font-display text-xs tracking-widest">
                      推理導線
                    </span>
                    <p className="text-gothic-muted font-serif mt-0.5 text-xs leading-relaxed whitespace-pre-line">
                      {scenario.main_reasoning_path}
                    </p>
                  </div>
                )}
              </div>
            </GothicPanel>
          )}
        </div>

        {/* 右カラム：推理の軌跡・捜査記録 */}
        <div className="w-[220px] flex-shrink-0 overflow-y-auto game-scrollbar flex flex-col gap-2 pl-1">
          {isMurdererIdentified &&
            (discoveredCombinations.length > 0 || missedCritical.length > 0) && (
              <GothicPanel>
                <p className="text-gothic-gold/70 font-display text-xs tracking-widest mb-3">
                  ── 推理の軌跡 ──
                </p>
                <div className="space-y-3 mb-3">
                  {discoveredCombinations.map((combo) => {
                    const evidenceNames = getEvidenceNames(combo.evidence_ids, scenario.evidence)
                    return (
                      <div key={combo.id}>
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {evidenceNames.map((name, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <span className="border border-gothic-border bg-stone-900/60 text-gothic-text font-serif text-[10px] px-1.5 py-0.5">
                                {name}
                              </span>
                              {i < evidenceNames.length - 1 && (
                                <span className="text-gothic-muted text-[10px]">＋</span>
                              )}
                            </span>
                          ))}
                        </div>
                        <p
                          className={`font-serif text-[10px] pl-1 ${combo.is_critical ? 'text-gothic-gold font-semibold' : 'text-gothic-gold/70'}`}
                        >
                          → {combo.name}
                          {combo.is_critical && (
                            <span className="ml-1 border border-gothic-gold/50 text-gothic-gold/80 text-[10px] px-1 py-0.5 font-display tracking-wide">
                              ⬥ 決定的
                            </span>
                          )}
                        </p>
                      </div>
                    )
                  })}
                  {missedCritical.map((combo) => (
                    <div key={combo.id} className="border-l-2 border-red-800/60 pl-2">
                      <p className="text-red-400/80 font-serif text-[10px]">
                        見逃した真相の断片：{combo.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gothic-border pt-2 flex items-center gap-2">
                  <span className="text-gothic-muted text-[10px]">↓</span>
                  <span className="text-gothic-gold font-display text-xs tracking-widest">
                    犯人確定：{murderer.name}
                  </span>
                </div>
              </GothicPanel>
            )}

          {isMurdererIdentified && (
            <GothicPanel>
              <p className="text-gothic-gold/70 font-display text-xs tracking-widest mb-2">
                ── 捜査記録 ──
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-[10px]">証拠調査</span>
                  <span className="text-gothic-text font-display text-xs">
                    {usedActions}
                    <span className="text-gothic-muted text-[10px]"> / {ACTIONS}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-[10px]">聞き込み</span>
                  <span className="text-gothic-text font-display text-xs">
                    {usedTalkActions}
                    <span className="text-gothic-muted text-[10px]"> / {TALK_ACTIONS}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-[10px]">議論突きつけ</span>
                  <span className="text-gothic-text font-display text-xs">
                    {usedDiscussionConfront}
                    <span className="text-gothic-muted text-[10px]">
                      {' '}
                      / {DISCUSSION_CONFRONT_ACTIONS}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-[10px]">断罪突きつけ</span>
                  <span className="text-gothic-text font-display text-xs">
                    {usedAccusationConfront}
                    <span className="text-gothic-muted text-[10px]">
                      {' '}
                      / {ACCUSATION_CONFRONT_ACTIONS}
                    </span>
                  </span>
                </div>
              </div>
            </GothicPanel>
          )}
        </div>
      </div>

      {/* フッター：ボタン行 */}
      <div className="relative z-10 flex-shrink-0 px-3 py-2 border-t border-gothic-border bg-gothic-panel/80 backdrop-blur-sm flex gap-2">
        <button
          onClick={() => resetGame()}
          className="flex-1 border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest text-xs py-2 transition-all"
        >
          {isMurdererIdentified ? '同じシナリオでリトライ' : 'リトライ'}
        </button>
        {!isMurdererIdentified && !showTruth && (
          <button
            onClick={() => setShowTruth(true)}
            className="flex-1 border border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text font-display tracking-widest text-xs py-2 transition-all"
          >
            真相を見る
          </button>
        )}
        {/* 体験版エンディング後のみ予告画面への導線を表示 */}
        {trial && useFixedScenario && (
          <button
            onClick={() => setPhase('trial_preview')}
            className="flex-1 border border-gothic-gold bg-gothic-gold/10 hover:bg-gothic-gold/20 text-gothic-gold font-display tracking-widest text-xs py-2 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            次のシナリオ予告
          </button>
        )}
        <button
          onClick={() => setPhase('title')}
          className="flex-1 border border-gothic-border text-gothic-muted font-serif text-xs py-2 hover:border-gothic-accent transition-all"
        >
          タイトルへ戻る
        </button>
      </div>
    </div>
  )
}
