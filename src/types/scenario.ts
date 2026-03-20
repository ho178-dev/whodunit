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
  | 'male_young'
  | 'male_young_alt'
  | 'male_middle'
  | 'male_middle_alt'
  | 'male_elderly'
  | 'female_teen'
  | 'female_young'
  | 'female_young_alt'
  | 'female_middle'
  | 'female_middle_alt'
  | 'female_elderly'

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
  investigation_dialog: {
    greeting: string
    statements: string[]
  }
  evidence_reactions: {
    [evidence_id: string]: {
      reaction: string
      behavior: NpcBehavior
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
}

export interface Scenario {
  title: string
  synopsis: string
  setting: string
  murder_time_range: string
  mansion_background_id: MansionBackgroundId
  detective: {
    name: string
    description: string
  }
  victim: {
    name: string
    appearance_id: CharacterAppearanceId
    description: string
    cause_of_death: string
  }
  murderer_id: string
  motive: string
  truth: string
  suspects: Suspect[]
  rooms: Room[]
  evidence: Evidence[]
}
