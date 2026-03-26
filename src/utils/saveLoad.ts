// セーブ/ロードの永続化I/O層（localStorage実装）。Tauri移行時はこのファイルの実装だけ差し替える
import type { SaveSlot, SavePayload, SaveInput } from '../types/save'
import { SAVE_VERSION } from '../types/save'

/** スロット総数：0番 = オートセーブ専用、1〜3番 = 手動セーブ */
export const SAVE_SLOT_COUNT = 4

// スロット番号から localStorage キーを生成する
const storageKey = (slotIndex: number) => `whoDuNit_save_${slotIndex}`

/** 指定スロットにセーブデータを書き込む。savedAt はこの関数が現在時刻で自動付与する */
export function saveToSlot(slotIndex: number, input: SaveInput): void {
  try {
    localStorage.setItem(storageKey(slotIndex), JSON.stringify({ ...input, savedAt: Date.now() }))
  } catch {
    /* localStorage 使用不可 / 容量超過は無視 */
  }
}

/** 指定スロットからセーブデータを読み込む。空・破損・バージョン不一致は null を返す */
export function loadFromSlot(slotIndex: number): SaveSlot {
  try {
    const raw = localStorage.getItem(storageKey(slotIndex))
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavePayload
    if (parsed.version !== SAVE_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

/** 全スロット（SAVE_SLOT_COUNT 枠）を一括取得する。空スロットは null */
export function getAllSlots(): SaveSlot[] {
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => loadFromSlot(i))
}

/** 手動セーブスロット（1〜3番）のみを取得する */
export function getManualSlots(): SaveSlot[] {
  return getAllSlots().slice(1)
}

/** 指定スロットのセーブデータを削除する */
export function deleteSlot(slotIndex: number): void {
  try {
    localStorage.removeItem(storageKey(slotIndex))
  } catch {
    /* 無視 */
  }
}
