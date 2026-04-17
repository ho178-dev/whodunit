// Playwright E2E テスト: ゲームフロー クリティカルパス
// 対象: タイトル画面の表示確認、完勝・誤謬エンディングのUIレンダリング確認
import { test, expect } from '@playwright/test'

// ウィンドウにストアが公開されるまで待機するヘルパー
async function waitForStore(page: Parameters<typeof test>[1]['page']) {
  await page.waitForFunction(
    () =>
      !!(window as unknown as Record<string, unknown>).__gameStore &&
      !!(window as unknown as Record<string, unknown>).__settingsStore &&
      !!(window as unknown as Record<string, unknown>).__scenarioRegistry
  )
}

// エンディングフェーズへ遷移するためのセットアップ
async function gotoEndingPhase(
  page: Parameters<typeof test>[1]['page'],
  scenarioTitle: string,
  options: { correct: boolean }
) {
  await page.evaluate(
    ({ scenarioTitle, correct }) => {
      const w = window as unknown as Record<string, { getState: () => Record<string, unknown> }>
      const gameStore = w.__gameStore.getState() as {
        startScenario: (s: unknown) => void
        setVotedSuspectId: (id: string) => void
        setMurdererEscaped: (v: boolean) => void
        setPhase: (p: string) => void
      }
      const settingsStore = w.__settingsStore.getState() as {
        setSkipInterlude: (v: boolean) => void
      }
      const registry = w.__scenarioRegistry as {
        getFixedScenarioByTitle: (t: string) => {
          murderer_id: string
          suspects: Array<{ id: string }>
        }
      }

      // FadeTransition の幕間演出をスキップして即時表示させる
      settingsStore.setSkipInterlude(true)

      const scenario = registry.getFixedScenarioByTitle(scenarioTitle)
      gameStore.startScenario(scenario)

      if (correct) {
        gameStore.setVotedSuspectId(scenario.murderer_id)
      } else {
        const wrongSuspect = scenario.suspects.find((s) => s.id !== scenario.murderer_id)!
        gameStore.setVotedSuspectId(wrongSuspect.id)
      }
      gameStore.setMurdererEscaped(false)
      gameStore.setPhase('ending')
    },
    { scenarioTitle, correct: options.correct }
  )
}

// 独白・敗北ダイアログのステップをクリックスルーして結果ヘッダーを表示させるヘルパー
// EndingScreen は告白→エピローグ→結果 or 敗北ダイアログ→結果 の順に進む
async function advanceToResultScreen(page: Parameters<typeof test>[1]['page']) {
  // 「次へ」「真相を見る」「結末を見る」ボタンが見えなくなるまでクリックを繰り返す
  const advanceButtonPattern = /次へ|真相を見る|結末を見る/
  for (let i = 0; i < 10; i++) {
    const btn = page.getByRole('button', { name: advanceButtonPattern })
    if (!(await btn.isVisible())) break
    await btn.click()
    await btn.waitFor({ state: 'hidden' })
  }
}

// ── スモークテスト ────────────────────────────────────────────────

test('タイトル画面が正常に表示される', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'WhoDuNiT' })).toBeVisible()
  await expect(page.getByText('シナリオを選ぶ')).toBeVisible()
})

// ── エンディング UIレンダリング確認 ─────────────────────────────────

test('完勝エンド: 正解犯人告発 → ダイアログ進行後に "真実" が表示される', async ({ page }) => {
  await page.goto('/')
  await waitForStore(page)
  await gotoEndingPhase(page, '黄昏の晩餐会', { correct: true })

  // 告白ダイアログが表示されることを確認してからクリックスルー
  await expect(page.getByRole('button', { name: /次へ|真相を見る/ })).toBeVisible({
    timeout: 5000,
  })
  await advanceToResultScreen(page)

  // 結果ヘッダーの確認
  await expect(page.getByText('真実')).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('── 謎は解けた')).toBeVisible()
})

// ── 進行不能バグ防止テスト ──────────────────────────────────────────

test('捜査AP枯渇時に「議論へ進む」ボタンが表示される（ソフトロック防止）', async ({ page }) => {
  await page.goto('/')
  await waitForStore(page)

  await page.evaluate(() => {
    const w = window as unknown as Record<string, { getState: () => Record<string, unknown> }>
    const gameStore = w.__gameStore.getState() as {
      startScenario: (s: unknown) => void
      setPhase: (p: string) => void
    }
    const settingsStore = w.__settingsStore.getState() as {
      setSkipInterlude: (v: boolean) => void
    }
    const scenario = (
      w.__scenarioRegistry as { getFixedScenarioByTitle: (t: string) => unknown }
    ).getFixedScenarioByTitle('黄昏の晩餐会')

    settingsStore.setSkipInterlude(true)
    gameStore.startScenario(scenario)
    // AP=0 で捜査フェーズへ: canProceed = actionsRemaining === 0 → true
    ;(w.__gameStore as unknown as { setState: (s: Record<string, unknown>) => void }).setState({
      actionsRemaining: 0,
      talkActionsRemaining: 0,
    })
    gameStore.setPhase('investigation')
  })

  // canProceed=true → 「議論へ進む」ボタンが出現していること
  const proceedBtn = page.getByRole('button', { name: '議論へ進む' })
  await expect(proceedBtn).toBeVisible({ timeout: 3000 })

  // クリックして議論フェーズへ遷移できること
  await proceedBtn.click()
  // 議論フェーズでは「告発へ進む」ボタンが常時表示される
  await expect(page.getByRole('button', { name: '告発へ進む' })).toBeVisible({ timeout: 3000 })
})

test('誤謬エンド: 不正解容疑者告発 → ダイアログ進行後に "敗北" が表示される', async ({ page }) => {
  await page.goto('/')
  await waitForStore(page)
  await gotoEndingPhase(page, '黄昏の晩餐会', { correct: false })

  // 敗北ダイアログが表示されることを確認してからクリックスルー
  await expect(page.getByRole('button', { name: /次へ|結末を見る/ })).toBeVisible({
    timeout: 5000,
  })
  await advanceToResultScreen(page)

  // 結果ヘッダーの確認
  await expect(page.getByText('敗北')).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('── 真相は闇の中に消えた')).toBeVisible()
})
