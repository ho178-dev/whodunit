// Vite の BASE_URL を使い、Electron（file://）とブラウザ両方で動作するアセットパスを返す
// - ブラウザ dev server: BASE_URL = '/'  → /assets/...（変化なし）
// - Electron exe build: BASE_URL = './' → ./assets/...（file:// で解決可能）
export function assetUrl(absolutePath: string): string {
  return `${import.meta.env.BASE_URL}${absolutePath.slice(1)}`
}
