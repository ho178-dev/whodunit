// シナリオ生成中のローディング画面。Gemini APIを呼び出してシナリオを取得する
// プレイ可能性チェック付きリトライ（最大3回）に対応
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { generateScenario, validatePlayability } from '../../services/geminiService'

const MAX_RETRY = 3

export function LoadingScreen() {
  const {
    apiKey,
    setApiKey,
    setScenario,
    setPhase,
    setIsGenerating,
    setGenerationError,
    generationError,
  } = useGameStore()

  // リトライ回数と現在のステータス表示
  const [retryCount, setRetryCount] = useState(0)
  const [statusLabel, setStatusLabel] = useState('シナリオを生成中')
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!apiKey || hasStarted.current) return
    hasStarted.current = true

    const run = async (attempt: number) => {
      setIsGenerating(true)
      setStatusLabel('シナリオを生成中')
      try {
        const scenario = await generateScenario(apiKey)

        // プレイ可能性チェック
        setStatusLabel(`シナリオを検証中… (${attempt}/${MAX_RETRY})`)
        const { ok, failedChecks } = await validatePlayability(scenario, apiKey)

        if (ok) {
          setScenario(scenario)
          setApiKey(null) // 生成完了後はキーを保持しない
          setPhase('scenario_briefing')
          return
        }

        // NG の場合
        if (attempt < MAX_RETRY) {
          setRetryCount(attempt)
          setStatusLabel(`シナリオを再生成中… (${attempt + 1}/${MAX_RETRY})`)
          await run(attempt + 1)
        } else {
          // 3回すべてNGならエラー表示
          const detail = failedChecks.join(' / ')
          setGenerationError(
            `プレイ可能なシナリオを${MAX_RETRY}回生成しましたが、品質基準を満たしませんでした。\n詳細: ${detail}`
          )
        }
      } catch (err) {
        setGenerationError(err instanceof Error ? err.message : 'シナリオの生成に失敗しました')
      } finally {
        setIsGenerating(false)
      }
    }

    run(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 意図的にマウント時1回のみ実行

  if (generationError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-red-400 font-serif text-center max-w-md">
          <div className="text-2xl mb-2">⚠</div>
          <p className="whitespace-pre-line">{generationError}</p>
        </div>
        <button
          onClick={() => {
            setGenerationError(null)
            setPhase('api_key_input')
          }}
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
        <p className="font-display text-gothic-gold tracking-widest text-lg">{statusLabel}</p>
        {retryCount > 0 ? (
          <p className="text-gothic-muted font-serif text-sm mt-2">
            品質を確認して再生成しています…
          </p>
        ) : (
          <p className="text-gothic-muted font-serif text-sm mt-2">AIが謎を紡いでいます…</p>
        )}
      </div>
    </div>
  )
}
