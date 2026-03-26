// 販売設定定数。Booth URL・体験版判定・予告画面用シナリオ情報を集約管理する

/** Booth販売ページURL。確定後にここを差し替える */
export const BOOTH_URL = 'https://booth.pm/ja/items/PLACEHOLDER'

/** 体験版ビルドか判定する（VITE_TRIAL_MODE環境変数で制御） */
export function isTrialMode(): boolean {
  return import.meta.env.VITE_TRIAL_MODE === 'true'
}

interface TrialPreviewScenario {
  title: string
  setting: string
  teaser: string
}

// 体験版予告画面に表示するシナリオ2・3の情報
export const TRIAL_PREVIEW_SCENARIOS: TrialPreviewScenario[] = [
  {
    title: '白銀の密室',
    setting: '雪深い北アルプスの山荘。親族会議の夜、会長が密室で絞殺された。',
    teaser: '扉は内側から施錠されていた。犯人はどこへ消えたのか。',
  },
  {
    title: '月光の審判',
    setting: '奥多摩の山奥、年に一度の「月の夜の儀式」。翌朝、参加者が変死体で発見された。',
    teaser: '胸には深い爪痕と咬傷。人狼は、まだここにいる。',
  },
]
