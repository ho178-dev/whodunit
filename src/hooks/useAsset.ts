// キャラクター・部屋・証拠のアセットパスを返すカスタムフック群
import type { CharacterAppearanceId, RoomTypeId, EvidenceCategoryId } from '../types/scenario'

// キャラクターアセットのURLを返すフック
export function useCharacterAsset(id: CharacterAppearanceId): string {
  return `/assets/characters/${id}.png`
}

// 部屋アセットのURLを返すフック
export function useRoomAsset(id: RoomTypeId): string {
  return `/assets/rooms/${id}.png`
}

// 証拠アセットのURLを返すフック
export function useEvidenceAsset(id: EvidenceCategoryId): string {
  return `/assets/evidence/${id}.png`
}
