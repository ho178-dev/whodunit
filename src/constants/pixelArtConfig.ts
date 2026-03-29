// ドット絵表現に関する設定値。pixelSize を変えるほどドット感が強くなる

export const PIXEL_ART_CONFIG = {
  // 各コンテキストのドットサイズ（px）
  pixelSize: {
    room: 2, // 部屋背景
    mansion: 3, // 館背景（シナリオブリーフィング）
    character: 3, // キャラクター（portrait表示で全シーン共通）
    evidence: 5, // 証拠カード（通常）
    evidenceCompact: 3, // 証拠カード（コンパクト）
  },

  // 各コンテキストのCanvas内部解像度（実際の画像サイズに合わせる）
  canvasSize: {
    character: { width: 832, height: 1216 },
    evidence: { width: 1024, height: 1024 },
    room: { width: 1216, height: 684 },
    mansion: { width: 1216, height: 684 },
  },
} as const

// ゴシックテーマの7色パレット（RGB）
// 色の追加・変更はここだけで全画像に反映される
export const GOTHIC_PALETTE: readonly [number, number, number][] = [
  [12, 10, 9], // gothic-bg      #0c0a09
  [28, 25, 23], // gothic-panel   #1c1917
  [68, 64, 60], // gothic-border  #44403c
  [180, 83, 9], // gothic-accent  #b45309
  [217, 119, 6], // gothic-gold    #d97706
  [254, 243, 199], // gothic-text    #fef3c7
  [168, 162, 158], // gothic-muted   #a8a29e
]

// 任意のRGB色をパレット最近傍色にマッピングする
// 人間の視覚特性に合わせてG成分を重く重み付けした距離を使用
export function mapToGothicPalette(r: number, g: number, b: number): [number, number, number] {
  let minDist = Infinity
  let nearest = GOTHIC_PALETTE[0]
  for (const color of GOTHIC_PALETTE) {
    const dr = r - color[0]
    const dg = g - color[1]
    const db = b - color[2]
    const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db
    if (dist < minDist) {
      minDist = dist
      nearest = color
    }
  }
  return nearest
}
