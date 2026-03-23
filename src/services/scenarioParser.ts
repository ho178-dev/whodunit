// AIが生成したシナリオJSONの構造・整合性をバリデーションするパーサー
import type { Scenario } from '../types/scenario'
import { MANSION_BACKGROUND_IDS } from '../constants/assetIds'
import {
  SUSPECT_COUNT,
  ROOM_COUNT,
  EVIDENCE_COUNT,
  FAKE_EVIDENCE_COUNT,
  STATEMENT_COUNT,
  SUSPECT_CONTRADICTION_COUNT,
  MURDERER_CONTRADICTION_COUNT,
} from '../constants/gameConfig'

// AIが生成したシナリオの構造・整合性をバリデーションしてScenario型を返す
export function validateScenario(data: unknown): Scenario {
  const s = data as Scenario

  if (!s.title || !s.synopsis || !s.setting) throw new Error('シナリオの基本情報が不正です')
  if (!s.murder_time_range) throw new Error('murder_time_rangeが設定されていません')
  if (!MANSION_BACKGROUND_IDS.includes(s.mansion_background_id))
    throw new Error(`mansion_background_idが不正です: ${s.mansion_background_id}`)
  if (!s.victim?.name) throw new Error('被害者情報が不正です')
  if (!s.murderer_id) throw new Error('犯人IDが設定されていません')
  if (!Array.isArray(s.suspects) || s.suspects.length !== SUSPECT_COUNT)
    throw new Error(`容疑者は${SUSPECT_COUNT}名必要です（現在: ${s.suspects?.length ?? 0}名）`)
  if (!Array.isArray(s.rooms) || s.rooms.length !== ROOM_COUNT)
    throw new Error(`部屋は${ROOM_COUNT}室必要です`)
  if (!Array.isArray(s.evidence) || s.evidence.length !== EVIDENCE_COUNT)
    throw new Error(`証拠は${EVIDENCE_COUNT}個必要です`)

  const fakeCount = s.evidence.filter((e) => e.is_fake).length
  if (fakeCount !== FAKE_EVIDENCE_COUNT) throw new Error(`偽証拠は${FAKE_EVIDENCE_COUNT}個必要です`)

  const murdererExists = s.suspects.some((sus) => sus.id === s.murderer_id)
  if (!murdererExists) throw new Error('murderer_idが容疑者リストに存在しません')

  const roomIds = new Set(s.rooms.map((r) => r.id))
  for (const suspect of s.suspects) {
    if (!suspect.room_id) throw new Error(`容疑者 ${suspect.id} にroom_idが設定されていません`)
    if (!roomIds.has(suspect.room_id))
      throw new Error(
        `容疑者 ${suspect.id} のroom_id "${suspect.room_id}" が部屋リストに存在しません`
      )
    if (!suspect.timeline) throw new Error(`容疑者 ${suspect.id} にtimelineが設定されていません`)
  }

  for (const evidence of s.evidence) {
    if (!evidence.examination_notes)
      throw new Error(`証拠 ${evidence.id} にexamination_notesが設定されていません`)
    if (evidence.is_fake && !evidence.first_impression)
      throw new Error(`偽証拠 ${evidence.id} にfirst_impressionが設定されていません`)
  }

  // 各容疑者の evidence_reactions における contradicts_statement_index の件数を検証する
  for (const suspect of s.suspects) {
    const contradictions = Object.values(suspect.evidence_reactions).filter(
      (r): r is typeof r & { contradicts_statement_index: number } =>
        r.contradicts_statement_index !== undefined
    )
    const expectedCount =
      suspect.id === s.murderer_id ? MURDERER_CONTRADICTION_COUNT : SUSPECT_CONTRADICTION_COUNT
    if (contradictions.length !== expectedCount) {
      throw new Error(
        `容疑者 ${suspect.id} の contradicts_statement_index は ${expectedCount} 件必要です（現在: ${contradictions.length} 件）`
      )
    }
    for (const r of contradictions) {
      if (r.contradicts_statement_index < 0 || r.contradicts_statement_index >= STATEMENT_COUNT) {
        throw new Error(
          `容疑者 ${suspect.id} の contradicts_statement_index が範囲外です（0〜${STATEMENT_COUNT - 1}）`
        )
      }
    }
  }

  const evidenceIds = new Set(s.evidence.map((e) => e.id))
  for (const room of s.rooms) {
    for (const eid of room.evidence_ids) {
      if (!evidenceIds.has(eid))
        throw new Error(`部屋 ${room.id} の証拠ID ${eid} が証拠リストに存在しません`)
    }
  }

  // evidence_combinations は省略可。存在する場合のみバリデーション
  if (s.evidence_combinations !== undefined) {
    if (!Array.isArray(s.evidence_combinations))
      throw new Error('evidence_combinationsは配列である必要があります')
    const suspectIds = new Set(s.suspects.map((sus) => sus.id))
    for (const combo of s.evidence_combinations) {
      if (!combo.id || !combo.name || !combo.description)
        throw new Error(`evidence_combination "${combo.id}" の必須フィールドが不正です`)
      if (
        !Array.isArray(combo.evidence_ids) ||
        combo.evidence_ids.length < 2 ||
        combo.evidence_ids.length > 3
      )
        throw new Error(`evidence_combination "${combo.id}" のevidence_idsは2〜3個必要です`)
      for (const eid of combo.evidence_ids) {
        if (!evidenceIds.has(eid))
          throw new Error(
            `evidence_combination "${combo.id}" の証拠ID "${eid}" が証拠リストに存在しません`
          )
      }
      // required_suspect_ids は省略可。存在する場合は各IDが容疑者リストに含まれることを確認
      if (combo.required_suspect_ids !== undefined) {
        if (!Array.isArray(combo.required_suspect_ids))
          throw new Error(
            `evidence_combination "${combo.id}" のrequired_suspect_idsは配列である必要があります`
          )
        for (const sid of combo.required_suspect_ids) {
          if (!suspectIds.has(sid))
            throw new Error(
              `evidence_combination "${combo.id}" の容疑者ID "${sid}" が容疑者リストに存在しません`
            )
        }
      }
    }
  }

  return s
}
