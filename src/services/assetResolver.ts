import type {
  CharacterAppearanceId,
  RoomTypeId,
  EvidenceCategoryId,
  MansionBackgroundId,
} from '../types/scenario'

export function resolveCharacterAsset(id: CharacterAppearanceId): string {
  return `/assets/characters/${id}.png`
}

export function resolveRoomAsset(id: RoomTypeId): string {
  return `/assets/rooms/${id}.png`
}

export function resolveEvidenceAsset(id: EvidenceCategoryId): string {
  return `/assets/evidence/${id}.png`
}

export function resolveMansionAsset(id: MansionBackgroundId): string {
  return `/assets/mansion/${id}.png`
}

export const MANSION_DEFAULT_ASSET = '/assets/mansion/default.png'
