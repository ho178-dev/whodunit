// アプリのルートコンポーネント。GameShellをレンダリングする
// 開発環境で ?debug=true を付けるとデバッグページを表示する
import { GameShell } from './components/layout/GameShell'
import { DebugPage } from './components/debug/DebugPage'

const isDebug =
  import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === 'true'

function App() {
  if (isDebug) return <DebugPage />
  return <GameShell />
}

export default App
