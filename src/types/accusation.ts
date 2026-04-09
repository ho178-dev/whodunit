// 告発シーン（投票→結末間の対決演出）のデータ構造を型定義

// 犯人（正解）ルートの告発データ
export interface CorrectAccusationData {
  defense_statement: string // 犯人の最終弁明
  evidence_rebuttal: string // Step2: 証拠提示後の反論「それが何だと言うんだ」
  wrong_link_rebuttal: string // Step4: 証拠と推理が紐づかない時の反論
  refutation_text: string // 汎用フォールバック：combo個別のrefutation_textが未設定の場合に使用
  breakdown_statement: string // 犯人の動揺・独白
  epilogue_text?: string // 正解エンディングの地の文（ナレーション）。独白後に表示するカタルシス演出（省略可）
  escape_statement?: string // 証拠不足で逃げ切る時の犯人セリフ（省略可）
  near_defeat_evidence_text: string // 証拠不足型惜敗エンドのナレーション
}

// 無実（不正解）ルートの告発データ
export interface IncorrectAccusationData {
  defense_statement: string // 誤告発された容疑者の弁明
  evidence_rebuttal: string // Step2: 証拠提示後の反論
  wrong_link_rebuttal: string // Step4: 証拠と推理が紐づかない時の反論
}

// シナリオ全体の告発データ
export interface AccusationScenarioData {
  correct: CorrectAccusationData
  incorrect: Record<string, IncorrectAccusationData> // suspect_id → データ
  near_defeat_wrong_suspect_text: string // 誤告発型惜敗エンドのナレーション
}
