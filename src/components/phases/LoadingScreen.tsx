import { useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { generateScenario } from '../../services/geminiService'

export function LoadingScreen() {
  const { apiKey, setApiKey, setScenario, setPhase, setIsGenerating, setGenerationError, generationError } = useGameStore()

  useEffect(() => {
    if (!apiKey) return
    setIsGenerating(true)
    generateScenario(apiKey)
      .then((scenario) => {
        setScenario(scenario)
        setApiKey(null)  // 生成完了後はキーを保持しない
        setPhase('scenario_briefing')
      })
      .catch((err) => {
        setGenerationError(err.message || 'シナリオの生成に失敗しました')
      })
      .finally(() => setIsGenerating(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // 意図的にマウント時1回のみ実行

  if (generationError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-red-400 font-serif text-center max-w-md">
          <div className="text-2xl mb-2">⚠</div>
          <p>{generationError}</p>
        </div>
        <button
          onClick={() => { setGenerationError(null); setPhase('api_key_input') }}
          className="border border-gothic-border text-gothic-muted px-6 py-2 font-serif hover:border-gothic-accent transition-colors"
        >
          APIキーを再入力する
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-gothic-gold/30 border-t-gothic-gold rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-display text-gothic-gold tracking-widest text-lg">シナリオを生成中</p>
        <p className="text-gothic-muted font-serif text-sm mt-2">AIが謎を紡いでいます…</p>
      </div>
    </div>
  )
}
