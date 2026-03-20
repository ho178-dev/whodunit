import type { CharacterAppearanceId, RoomTypeId, EvidenceCategoryId } from '../types/scenario'

export function useCharacterAsset(id: CharacterAppearanceId): string {
  return `/assets/characters/${id}.png`
}

export function useRoomAsset(id: RoomTypeId): string {
  return `/assets/rooms/${id}.png`
}

export function useEvidenceAsset(id: EvidenceCategoryId): string {
  return `/assets/evidence/${id}.png`
}
