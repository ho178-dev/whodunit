// 固定シナリオのタイトル→Scenarioオブジェクトのマッピング（セーブ/ロード時のシナリオ復元に使用）
import { FIXED_SCENARIO } from '../constants/fixedScenario'
import { FIXED_SCENARIO_2 } from '../constants/fixedScenario2'
import { FIXED_SCENARIO_3 } from '../constants/fixedScenario3'
import type { Scenario } from '../types/scenario'

const REGISTRY = new Map<string, Scenario>([
  [FIXED_SCENARIO.title, FIXED_SCENARIO],
  [FIXED_SCENARIO_2.title, FIXED_SCENARIO_2],
  ['霧の密室', FIXED_SCENARIO_2], // タイトル変更前の旧キーとの後方互換エイリアス
  [FIXED_SCENARIO_3.title, FIXED_SCENARIO_3],
])

// 正規タイトル一覧（エイリアスを含まない）
const CANONICAL_TITLES = [FIXED_SCENARIO.title, FIXED_SCENARIO_2.title, FIXED_SCENARIO_3.title]

/** シナリオタイトルから固定シナリオを引く。存在しない場合は null を返す */
export function getFixedScenarioByTitle(title: string): Scenario | null {
  return REGISTRY.get(title) ?? null
}

/** 登録済みの固定シナリオタイトル一覧を返す（エイリアスを除く） */
export function getAllFixedScenarioTitles(): string[] {
  return CANONICAL_TITLES
}
