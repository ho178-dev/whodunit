// AIが生成したシナリオJSONの構造・整合性をバリデーションするパーサー
import type { Scenario } from '../types/scenario'
import { MANSION_BACKGROUND_IDS } from '../constants/assetIds'
import {
  SUSPECT_COUNT,
  ROOM_COUNT,
  EVIDENCE_COUNT,
  FAKE_EVIDENCE_COUNT,
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
  }

  const evidenceIds = new Set(s.evidence.map((e) => e.id))
  for (const room of s.rooms) {
    for (const eid of room.evidence_ids) {
      if (!evidenceIds.has(eid))
        throw new Error(`部屋 ${room.id} の証拠ID ${eid} が証拠リストに存在しません`)
    }
  }

  return s
}
