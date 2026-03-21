// シナリオデータ操作のユーティリティ関数
import type { Evidence } from '../types/scenario'

// 証拠IDリストを証拠名リストに変換する（IDが見つからない場合はIDをそのまま返す）
export function getEvidenceNames(evidenceIds: readonly string[], evidence: Evidence[]): string[] {
  return evidenceIds.map((eid) => evidence.find((e) => e.id === eid)?.name ?? eid)
}
