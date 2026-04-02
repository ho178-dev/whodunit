// アセットIDからファイルパスへの解決関数
import type {
  CharacterAppearanceId,
  RoomTypeId,
  EvidenceCategoryId,
  MansionBackgroundId,
} from '../types/scenario'
import { assetUrl } from '../utils/assetUrl'

// キャラクターアセットのファイルパスを返す
export function resolveCharacterAsset(id: CharacterAppearanceId): string {
  return assetUrl(`/assets/characters/${id}.png`)
}

// 部屋アセットのファイルパスを返す
export function resolveRoomAsset(id: RoomTypeId): string {
  return assetUrl(`/assets/rooms/${id}.png`)
}

// 証拠アセットのファイルパスを返す
export function resolveEvidenceAsset(id: EvidenceCategoryId): string {
  return assetUrl(`/assets/evidence/${id}.png`)
}

// 館背景アセットのファイルパスを返す
export function resolveMansionAsset(id: MansionBackgroundId): string {
  return assetUrl(`/assets/mansion/${id}.png`)
}

export const MANSION_DEFAULT_ASSET = assetUrl('/assets/mansion/default_mansion.png')
