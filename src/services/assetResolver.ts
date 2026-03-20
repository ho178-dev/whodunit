import type { CharacterAppearanceId, RoomTypeId, EvidenceCategoryId } from '../types/scenario'

export function resolveCharacterAsset(id: CharacterAppearanceId): string {
  return `/assets/characters/${id}.png`
}

export function resolveRoomAsset(id: RoomTypeId): string {
  return `/assets/rooms/${id}.png`
}

export function resolveEvidenceAsset(id: EvidenceCategoryId): string {
  return `/assets/evidence/${id}.png`
}
