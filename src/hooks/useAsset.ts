// キャラクター・部屋・証拠のアセットパスを返すカスタムフック群
import {
  resolveCharacterAsset,
  resolveRoomAsset,
  resolveEvidenceAsset,
} from '../services/assetResolver'

export const useCharacterAsset = resolveCharacterAsset
export const useRoomAsset = resolveRoomAsset
export const useEvidenceAsset = resolveEvidenceAsset
