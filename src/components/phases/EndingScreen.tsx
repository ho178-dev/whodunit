// ゲーム終了画面。投票結果の正否と真相（犯人・動機・真実）を表示する。固定シナリオのみスコアを保存する
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { isTrialMode } from '../../constants/salesConfig'
import { GothicPanel } from '../layout/GothicPanel'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { DIFFICULTY_CONFIG } from '../../constants/gameConfig'
import { getEvidenceNames } from '../../utils/scenario'
import { loadScoreData, saveScore } from '../../utils/score'
import type { DifficultyScore } from '../../types/game'

export function EndingScreen() {
  const {
    scenario,
    votedSuspectId,
    murdererEscaped,
    discoveredCombinationIds,
    examinedEvidenceIds,
    actionsRemaining,
    talkActionsRemaining,
    difficulty,
    useFixedScenario,
    setPhase,
    resetGame,
  } = useGameStore()

  const [showTruth, setShowTruth] = useState(false)
  // スコア保存済みフラグ（StrictModeの二重発火防止）
  const scoreSaved = useRef(false)
  const [bestFlags, setBestFlags] = useState({ actions: false, talkActions: false })
  const [savedScore, setSavedScore] = useState<DifficultyScore | null>(null)

  const trial = isTrialMode()
  const config = DIFFICULTY_CONFIG[difficulty]
  const usedActions = config.actions - actionsRemaining
  const usedTalkActions = config.talkActions - talkActionsRemaining

  // 固定シナリオかつエンディング到達時にスコアを保存する（1回のみ・early return の前に配置）
  useEffect(() => {
    if (!useFixedScenario || !scenario || !votedSuspectId || scoreSaved.current) return
    scoreSaved.current = true

    const prev = loadScoreData(scenario.title)[difficulty]
    const cleared = votedSuspectId === scenario.murderer_id && !murdererEscaped

    if (cleared) {
      setBestFlags({
        actions: prev?.bestActions === undefined || usedActions < prev.bestActions,
        talkActions: prev?.bestTalkActions === undefined || usedTalkActions < prev.bestTalkActions,
      })
    }

    setSavedScore(saveScore(scenario.title, difficulty, { cleared, usedActions, usedTalkActions }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 意図的にマウント時1回のみ実行

  if (!scenario || !votedSuspectId) return null

  const isCorrect = votedSuspectId === scenario.murderer_id
  // 犯人を正しく特定できたか（完全正解 or 証拠不足で逃亡）
  const isMurdererIdentified = isCorrect || murdererEscaped
  const murderer = scenario.suspects.find((s) => s.id === scenario.murderer_id)!
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

  return (
    <div className="min-h-screen">
      <MansionSceneBackground phase="ending" fixed />
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            {isCorrect && !murdererEscaped ? (
              <>
                <div className="text-gothic-gold font-display text-5xl mb-4">真実</div>
                <h1 className="font-display text-2xl text-gothic-gold tracking-widest">
                  謎は解けた
                </h1>
              </>
            ) : murdererEscaped ? (
              <>
                <div className="text-amber-500 font-display text-5xl mb-4">惜敗</div>
                <h1 className="font-display text-2xl text-amber-500 tracking-widest">
                  あと一歩及ばなかった
                </h1>
              </>
            ) : (
              <>
                <div className="text-red-400 font-display text-5xl mb-4">誤謬</div>
                <h1 className="font-display text-2xl text-red-400 tracking-widest">
                  真犯人を見逃した
                </h1>
              </>
            )}
          </div>

          {murdererEscaped && (
            <GothicPanel className="mb-4 border-amber-900/60">
              <p className="text-gothic-muted font-serif text-sm leading-relaxed">
                犯人は <span className="text-amber-500">{murderer.name}</span>
                ——あなたの推理は正しかった。
                <br />
                しかし、決定的な証拠を突きつけることができず、犯人は逃げ切った。
              </p>
            </GothicPanel>
          )}

          {!isMurdererIdentified && (
            <GothicPanel className="mb-4 border-red-900">
              <p className="text-gothic-muted font-serif text-sm">
                あなたが告発したのは <span className="text-gothic-text">{voted.name}</span>{' '}
                でしたが…
              </p>
            </GothicPanel>
          )}

          {(murdererEscaped || (!isMurdererIdentified && showTruth)) && (
            <GothicPanel className={`mb-4 ${missedTheme.panel}`}>
              {missedCombinations.length === 0 ? (
                <p className="text-gothic-muted font-serif text-sm leading-relaxed">
                  決定的証拠はすべて揃えていた——それでも、{missedTheme.emptyText}
                </p>
              ) : (
                <>
                  <p className={`font-display text-xs tracking-widest mb-4 ${missedTheme.header}`}>
                    ── 見逃した決定的事実 ──
                  </p>
                  <div className="space-y-4">
                    {missedCombinations.map((combo) => (
                      <div
                        key={combo.id}
                        className={`border ${missedTheme.border} ${missedTheme.bg} p-3`}
                      >
                        <p className="text-gothic-text font-serif text-sm mb-2">{combo.name}</p>
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

          {isMurdererIdentified && discoveredCombinations.length > 0 && (
            <GothicPanel className="mb-4">
              <p className="text-gothic-gold/70 font-display text-xs tracking-widest mb-4">
                ── 推理の軌跡 ──
              </p>
              <div className="space-y-3 mb-4">
                {discoveredCombinations.map((combo) => {
                  const evidenceNames = getEvidenceNames(combo.evidence_ids, scenario.evidence)
                  return (
                    <div key={combo.id}>
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        {evidenceNames.map((name, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className="border border-gothic-border bg-stone-900/60 text-gothic-text font-serif text-xs px-2 py-0.5">
                              {name}
                            </span>
                            {i < evidenceNames.length - 1 && (
                              <span className="text-gothic-muted text-xs">＋</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <p className="text-gothic-gold font-serif text-xs pl-1">→ {combo.name}</p>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gothic-border pt-3 flex items-center gap-2">
                <span className="text-gothic-muted text-xs">↓</span>
                <span className="text-gothic-gold font-display text-sm tracking-widest">
                  犯人確定：{murderer.name}
                </span>
              </div>
            </GothicPanel>
          )}

          {isMurdererIdentified && (
            <GothicPanel className="mb-4">
              <p className="text-gothic-gold/70 font-display text-xs tracking-widest mb-3">
                ── 捜査記録 ──
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-xs">証拠調査</span>
                  <span className="text-gothic-text font-display text-sm flex items-center gap-1.5">
                    {usedActions}
                    <span className="text-gothic-muted text-xs">
                      / {config.actions} アクション使用
                    </span>
                    {bestFlags.actions && (
                      <span className="text-gothic-gold text-xs font-serif">★ベスト</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gothic-muted font-serif text-xs">聞き込み</span>
                  <span className="text-gothic-text font-display text-sm flex items-center gap-1.5">
                    {usedTalkActions}
                    <span className="text-gothic-muted text-xs">
                      / {config.talkActions} アクション使用
                    </span>
                    {bestFlags.talkActions && (
                      <span className="text-gothic-gold text-xs font-serif">★ベスト</span>
                    )}
                  </span>
                </div>
                {/* 自己ベスト表示（クリア済みスコアがある場合） */}
                {savedScore?.bestActions !== undefined && useFixedScenario && (
                  <div className="border-t border-gothic-border/30 pt-1.5 mt-1">
                    <p className="text-gothic-muted font-serif text-xs mb-1">
                      自己ベスト（クリア時）
                    </p>
                    <div className="flex gap-4">
                      <span className="text-gothic-muted font-serif text-xs">
                        調査 {savedScore.bestActions} / 聞込 {savedScore.bestTalkActions ?? '―'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </GothicPanel>
          )}

          {/* 正解時: 常に真相表示 / 不正解時: 「真相を見る」選択後のみ表示 */}
          {(isMurdererIdentified || showTruth) && (
            <GothicPanel title="真相" className="mb-6">
              <div className="space-y-4">
                <div>
                  <span className="text-gothic-gold font-display text-sm tracking-widest">
                    真犯人
                  </span>
                  <p className="text-gothic-text font-serif mt-1 text-lg">{murderer.name}</p>
                </div>
                <div>
                  <span className="text-gothic-gold font-display text-sm tracking-widest">
                    動機
                  </span>
                  <p className="text-gothic-text font-serif mt-1">{scenario.motive}</p>
                </div>
                <div>
                  <span className="text-gothic-gold font-display text-sm tracking-widest">
                    真相
                  </span>
                  <p className="text-gothic-text font-serif mt-1 leading-relaxed">
                    {scenario.truth}
                  </p>
                </div>
              </div>
            </GothicPanel>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => resetGame()}
              className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-widest py-3 transition-all"
            >
              {isMurdererIdentified ? '同じシナリオでリトライ' : 'リトライ'}
            </button>
            {!isMurdererIdentified && !showTruth && (
              <button
                onClick={() => setShowTruth(true)}
                className="border border-gothic-accent bg-gothic-panel hover:bg-stone-800 text-gothic-text font-display tracking-widest py-3 transition-all"
              >
                真相を見る
              </button>
            )}
            {/* 体験版エンディング後のみ予告画面への導線を表示 */}
            {trial && useFixedScenario && (
              <button
                onClick={() => setPhase('trial_preview')}
                className="border border-gothic-gold bg-gothic-gold/10 hover:bg-gothic-gold/20 text-gothic-gold font-display tracking-widest py-3 transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]"
              >
                次のシナリオ予告を見る
                <span className="block text-xs text-gothic-muted mt-1 font-serif">
                  有料版の2シナリオを紹介
                </span>
              </button>
            )}
            <button
              onClick={() => setPhase('title')}
              className="border border-gothic-border text-gothic-muted font-serif py-3 hover:border-gothic-accent transition-all"
            >
              タイトルへ戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
