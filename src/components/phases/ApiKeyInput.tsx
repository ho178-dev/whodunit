import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'

export function ApiKeyInput() {
  const [key, setKey] = useState('')
  const { setApiKey, setPhase } = useGameStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (key.trim()) {
      setApiKey(key.trim())
      setPhase('generating')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GothicPanel title="GEMINI API KEY" className="w-full max-w-md">
        <p className="text-gothic-muted font-serif text-sm mb-6">
          Google AI StudioのAPIキーを入力してください。キーはこのセッション中のみ使用され、保存されません。
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIza..."
            className="w-full bg-gothic-bg border border-gothic-border text-gothic-text font-serif px-4 py-3 focus:outline-none focus:border-gothic-gold"
          />
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full border border-gothic-gold bg-gothic-panel hover:bg-stone-800 disabled:opacity-40 text-gothic-gold font-display tracking-widest py-3 transition-all"
          >
            シナリオを生成する
          </button>
        </form>
        <button
          onClick={() => setPhase('title')}
          className="mt-4 w-full text-gothic-muted text-sm font-serif hover:text-gothic-text transition-colors"
        >
          ← 戻る
        </button>
      </GothicPanel>
    </div>
  )
}
