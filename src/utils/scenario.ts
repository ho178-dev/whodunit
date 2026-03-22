// シナリオデータ操作のユーティリティ関数
import type { Evidence } from '../types/scenario'

// 証拠IDリストを証拠名リストに変換する（IDが見つからない場合はIDをそのまま返す）
export function getEvidenceNames(evidenceIds: readonly string[], evidence: Evidence[]): string[] {
  return evidenceIds.map((eid) => evidence.find((e) => e.id === eid)?.name ?? eid)
}

// 調査1段階目に表示する証拠の説明文を返す（偽証拠は first_impression を優先）
export function getInspectionDescription(evidence: Evidence): string {
  return evidence.first_impression ?? evidence.description
}
