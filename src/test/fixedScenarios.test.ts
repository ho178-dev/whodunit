// 固定シナリオ3本の論理整合性を validateScenario で検証するテスト
import { describe, it, expect } from 'vitest'
import { validateScenario } from '../services/scenarioParser'
import { FIXED_SCENARIO } from '../constants/fixedScenario'
import { FIXED_SCENARIO_2 } from '../constants/fixedScenario2'
import { FIXED_SCENARIO_3 } from '../constants/fixedScenario3'

describe('固定シナリオ論理整合性チェック', () => {
  it('fixedScenario (黄昏の晩餐会) が validateScenario を通過する', () => {
    expect(() => validateScenario(FIXED_SCENARIO)).not.toThrow()
  })

  it('fixedScenario2 (白銀の密室) が validateScenario を通過する', () => {
    expect(() => validateScenario(FIXED_SCENARIO_2)).not.toThrow()
  })

  it('fixedScenario3 (月光の審判) が validateScenario を通過する', () => {
    expect(() => validateScenario(FIXED_SCENARIO_3)).not.toThrow()
  })
})
