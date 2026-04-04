// アプリのルートコンポーネント。GameShellをレンダリングする
// dev ビルドで ?debug=true を付けるとデバッグページを表示する
import { GameShell } from './components/layout/GameShell'
import { DebugPage } from './components/debug/DebugPage'
import { isDevBuild } from './constants/salesConfig'

// exe dev ビルド・ブラウザ開発サーバーいずれでも有効になるよう isDevBuild() を使用する
const isDebug = isDevBuild() && new URLSearchParams(window.location.search).get('debug') === 'true'

function App() {
  if (isDebug) return <DebugPage />
  return <GameShell />
}

export default App
