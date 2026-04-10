// シナリオデバッグコンポーネント: 固定シナリオのテキスト情報を全て確認するデバッグ用UI
// 新シナリオを追加する場合は SCENARIO_LIST 配列に追加するだけで対応可能

import { useState } from 'react'
import type { Scenario, Evidence, NpcBehavior } from '../../types/scenario'
import { getEvidenceNames } from '../../utils/scenario'
import { FIXED_SCENARIO } from '../../constants/fixedScenario'
import { FIXED_SCENARIO_2 } from '../../constants/fixedScenario2'
import { FIXED_SCENARIO_3 } from '../../constants/fixedScenario3'

// ────────────────────────────────────────────────────────────
// シナリオリスト: 新シナリオ追加時はここに追記するだけでUIに反映される
// ────────────────────────────────────────────────────────────
const SCENARIO_LIST: { label: string; scenario: Scenario }[] = [
  { label: 'シナリオ1', scenario: FIXED_SCENARIO },
  { label: 'シナリオ2', scenario: FIXED_SCENARIO_2 },
  { label: 'シナリオ3', scenario: FIXED_SCENARIO_3 },
]

// ────────────────────────────────────────────────────────────
// ユーティリティ
// ────────────────────────────────────────────────────────────

/** NpcBehavior に対応するラベルカラークラスを返す */
function behaviorClass(behavior: NpcBehavior): string {
  switch (behavior) {
    case 'calm':
      return 'bg-blue-900 text-blue-300 border-blue-700'
    case 'nervous':
      return 'bg-yellow-900 text-yellow-300 border-yellow-700'
    case 'angry':
      return 'bg-red-900 text-red-300 border-red-700'
    case 'sad':
      return 'bg-indigo-900 text-indigo-300 border-indigo-700'
    case 'evasive':
      return 'bg-orange-900 text-orange-300 border-orange-700'
  }
}

/** 証拠IDから証拠名を引く */
function resolveEvidenceName(evidenceId: string, evidenceList: Evidence[]): string {
  return getEvidenceNames([evidenceId], evidenceList)[0]
}

// ────────────────────────────────────────────────────────────
// 共通UIパーツ
// ────────────────────────────────────────────────────────────

/** ラベル + 値の1行表示 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-32 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-200 whitespace-pre-wrap">{value}</span>
    </div>
  )
}

/** アコーディオン: タイトルクリックで開閉 */
function Accordion({
  title,
  badge,
  badgeColor = 'bg-gray-700 text-gray-400',
  defaultOpen = false,
  children,
}: {
  title: string
  badge?: string
  badgeColor?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-700 rounded">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-gray-400 text-xs">{open ? '▼' : '▶'}</span>
        <span className="font-semibold text-gray-100 text-sm">{title}</span>
        {badge && (
          <span className={`ml-1 rounded px-1.5 py-0.5 text-xs border ${badgeColor}`}>{badge}</span>
        )}
      </button>
      {open && <div className="border-t border-gray-700 px-4 py-3 space-y-3">{children}</div>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// セクションコンポーネント
// ────────────────────────────────────────────────────────────

/** 概要セクション: シナリオの基本情報・被害者・犯人・動機・真相 */
function OverviewSection({ scenario }: { scenario: Scenario }) {
  const murderer = scenario.suspects.find((s) => s.id === scenario.murderer_id)
  return (
    <Accordion title="概要" defaultOpen={true}>
      <div className="space-y-2">
        <InfoRow label="タイトル" value={scenario.title} />
        <InfoRow label="あらすじ" value={scenario.synopsis} />
        <InfoRow label="舞台設定" value={scenario.setting} />
        <InfoRow label="推定殺害時刻" value={scenario.murder_time_range} />
      </div>
      <div className="border-t border-gray-700 pt-3 space-y-2">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">被害者</p>
        <InfoRow label="名前" value={scenario.victim.name} />
        <InfoRow label="外見" value={scenario.victim.appearance_id} />
        <InfoRow label="人物像" value={scenario.victim.description} />
        <InfoRow label="死因" value={scenario.victim.cause_of_death} />
      </div>
      <div className="border-t border-gray-700 pt-3 space-y-2">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          犯人・動機・真相
        </p>
        <InfoRow label="犯人ID" value={scenario.murderer_id} />
        {murderer && <InfoRow label="犯人名" value={murderer.name} />}
        <InfoRow label="動機" value={scenario.motive} />
        <InfoRow label="真相" value={scenario.truth} />
      </div>
    </Accordion>
  )
}

/** 部屋一覧セクション */
function RoomsSection({ scenario }: { scenario: Scenario }) {
  return (
    <Accordion title="部屋一覧" badge={`${scenario.rooms.length}件`}>
      <div className="space-y-2">
        {scenario.rooms.map((room) => (
          <Accordion
            key={room.id}
            title={`${room.name}`}
            badge={room.type_id}
            badgeColor="bg-stone-800 text-stone-400 border-stone-600"
          >
            <div className="space-y-2">
              <InfoRow label="ID" value={room.id} />
              <InfoRow label="説明" value={room.description} />
              <div className="flex gap-2 text-sm">
                <span className="w-32 shrink-0 text-gray-500">証拠品</span>
                <div className="flex flex-wrap gap-1">
                  {room.evidence_ids.length > 0 ? (
                    room.evidence_ids.map((eid) => (
                      <span
                        key={eid}
                        className="rounded bg-gray-700 border border-gray-600 px-2 py-0.5 text-xs text-amber-300"
                      >
                        {resolveEvidenceName(eid, scenario.evidence)}{' '}
                        <span className="text-gray-500">({eid})</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs">なし</span>
                  )}
                </div>
              </div>
            </div>
          </Accordion>
        ))}
      </div>
    </Accordion>
  )
}

/** 容疑者一覧セクション */
function SuspectsSection({ scenario }: { scenario: Scenario }) {
  return (
    <Accordion title="容疑者一覧" badge={`${scenario.suspects.length}人`}>
      <div className="space-y-2">
        {scenario.suspects.map((suspect) => {
          const isMurderer = suspect.id === scenario.murderer_id
          return (
            <Accordion
              key={suspect.id}
              title={suspect.name}
              badge={isMurderer ? '犯人' : undefined}
              badgeColor="bg-red-900 text-red-300 border-red-700"
            >
              {/* 基本情報 */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  基本情報
                </p>
                <InfoRow label="ID" value={suspect.id} />
                <InfoRow label="年齢" value={`${suspect.age}歳`} />
                <InfoRow label="職業" value={suspect.occupation} />
                <InfoRow label="外見ID" value={suspect.appearance_id} />
                <InfoRow label="人物像" value={suspect.description} />
                <InfoRow label="性格" value={suspect.personality} />
                <InfoRow label="被害者との関係" value={suspect.relationship_to_victim} />
                <InfoRow label="アリバイ" value={suspect.alibi} />
                <InfoRow label="秘密" value={suspect.secret} />
                <InfoRow label="タイムライン" value={suspect.timeline} />
                <InfoRow
                  label="矛盾あり"
                  value={suspect.timeline_has_contradiction ? '✓ あり' : 'なし'}
                />
                <InfoRow label="配置部屋ID" value={suspect.room_id} />
              </div>

              {/* 会話 */}
              <div className="border-t border-gray-700 pt-3 space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">会話</p>
                <div className="flex gap-2 text-sm">
                  <span className="w-32 shrink-0 text-gray-500">挨拶</span>
                  <span className="text-gray-200 italic">
                    &ldquo;{suspect.investigation_dialog.greeting}&rdquo;
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">証言リスト</span>
                  {suspect.investigation_dialog.statements.map((stmt, i) => (
                    <div key={i} className="flex gap-2 text-sm pl-2 border-l-2 border-gray-700">
                      <span className="w-5 shrink-0 text-gray-600">{i}</span>
                      <span className="text-gray-300 italic">&ldquo;{stmt}&rdquo;</span>
                    </div>
                  ))}
                </div>
                <InfoRow
                  label="汎用追及リアクション"
                  value={suspect.default_wrong_pursuit_response}
                />
                {suspect.confession_statement && (
                  <InfoRow label="独白セリフ" value={suspect.confession_statement} />
                )}
              </div>

              {/* 証拠反応 */}
              <div className="border-t border-gray-700 pt-3 space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  証拠反応 ({Object.entries(suspect.evidence_reactions).length}件)
                </p>
                {Object.entries(suspect.evidence_reactions).map(([evidenceId, reaction]) => (
                  <div
                    key={evidenceId}
                    className="rounded bg-gray-900 border border-gray-700 p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 text-xs font-semibold">
                        {resolveEvidenceName(evidenceId, scenario.evidence)}
                      </span>
                      <span className="text-gray-600 text-xs">({evidenceId})</span>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-xs ${behaviorClass(reaction.behavior)}`}
                      >
                        {reaction.behavior}
                      </span>
                      {reaction.contradicts_statement_index !== undefined && (
                        <span className="rounded border border-purple-700 bg-purple-900 px-1.5 py-0.5 text-xs text-purple-300">
                          証言{reaction.contradicts_statement_index}と矛盾
                        </span>
                      )}
                    </div>
                    <p className="text-gray-200 text-sm italic">
                      &ldquo;{reaction.reaction}&rdquo;
                    </p>
                    {reaction.wrong_testimony_response && (
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-600">誤証言リアクション: </span>
                        <span className="italic">{reaction.wrong_testimony_response}</span>
                      </div>
                    )}
                    {reaction.pursuit_questions && reaction.pursuit_questions.length > 0 && (
                      <div className="space-y-2 pt-1 border-t border-gray-700">
                        <p className="text-xs text-gray-600">追及質問チェーン</p>
                        {reaction.pursuit_questions.map((pq) => (
                          <div key={pq.id} className="pl-2 border-l-2 border-purple-800 space-y-1">
                            <p className="text-xs text-purple-300">Q: {pq.text}</p>
                            <p className="text-xs text-gray-300 italic">
                              A: &ldquo;{pq.response}&rdquo;
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded border px-1.5 py-0.5 text-xs ${behaviorClass(pq.behavior)}`}
                              >
                                {pq.behavior}
                              </span>
                              {pq.unlocks_pursuit_question_ids &&
                                pq.unlocks_pursuit_question_ids.length > 0 && (
                                  <span className="text-xs text-gray-600">
                                    → 解放: {pq.unlocks_pursuit_question_ids.join(', ')}
                                  </span>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Accordion>
          )
        })}
      </div>
    </Accordion>
  )
}

/** 証拠品一覧セクション */
function EvidenceSection({ scenario }: { scenario: Scenario }) {
  const real = scenario.evidence.filter((e) => !e.is_fake)
  const fake = scenario.evidence.filter((e) => e.is_fake)
  return (
    <Accordion title="証拠品一覧" badge={`${scenario.evidence.length}件`}>
      <p className="text-xs text-gray-600">
        本物 {real.length}件 / 偽（ミスリード）{fake.length}件
      </p>
      <div className="space-y-2">
        {scenario.evidence.map((evidence) => (
          <Accordion
            key={evidence.id}
            title={evidence.name}
            badge={evidence.is_fake ? '偽' : evidence.category_id}
            badgeColor={
              evidence.is_fake
                ? 'bg-red-900 text-red-300 border-red-700'
                : 'bg-stone-800 text-stone-400 border-stone-600'
            }
          >
            <div className="space-y-2">
              <InfoRow label="ID" value={evidence.id} />
              <InfoRow label="カテゴリ" value={evidence.category_id} />
              <InfoRow label="偽証拠" value={evidence.is_fake ? '✓ ミスリード' : 'なし（本物）'} />
              <InfoRow label="外見説明" value={evidence.description} />
              {evidence.first_impression && (
                <InfoRow label="第一印象（偽）" value={evidence.first_impression} />
              )}
              <InfoRow label="関連性" value={evidence.relevance} />
              <InfoRow label="鑑定記録" value={evidence.examination_notes} />
            </div>
          </Accordion>
        ))}
      </div>
    </Accordion>
  )
}

/** 告発シーンセクション */
function AccusationSection({ scenario }: { scenario: Scenario }) {
  const data = scenario.accusation_data
  if (!data) {
    return (
      <Accordion title="告発シーン" badge="なし">
        <p className="text-sm text-gray-500">このシナリオには告発シーンデータがありません。</p>
      </Accordion>
    )
  }
  return (
    <Accordion title="告発シーン">
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">正解ルート</p>
        <InfoRow label="最終弁明" value={data.correct.defense_statement} />
        <InfoRow label="証拠提示反論" value={data.correct.evidence_rebuttal} />
        <InfoRow label="推理不一致反論" value={data.correct.wrong_link_rebuttal} />
        <InfoRow label="汎用反駁ナレーション" value={data.correct.refutation_text} />
        <InfoRow label="犯人独白" value={data.correct.breakdown_statement} />
        {data.correct.epilogue_text && (
          <InfoRow label="エピローグ（地の文）" value={data.correct.epilogue_text} />
        )}
        {data.correct.escape_statement && (
          <InfoRow label="逃亡セリフ" value={data.correct.escape_statement} />
        )}
      </div>
      <div className="border-t border-gray-700 pt-3 space-y-2">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          不正解ルート ({Object.keys(data.incorrect).length}人分)
        </p>
        {Object.entries(data.incorrect).map(([suspectId, inc]) => {
          const suspect = scenario.suspects.find((s) => s.id === suspectId)
          return (
            <Accordion key={suspectId} title={suspect?.name ?? suspectId}>
              <InfoRow label="弁明" value={inc.defense_statement} />
              <InfoRow label="証拠提示反論" value={inc.evidence_rebuttal} />
              <InfoRow label="推理不一致反論" value={inc.wrong_link_rebuttal} />
            </Accordion>
          )
        })}
      </div>
    </Accordion>
  )
}

/** 証拠クロス参照セクション */
function CombinationsSection({ scenario }: { scenario: Scenario }) {
  if (!scenario.evidence_combinations || scenario.evidence_combinations.length === 0) {
    return (
      <Accordion title="証拠クロス参照" badge="なし">
        <p className="text-sm text-gray-500">このシナリオには証拠クロス参照がありません。</p>
      </Accordion>
    )
  }
  const critical = scenario.evidence_combinations.filter((c) => c.is_critical)
  return (
    <Accordion title="証拠クロス参照" badge={`${scenario.evidence_combinations.length}件`}>
      <p className="text-xs text-gray-600">
        決定的 {critical.length}件 / その他{' '}
        {scenario.evidence_combinations.length - critical.length}件
      </p>
      <div className="space-y-2">
        {scenario.evidence_combinations.map((combo) => (
          <div key={combo.id} className="rounded bg-gray-900 border border-gray-700 p-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-100 text-sm font-semibold">{combo.name}</span>
              {combo.is_critical && (
                <span className="rounded border border-yellow-700 bg-yellow-900 px-1.5 py-0.5 text-xs text-yellow-300">
                  決定的
                </span>
              )}
              <span className="text-gray-600 text-xs">({combo.id})</span>
            </div>
            <p className="text-gray-300 text-sm">{combo.description}</p>
            <div className="flex gap-2 text-sm flex-wrap">
              <span className="text-gray-500 text-xs">必要証拠:</span>
              {combo.evidence_ids.map((eid) => (
                <span
                  key={eid}
                  className="rounded bg-gray-700 border border-gray-600 px-2 py-0.5 text-xs text-amber-300"
                >
                  {resolveEvidenceName(eid, scenario.evidence)}{' '}
                  <span className="text-gray-500">({eid})</span>
                </span>
              ))}
            </div>
            {combo.refutation_text && (
              <p className="text-gray-400 text-xs italic border-t border-gray-700 pt-2">
                反駁: {combo.refutation_text}
              </p>
            )}
          </div>
        ))}
      </div>
    </Accordion>
  )
}

// ────────────────────────────────────────────────────────────
// メインコンポーネント
// ────────────────────────────────────────────────────────────

/** ScenarioDebug: シナリオデバッグタブのルートコンポーネント */
export function ScenarioDebug() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { scenario } = SCENARIO_LIST[selectedIndex]

  return (
    <div className="space-y-4">
      {/* シナリオセレクター */}
      <div className="flex gap-2 flex-wrap">
        {SCENARIO_LIST.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setSelectedIndex(i)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              selectedIndex === i
                ? 'bg-gray-700 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {item.label}: {item.scenario.title}
          </button>
        ))}
      </div>

      {/* シナリオ切り替え時にアコーディオンの開閉状態をリセットするためkeyを付与 */}
      <div key={selectedIndex} className="space-y-2">
        <OverviewSection scenario={scenario} />
        <RoomsSection scenario={scenario} />
        <SuspectsSection scenario={scenario} />
        <EvidenceSection scenario={scenario} />
        <CombinationsSection scenario={scenario} />
        <AccusationSection scenario={scenario} />
      </div>
    </div>
  )
}
