// ゲーム終了画面。投票結果の正否と真相（犯人・動機・真実）を表示する。固定シナリオのみスコアを保存する
// isVictory（完勝）と isDefeat（敗北）の2パターン。惜敗・誤謬は「敗北」として統合
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
    actionsRemaining,
    talkActionsRemaining,
    discussionConfrontActionsRemaining,
    accusationConfrontActionsRemaining,
    useFixedScenario,
    isTutorialScenario,
    setPhase,
    resetGame,
  } = useGameStore()

  const [showTruth, setShowTruth] = useState(false)
  // 正解時の独白→エピローグ→結果 のステップ管理
  const [confessionStep, setConfessionStep] = useState<'confession' | 'epilogue' | 'done'>(
    'confession'
  )
  // 敗北エンド演出のステップインデックス（0 から順に進む）
  const [defeatStepIndex, setDefeatStepIndex] = useState(0)
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

  // 完勝フラグ（正しい犯人を指名かつ証拠十分）
  const isVictory = isCorrect && !murdererEscaped

  // 敗北エンド演出データを構築（キャラの最終一言 → 共通地の文 の順）
  const defeatSteps: Array<{ text: string; speakerName: string; showCharacter: boolean }> = []
  if (!isVictory) {
    // キャラの最終一言（犯人逃亡: escape_statement / 誤告発: defeat_statement ?? defense_statement）
    const charDialogText = isCorrect
      ? (scenario.accusation_data?.correct.escape_statement ?? '')
      : (scenario.accusation_data?.incorrect?.[votedSuspectId]?.defeat_statement ??
        scenario.accusation_data?.incorrect?.[votedSuspectId]?.defense_statement ??
        '')
    if (charDialogText) {
      defeatSteps.push({
        text: charDialogText,
        speakerName: isCorrect ? murderer.name : voted.name,
        showCharacter: true,
      })
    }
    // 地の文（全敗北共通: near_defeat_evidence_text）
    const narrationText = scenario.accusation_data?.correct.near_defeat_evidence_text ?? ''
    if (narrationText) {
      defeatSteps.push({ text: narrationText, speakerName: '── 幕', showCharacter: false })
    }
  }
  const currentDefeatStep = defeatSteps[defeatStepIndex]

  const confessionText = isVictory
    ? (murderer.confession_statement ?? scenario.accusation_data?.correct.breakdown_statement)
    : undefined
  const epilogueText = isVictory ? scenario.accusation_data?.correct.epilogue_text : undefined

  // 独白・エピローグステップ（完勝時の館シーン）
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
              className="game-button mt-4 w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 transition-all"
            >
              {isEpilogue ? '真相を見る' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 敗北エンド演出（キャラの最終一言 → 地の文）
  if (!isVictory && currentDefeatStep) {
    const defeatCharacter = isCorrect ? murderer : voted
    return (
      <div className="h-full relative">
        <MansionSceneBackground
          phase="ending"
          fixed
          mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-6 px-4">
          <div className="w-full max-w-2xl">
            {currentDefeatStep.showCharacter && (
              <CharacterCard suspect={defeatCharacter} portrait />
            )}
            <div className={currentDefeatStep.showCharacter ? 'mt-4' : undefined}>
              <DialogBox
                key={defeatStepIndex}
                text={currentDefeatStep.text}
                speakerName={currentDefeatStep.speakerName}
              />
            </div>
            <button
              onClick={() => setDefeatStepIndex(defeatStepIndex + 1)}
              className="game-button mt-4 w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 transition-all"
            >
              {defeatStepIndex < defeatSteps.length - 1 ? '次へ' : '結末を見る'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // O(1)ルックアップ用Map
  const combinationMap = new Map((scenario.evidence_combinations ?? []).map((c) => [c.id, c]))

  // 敗北時：is_critical な未発見組み合わせが「見逃した手がかり」
  const missedCombinations = isVictory
    ? []
    : (scenario.evidence_combinations ?? []).filter(
        (c) => c.is_critical && !discoveredCombinationIds.includes(c.id)
      )

  // プレイヤーが発見した組み合わせ（発見順を保持）
  const discoveredCombinations = discoveredCombinationIds
    .map((id) => combinationMap.get(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)

  // 敗北のカラーテーマ（完勝時は使用しない）
  const defeatTheme = {
    panel: 'border-red-900/60',
    header: 'text-red-400/80',
    accent: 'text-red-400/70',
    emptyText: isCorrect ? '証拠を突きつけることができなかった。' : '真犯人を見誤った。',
  }

  // 結果ラベル（ヘッダー用）
  const resultLabelData = isVictory
    ? {
        color: 'text-gothic-gold',
        subColor: 'text-gothic-gold',
        label: '真実',
        subtitle: '── 謎は解けた',
      }
    : {
        color: 'text-red-400',
        subColor: 'text-red-400/70',
        label: '敗北',
        subtitle: '── 真相は闇の中に消えた',
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
          {/* キャラクターカード：完勝は犯人、敗北は告発した容疑者 */}
          <div className="flex-shrink-0 flex justify-center">
            <CharacterCard suspect={isVictory ? murderer : voted} portrait />
          </div>

          {/* 告発パネル：敗北エンド全体で表示（正解+逃亡・誤謬どちらも） */}
          {!isVictory && (
            <GothicPanel className="border-red-900">
              <p className="text-gothic-muted font-serif text-xs">
                あなたが告発したのは <span className="text-gothic-text">{voted.name}</span>{' '}
                でしたが…
              </p>
            </GothicPanel>
          )}

          {/* 手がかりパネル：敗北時に発見済み＋未発見件数を表示 */}
          {!isVictory && (
            <GothicPanel className={defeatTheme.panel}>
              {missedCombinations.length === 0 ? (
                <p className="text-gothic-muted font-serif text-xs leading-relaxed">
                  決定的証拠はすべて揃えていた——それでも、{defeatTheme.emptyText}
                </p>
              ) : (
                <>
                  {discoveredCombinations.length > 0 && (
                    <>
                      <p
                        className={`font-display text-xs tracking-widest mb-2 ${defeatTheme.header}`}
                      >
                        ── 発見した手がかり ──
                      </p>
                      <div className="space-y-1 mb-3">
                        {discoveredCombinations.map((c) => (
                          <div
                            key={c.id}
                            className="font-serif text-xs text-gothic-text leading-relaxed"
                          >
                            ◆ {c.name}
                            <span className="text-gothic-muted ml-1">— {c.description}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <p className={`font-display text-xs tracking-widest mb-2 ${defeatTheme.header}`}>
                    ── 見逃した手がかり ──
                  </p>
                  <p className={`font-serif text-xs ${defeatTheme.accent}`}>
                    未発見の決定的手がかり：{missedCombinations.length} つ
                  </p>
                </>
              )}
            </GothicPanel>
          )}

          {/* 真相：完勝時は常に / 敗北時は「真相を見る」後のみ */}
          {(isVictory || showTruth) && (
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
          {/* 推理の軌跡：常時表示。発見済みは詳細表示、未発見は伏せる */}
          <GothicPanel>
            <p className="text-gothic-gold/70 font-display text-xs tracking-widest mb-3">
              ── 推理の軌跡 ──
            </p>
            {discoveredCombinations.length === 0 ? (
              <p className="text-gothic-muted font-serif text-[10px]">まだ推理を発見していない</p>
            ) : (
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
              </div>
            )}
            {/* 犯人確定フッター：完勝のみ */}
            {isVictory && (
              <div className="border-t border-gothic-border pt-2 flex items-center gap-2">
                <span className="text-gothic-muted text-[10px]">↓</span>
                <span className="text-gothic-gold font-display text-xs tracking-widest">
                  犯人確定：{murderer.name}
                </span>
              </div>
            )}
          </GothicPanel>

          {/* 捜査記録：常時表示 */}
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
        </div>
      </div>

      {/* フッター：ボタン行 */}
      <div className="relative z-10 flex-shrink-0 px-3 py-2 border-t border-gothic-border bg-gothic-panel/80 backdrop-blur-sm flex gap-2">
        <button
          onClick={() => resetGame()}
          className="game-button flex-1 border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest text-xs py-2 transition-all"
        >
          {isVictory ? '同じシナリオでリトライ' : 'リトライ'}
        </button>
        {!isVictory && !showTruth && (
          <button
            onClick={() => setShowTruth(true)}
            className="game-button flex-1 border border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text font-display tracking-widest text-xs py-2 transition-all"
          >
            真相を見る
          </button>
        )}
        {/* 体験版エンディング後のみ予告画面への導線を表示 */}
        {trial && useFixedScenario && (
          <button
            onClick={() => setPhase('trial_preview')}
            className="game-button flex-1 border border-gothic-gold bg-gothic-gold/20 hover:bg-gothic-gold/30 text-gothic-gold font-display tracking-widest text-xs py-2 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
          >
            次のシナリオ予告
          </button>
        )}
        {isTutorialScenario ? (
          <button
            onClick={() => setPhase('tutorial')}
            className="game-button flex-1 border border-gothic-gold bg-gothic-panel text-gothic-gold font-display tracking-widest text-xs py-2 hover:bg-stone-800 transition-all"
          >
            チュートリアルに戻る
          </button>
        ) : (
          <button
            onClick={() => setPhase('title')}
            className="game-button flex-1 border border-gothic-border bg-gothic-panel text-gothic-muted font-serif text-xs py-2 hover:border-gothic-accent transition-all"
          >
            タイトルへ戻る
          </button>
        )}
      </div>
    </div>
  )
}
