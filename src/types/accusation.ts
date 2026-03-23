// 告発シーン（投票→結末間の対決演出）のデータ構造を型定義

// 犯人（正解）ルートの告発データ
export interface CorrectAccusationData {
  defense_statement: string // 犯人の最終弁明
  decisive_evidence_id: string // 決定的証拠のID
  wrong_evidence_reaction: string // 誤った証拠を選んだ時の犯人の反応
  refutation_text: string // プレイヤーが正しい証拠を突き付けた時のナレーション
  breakdown_statement: string // 犯人の動揺・告白
  escape_statement?: string // 証拠不足で逃げ切る時の犯人セリフ
}

// 無実（不正解）ルートの告発データ
export interface IncorrectAccusationData {
  confusion_statement: string // 無実の人物の困惑セリフ
  alibi_reveal: string // アリバイ・証拠不整合の説明ナレーション
}

// シナリオ全体の告発データ
export interface AccusationScenarioData {
  correct: CorrectAccusationData
  incorrect: Record<string, IncorrectAccusationData> // suspect_id → データ
}
