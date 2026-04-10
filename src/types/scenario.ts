// シナリオデータ全体の型定義（容疑者・部屋・証拠・シナリオ構造など）
import type { AccusationScenarioData } from './accusation'
export type MansionBackgroundId =
  | 'mansion_gothic'
  | 'mansion_japanese'
  | 'mansion_seaside'
  | 'mansion_forest'
  | 'mansion_snowy'
  | 'mansion_night'
  | 'mansion_ruins'

export type CharacterAppearanceId =
  | 'male_teen'
  | 'male_teen_alt'
  | 'male_young'
  | 'male_young_alt'
  | 'male_young_alt2'
  | 'male_young_alt3'
  | 'male_middle'
  | 'male_middle_alt'
  | 'male_middle_alt2'
  | 'male_middle_alt3'
  | 'male_elderly'
  | 'male_elderly_alt'
  | 'female_teen'
  | 'female_teen_alt'
  | 'female_young'
  | 'female_young_alt'
  | 'female_young_alt2'
  | 'female_young_alt3'
  | 'female_middle'
  | 'female_middle_alt'
  | 'female_middle_alt2'
  | 'female_middle_alt3'
  | 'female_elderly'
  | 'female_elderly_alt'

export type RoomTypeId =
  | 'study'
  | 'kitchen'
  | 'bedroom'
  | 'dining_room'
  | 'library'
  | 'garden'
  | 'hallway'
  | 'basement'
  | 'attic'
  | 'bathroom'

export type EvidenceCategoryId =
  | 'weapon_blade'
  | 'weapon_blunt'
  | 'weapon_firearm'
  | 'poison'
  | 'document_letter'
  | 'document_diary'
  | 'document_contract'
  | 'clothing'
  | 'jewelry'
  | 'key'
  | 'container'
  | 'photograph'
  | 'medicine'
  | 'food_drink'
  | 'tool'
  | 'fabric'
  | 'fingerprint'
  | 'blood_stain'

export type NpcBehavior = 'calm' | 'nervous' | 'angry' | 'sad' | 'evasive'

// 矛盾を突いた後にアンロックされる追及質問
export interface PursuitQuestion {
  id: string
  text: string // プレイヤーが投げる質問文
  response: string // 容疑者の返答
  behavior: NpcBehavior
  unlocks_pursuit_question_ids?: string[] // 回答後に連鎖解放するID（同じevidence_reaction内）
}

// 矛盾追及成功時に他のキャラクターが見せるリアクション
export interface BystanderReaction {
  suspectId: string
  text: string
}

// 複数証拠の組み合わせで解放される真相の断片
export interface EvidenceCombination {
  id: string
  evidence_ids: [string, string] | [string, string, string]
  name: string // 解放されるファクト名（例: "深夜の庭への侵入を示す推理"）
  description: string // ファクトの詳細説明（推理口調・人物名不使用）
  is_critical: boolean // true = 犯人特定に必須の決定的証拠
  accusation_reaction?: string // 省略可：告発フェーズでこの真相の断片を突きつけた時の容疑者反応
  refutation_text?: string // 省略可：告発フェーズでこの推理で正解に至った時のナレーション。未設定時はAccusationScenarioData.correct.refutation_textにフォールバック
}

export interface Suspect {
  id: string
  name: string
  appearance_id: CharacterAppearanceId
  age: number
  occupation: string
  description: string
  personality: string
  alibi: string
  secret: string
  relationship_to_victim: string
  room_id: string
  timeline: string
  timeline_has_contradiction: boolean
  investigation_dialog: {
    greeting: string
    statements: string[]
  }
  default_wrong_pursuit_response: string // 見当違いの証言で追及したときの汎用リアクション（容疑者ごと）
  confession_statement?: string // 正解エンディングで表示する犯人の独白セリフ（省略可）
  evidence_reactions: {
    [evidence_id: string]: {
      reaction: string
      behavior: NpcBehavior
      contradicts_statement_index?: number // この証拠が矛盾する statements[] のインデックス（0-4）
      pursuit_questions?: PursuitQuestion[] // 矛盾発覚後にアンロックされる追及質問チェーン
      wrong_testimony_response?: string // 誤った証言を選択したときの容疑者リアクション（設定があれば default より優先）
      bystander_reactions?: BystanderReaction[] // 矛盾追及成功時に他のキャラが見せるリアクション
    }
  }
}

export interface Room {
  id: string
  name: string
  type_id: RoomTypeId
  description: string
  evidence_ids: string[]
}

export interface Evidence {
  id: string
  name: string
  category_id: EvidenceCategoryId
  description: string
  is_fake: boolean
  relevance: string
  examination_notes: string
  first_impression?: string // 偽証拠専用：1段階目に見せる「本物っぽい」ミスリード説明
}

export interface Scenario {
  title: string
  synopsis: string
  setting: string
  murder_time_range: string
  mansion_background_id: MansionBackgroundId
  victim: {
    name: string
    appearance_id: CharacterAppearanceId
    description: string
    cause_of_death: string
  }
  murderer_id: string
  motive: string
  truth: string
  main_reasoning_path?: string // プレイヤーが辿るべき主要な推理導線（エンディング真相に表示）
  suspects: Suspect[]
  rooms: Room[]
  evidence: Evidence[]
  evidence_combinations?: EvidenceCombination[] // 証拠クロス参照システム（省略可）
  accusation_data?: AccusationScenarioData // 告発シーン用データ（省略時はスキップ）
}
