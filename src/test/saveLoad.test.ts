// saveLoad ユーティリティの正常系・異常系テスト
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveToSlot,
  loadFromSlot,
  getAllSlots,
  deleteSlot,
  SAVE_SLOT_COUNT,
} from '../utils/saveLoad'
import { SAVE_VERSION } from '../types/save'
import type { SaveInput } from '../types/save'

const makeDummyPayload = (title = 'テストシナリオ'): SaveInput => ({
  version: SAVE_VERSION,
  scenarioTitle: title,
  phase: 'investigation',
  difficulty: 'normal',
  currentRoomId: 'room_a',
  actionsRemaining: 5,
  talkActionsRemaining: 20,
  inspectedEvidenceIds: ['e1'],
  examinedEvidenceIds: [],
  discoveredCombinationIds: [],
  revealedFakeEvidenceIds: [],
  talkedSuspectIds: [],
  viewedSuspectProfileIds: [],
  heardStatements: [],
  confrontationLog: [],
  unlockedPursuitQuestions: [],
  askedPursuitQuestionIds: [],
  votedSuspectId: null,
  hypotheses: [],
  murdererEscaped: false,
})

describe('saveLoad ユーティリティ', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saveToSlot → loadFromSlot でデータを往復できる', () => {
    const input = makeDummyPayload()
    saveToSlot(0, input)
    const loaded = loadFromSlot(0)
    // savedAt は saveToSlot が自動付与するため、その他のフィールドで一致を確認する
    expect(loaded).not.toBeNull()
    expect(loaded?.scenarioTitle).toBe(input.scenarioTitle)
    expect(loaded?.phase).toBe(input.phase)
    expect(loaded?.version).toBe(input.version)
    expect(typeof loaded?.savedAt).toBe('number')
  })

  it('空スロットは null を返す', () => {
    expect(loadFromSlot(0)).toBeNull()
  })

  it('バージョン不一致のデータは null を返す', () => {
    const payload = { ...makeDummyPayload(), version: 999, savedAt: 0 }
    localStorage.setItem('whoDuNit_save_0', JSON.stringify(payload))
    expect(loadFromSlot(0)).toBeNull()
  })

  it('破損したJSONは null を返す', () => {
    localStorage.setItem('whoDuNit_save_1', 'not-json{{{')
    expect(loadFromSlot(1)).toBeNull()
  })

  it('getAllSlots は SAVE_SLOT_COUNT 枠を返す', () => {
    const slots = getAllSlots()
    expect(slots).toHaveLength(SAVE_SLOT_COUNT)
  })

  it('getAllSlots はデータのあるスロットを正しく返す', () => {
    const input = makeDummyPayload()
    saveToSlot(1, input)
    const slots = getAllSlots()
    expect(slots[0]).toBeNull()
    expect(slots[1]?.scenarioTitle).toBe(input.scenarioTitle)
    expect(slots[2]).toBeNull()
  })

  it('deleteSlot でスロットを削除できる', () => {
    saveToSlot(2, makeDummyPayload())
    expect(loadFromSlot(2)).not.toBeNull()
    deleteSlot(2)
    expect(loadFromSlot(2)).toBeNull()
  })

  it('localStorage が利用できない場合は例外をスローしない', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveToSlot(0, makeDummyPayload())).not.toThrow()
    vi.restoreAllMocks()
  })
})
