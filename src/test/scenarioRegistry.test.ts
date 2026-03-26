// scenarioRegistry ユーティリティのテスト
import { describe, it, expect } from 'vitest'
import { getFixedScenarioByTitle, getAllFixedScenarioTitles } from '../utils/scenarioRegistry'
import { FIXED_SCENARIO } from '../constants/fixedScenario'
import { FIXED_SCENARIO_2 } from '../constants/fixedScenario2'
import { FIXED_SCENARIO_3 } from '../constants/fixedScenario3'

describe('scenarioRegistry', () => {
  it('3本の固定シナリオをタイトルで引ける', () => {
    expect(getFixedScenarioByTitle(FIXED_SCENARIO.title)).toBe(FIXED_SCENARIO)
    expect(getFixedScenarioByTitle(FIXED_SCENARIO_2.title)).toBe(FIXED_SCENARIO_2)
    expect(getFixedScenarioByTitle(FIXED_SCENARIO_3.title)).toBe(FIXED_SCENARIO_3)
  })

  it('存在しないタイトルは null を返す', () => {
    expect(getFixedScenarioByTitle('存在しないシナリオ')).toBeNull()
  })

  it('旧タイトル「霧の密室」エイリアスで白銀の密室を引ける', () => {
    expect(getFixedScenarioByTitle('霧の密室')).toBe(FIXED_SCENARIO_2)
  })

  it('getAllFixedScenarioTitles は3本分のタイトルを返す', () => {
    const titles = getAllFixedScenarioTitles()
    expect(titles).toHaveLength(3)
    expect(titles).toContain(FIXED_SCENARIO.title)
    expect(titles).toContain(FIXED_SCENARIO_2.title)
    expect(titles).toContain(FIXED_SCENARIO_3.title)
  })
})
