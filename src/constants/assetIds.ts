import type {
  CharacterAppearanceId,
  RoomTypeId,
  EvidenceCategoryId,
  MansionBackgroundId,
} from '../types/scenario'

export const MANSION_BACKGROUND_IDS: MansionBackgroundId[] = [
  'mansion_gothic',
  'mansion_japanese',
  'mansion_seaside',
  'mansion_forest',
  'mansion_snowy',
  'mansion_night',
  'mansion_ruins',
]

export const CHARACTER_APPEARANCE_IDS: CharacterAppearanceId[] = [
  'male_teen',
  'male_young',
  'male_young_alt',
  'male_middle',
  'male_middle_alt',
  'male_elderly',
  'female_teen',
  'female_young',
  'female_young_alt',
  'female_middle',
  'female_middle_alt',
  'female_elderly',
]

export const ROOM_TYPE_IDS: RoomTypeId[] = [
  'study',
  'kitchen',
  'bedroom',
  'dining_room',
  'library',
  'garden',
  'hallway',
  'basement',
  'attic',
  'bathroom',
]

export const EVIDENCE_CATEGORY_IDS: EvidenceCategoryId[] = [
  'weapon_blade',
  'weapon_blunt',
  'weapon_firearm',
  'poison',
  'document_letter',
  'document_diary',
  'document_contract',
  'clothing',
  'jewelry',
  'key',
  'container',
  'photograph',
  'medicine',
  'food_drink',
  'tool',
  'fabric',
  'fingerprint',
  'blood_stain',
]
