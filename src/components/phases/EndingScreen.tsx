// ゲーム終了画面。投票結果の正否と真相（犯人・動機・真実）を表示する。固定シナリオのみスコアを保存する
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { isTrialMode } from '../../constants/salesConfig'
import { GothicPanel } from '../layout/GothicPanel'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { CharacterCard } from '../shared/CharacterCard'
import { DialogBox } from '../shared/DialogBox'
import { ACTIONS, TALK_ACTIONS } from '../../constants/gameConfig'
import { calculateRank } from '../../utils/score'
import { getEvidenceNames } from '../../utils/scenario'
import { loadScoreData, saveScore } from '../../utils/score'
import type { DifficultyScore } from '../../types/game'
import { resolveMansionAsset } from '../../services/assetResolver'

// ランク表示スタイル（S=金, A=銀, B=銅, C=白グレー）
const RANK_STYLE = {
  S: {
    color: 'text-yellow-400',
    shadow: 'drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]',
    label: '探偵ランク',
  },
  A: {
    color: 'text-slate-300',
    shadow: 'drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]',
    label: '探偵ランク',
  },
  B: {
    color: 'text-amber-700',
    shadow: 'drop-shadow-[0_0_6px_rgba(180,83,9,0.5)]',
    label: '探偵ランク',
  },
  C: { color: 'text-gray-400', shadow: '', label: '探偵ランク' },
} as const

export function EndingScreen() {
  const {
    scenario,
    votedSuspectId,
    murdererEscaped,
    discoveredCombinationIds,
    examinedEvidenceIds,
    actionsRemaining,
    talkActionsRemaining,
    useFixedScenario,
    setPhase,
    resetGame,
  } = useGameStore()

  const [showTruth, setShowTruth] = useState(false)
  // 正解時の独白→エピローグ→結果 のステップ管理
  const [confessionStep, setConfessionStep] = useState<'confession' | 'epilogue' | 'done'>(
    'confession'
  )
  // スコア保存済みフラグ（StrictModeの二重発火防止）
  const scoreSaved = useRef(false)
  const [bestFlags, setBestFlags] = useState({ actions: false, talkActions: false })
  const [savedScore, setSavedScore] = useState<DifficultyScore | null>(null)

  const trial = isTrialMode()
  const usedActions = ACTIONS - actionsRemaining
  const usedTalkActions = TALK_ACTIONS - talkActionsRemaining

  // 固定シナリオかつエンディング到達時にスコアを保存する（1回のみ・early return の前に配置）
  useEffect(() => {
    if (!useFixedScenario || !scenario || !votedSuspectId || scoreSaved.current) return
    scoreSaved.current = true

    const prev = loadScoreData(scenario.title)
    const cleared = votedSuspectId === scenario.murderer_id && !murdererEscaped

    if (cleared) {
      setBestFlags({
        actions: prev?.bestActions === undefined || usedActions < prev.bestActions,
        talkActions: prev?.bestTalkActions === undefined || usedTalkActions < prev.bestTalkActions,
      })
    }

    setSavedScore(saveScore(scenario.title, { cleared, usedActions, usedTalkActions }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 意図的にマウント時1回のみ実行

  if (!scenario || !votedSuspectId) return null

  const isCorrect = votedSuspectId === scenario.murderer_id
  const murderer = scenario.suspects.find((s) => s.id === scenario.murderer_id)!
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

  // 今回プレイのランク（正解時のみ算出）
  const currentRank = isCorrect && !murdererEscaped ? calculateRank(usedActions) : null
  // 犯人を正しく特定できたか（完全正解 or 証拠不足で逃亡）
  const isMurdererIdentified = isCorrect || murdererEscaped
  const voted = scenario.suspects.find((s) => s.id === votedSuspectId)!

  // 完勝以外：is_critical な組み合わせのうち未発見のものが「見逃した決定的事実」
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

  // 結果ラベルとランク表示（ヘッダー用）
  const resultLabel =
    isCorrect && !murdererEscaped ? (
      <div className="flex items-center gap-3">
        <span className="text-gothic-gold font-display text-2xl">真実</span>
        <span className="text-gothic-gold font-display text-sm tracking-widest">── 謎は解けた</span>
        {currentRank && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-gothic-muted font-serif text-[10px]">
              {RANK_STYLE[currentRank].label}
            </span>
            <span
              className={`font-display text-2xl ${RANK_STYLE[currentRank].color} ${RANK_STYLE[currentRank].shadow}`}
            >
              {currentRank}
            </span>
            {savedScore?.bestRank && savedScore.bestRank !== currentRank && (
              <span className="text-gothic-muted font-serif text-[10px]">
                ベスト：
                <span className={RANK_STYLE[savedScore.bestRank].color}>{savedScore.bestRank}</span>
              </span>
            )}
          </div>
        )}
      </div>
    ) : murdererEscaped ? (
      <div className="flex items-center gap-3">
        <span className="text-amber-500 font-display text-2xl">惜敗</span>
        <span className="text-amber-500/70 font-display text-sm tracking-widest">
          ── あと一歩及ばなかった
        </span>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <span className="text-red-400 font-display text-2xl">誤謬</span>
        <span className="text-red-400/70 font-display text-sm tracking-widest">
          ── 真犯人を見逃した
        </span>
      </div>
    )

  return (
    <div className="h-full relative flex flex-col">
      <MansionSceneBackground phase="ending" fixed />

      {/* ヘッダー：結果ラベル + ランク */}
      <div className="relative z-10 flex-shrink-0 px-4 py-2 border-b border-gothic-border bg-gothic-panel/85 backdrop-blur-sm">
        {resultLabel}
      </div>

      {/* 2カラムメイン */}
      <div className="relative z-10 flex-1 min-h-0 flex gap-2 px-3 py-2">
        {/* 左カラム：真相・証拠関連 */}
        <div className="flex-1 overflow-y-auto game-scrollbar flex flex-col gap-2 pr-1">
          {/* キャラクターカード（犯人特定時のみ） */}
          {isMurdererIdentified && (
            <div className="h-[160px] flex-shrink-0">
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
                    ── 見逃した決定的事実 ──
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
                        見逃した決定的事実：{combo.name}
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
                  <span className="text-gothic-text font-display text-xs flex items-center gap-1">
                    {usedActions}
                    <span className="text-gothic-muted text-[10px]">/ {ACTIONS}</span>
                    {bestFlags.actions && (
                      <span className="text-gothic-gold text-[10px] font-serif">★</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-[10px]">聞き込み</span>
                  <span className="text-gothic-text font-display text-xs flex items-center gap-1">
                    {usedTalkActions}
                    <span className="text-gothic-muted text-[10px]">/ {TALK_ACTIONS}</span>
                    {bestFlags.talkActions && (
                      <span className="text-gothic-gold text-[10px] font-serif">★</span>
                    )}
                  </span>
                </div>
                {savedScore?.bestActions !== undefined && useFixedScenario && (
                  <div className="border-t border-gothic-border/30 pt-1.5 mt-1">
                    <p className="text-gothic-muted font-serif text-[10px] mb-1">自己ベスト</p>
                    <span className="text-gothic-muted font-serif text-[10px]">
                      調査 {savedScore.bestActions} / 聞込 {savedScore.bestTalkActions ?? '―'}
                    </span>
                  </div>
                )}
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
