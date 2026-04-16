// チュートリアルフェーズ：遊び方を全画面で説明するコンポーネント。左ナビ+右コンテンツの2カラムレイアウト
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { assetUrl } from '../../utils/assetUrl'
import { cn } from '../../utils/cn'

// 各ステップの本文セクション構造
interface StepSection {
  heading?: string
  text?: string
  items?: string[]
  note?: string
}

// チュートリアルステップの定義
interface TutorialStep {
  navTitle: string
  title: string
  image?: string
  sections: StepSection[]
}

// 8ステップのチュートリアル内容
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    navTitle: 'あなたの役割',
    title: 'あなたの役割',
    sections: [
      {
        text: 'あなたはこの事件を解決するために招かれた探偵です。館に集まった人々から話を聞き、証拠を集め、真犯人を見つけ出してください。',
      },
      {
        heading: 'ゲームの目的',
        items: [
          '証拠と証言を集めて真犯人を特定する',
          '議論フェーズで矛盾を追及し、犯人を追い詰める',
          '告発フェーズで犯人を告発して事件を解決する',
        ],
      },
      {
        note: 'このチュートリアルの最後に「練習シナリオ」があります。実際に操作しながらゲームの流れを体験できます。',
      },
    ],
  },
  {
    navTitle: 'ゲームの流れ',
    title: 'ゲームの流れ',
    sections: [
      {
        text: 'このゲームは3つのフェーズで進みます。各フェーズを順番にクリアして事件を解決しましょう。',
      },
      {
        heading: '① 捜査フェーズ',
        text: '各部屋を訪れて証拠を収集し、容疑者たちに話を聞きます。アクションポイントを消費しながら情報を集めましょう。',
      },
      {
        heading: '② 議論フェーズ',
        text: '集めた証拠を容疑者に突きつけて反応を確認します。矛盾した反応を示す容疑者を徹底的に追及しましょう。',
      },
      {
        heading: '③ 告発フェーズ',
        text: '犯人だと思う人物を告発します。動機・機会・手段を総合して判断しましょう。',
      },
    ],
  },
  {
    navTitle: 'アクションポイント',
    title: 'アクションポイントの使い方',
    sections: [
      {
        text: '捜査フェーズでは2種類のポイントを消費します。上手に配分して情報を集めましょう。',
      },
      {
        heading: '調査ポイント（15）',
        items: [
          '証拠の外観確認 → 1ポイント消費',
          '証拠の精密検査 → 1ポイント消費',
          '調査ポイントを使い切ると議論フェーズへ進む',
        ],
      },
      {
        heading: '会話ポイント（30）',
        items: [
          '容疑者に新しい証言を聞くたびに1ポイント消費',
          '一度話した容疑者には何度でも無料で再び話せる',
        ],
      },
      {
        note: '重要な証拠を先に調査し、怪しい容疑者の証言を優先して集めましょう。',
      },
    ],
  },
  {
    navTitle: '証拠の調査',
    title: '証拠の調査方法',
    sections: [
      {
        text: '証拠の調査は2段階あります。精密検査まで行うことで、犯人特定に重要な情報が得られます。',
      },
      {
        heading: '第1段階：外観確認（1AP消費）',
        text: '証拠の外見・概要が判明します。事件との関係性の概要がわかります。',
      },
      {
        heading: '第2段階：精密検査（1AP消費）',
        text: 'より詳細な情報が明らかになります。証拠が示す論理的な示唆が記されており、他の証拠や証言との繋がりが見えてきます。',
      },
      {
        heading: '証拠の組み合わせ',
        text: '捜査メモ画面で複数の証拠を選択し「検討する」ことで、証拠間の新たな関連性を発見できます。重要な組み合わせは犯人特定の決定的な手がかりになります。',
      },
      {
        note: '組み合わせには証拠品が3つ必要な場合もあります。慎重に調査しましょう。',
      },
    ],
  },
  {
    navTitle: '推理メモ（重要）',
    title: '推理メモの使い方（重要）',
    sections: [
      {
        text: '推理メモ画面では、各容疑者の仮説を記録したり、証拠を組み合わせたりできます。犯人特定に欠かせない機能です。',
      },
      {
        heading: '容疑者ごとの仮説メモ',
        items: [
          '動機：なぜ殺したのか（恨み・金銭・脅迫など）',
          '機会：事件当時、犯行場所にいられたか（アリバイの裏取り）',
          '手段：凶器・毒などを入手・使用できたか',
          '自由メモ：気になる点を自由に記録できる',
        ],
      },
      {
        heading: '証拠の組み合わせ',
        text: '捜査メモ画面から複数の証拠を選んで組み合わせてみましょう。証拠間の論理的な繋がりが発見されると、新たな真相の断片が明らかになります。',
      },
      {
        note: '動機・機会・手段の3つが揃った容疑者が犯人候補です。推理メモを活用して整理しましょう。',
      },
    ],
  },
  {
    navTitle: '議論フェーズ',
    title: '議論フェーズで証拠を突きつける',
    sections: [
      {
        text: '議論フェーズでは、捜査で集めた証拠を容疑者に突きつけることができます。',
      },
      {
        heading: '証拠の突きつけ（6回まで）',
        items: [
          '容疑者を選んで証拠を提示する',
          '犯人は核心を突く証拠に不自然な反応を示す（動揺・怒り・言い逃れなど）',
          '無実の容疑者は落ち着いて証拠を否定する',
        ],
      },
      {
        heading: '矛盾の追及',
        text: '証言と矛盾する証拠を突きつけると「追及質問」が解放されます。追及質問で容疑者をさらに問い詰めると、連鎖的に新たな質問が解放されることがあります。',
      },
      {
        note: '全員に全証拠を試す必要はありません。怪しい容疑者に重要な証拠を集中して突きつけましょう。',
      },
    ],
  },
  {
    navTitle: '告発と解決',
    title: '告発と解決',
    sections: [
      {
        text: '調査と議論が終わったら、いよいよ犯人を告発します。動機・機会・手段の3つを揃えて確信を持って告発しましょう。',
      },
      {
        heading: '犯人の特定方法',
        items: [
          '動機：事件を起こす理由があるか（恨み・金銭・脅迫など）',
          '機会：事件当時、犯行現場にいられたか（アリバイが破綻していないか）',
          '手段：凶器・毒などを入手または使用できたか',
        ],
      },
      {
        heading: '告発',
        text: '容疑者の中から犯人と思う一人に告発します。正解すれば事件解決——犯人が自白します。不正解でも真相が明かされます。',
      },
      {
        note: '証拠不足でも告発は可能です。集めた手がかりを総合して推理し、自信を持って告発しましょう。',
      },
    ],
  },
  {
    navTitle: '練習シナリオ',
    title: '練習シナリオで体験しよう',
    sections: [
      {
        text: 'チュートリアルの最後に、実際に操作できる練習シナリオを用意しました。ゲームの一連の流れを短時間で体験できます。',
      },
      {
        heading: '練習シナリオ「書斎の夕暮れ」',
        items: [
          '容疑者2名・証拠3つ・部屋1室の小規模シナリオ',
          'ゲームの全フェーズ（捜査→議論→告発）を体験できる',
          'どの証拠を突きつけても反応を確認できる',
          '推理は一本道で、手がかりが揃えば自然に犯人を特定できる',
        ],
      },
      {
        note: '練習シナリオを通じて操作に慣れてから、本編のシナリオに挑戦することをおすすめします。',
      },
    ],
  },
]

// ゴシック館背景（チュートリアル専用固定）
const MANSION_BG = assetUrl('/assets/mansion/mansion_gothic.png')

// チュートリアルフェーズのルートコンポーネント
export function TutorialPhase() {
  const { setPhase, startTutorialScenario } = useGameStore()
  const [currentStep, setCurrentStep] = useState(0)
  const step = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  return (
    <div className="relative h-full">
      <MansionSceneBackground phase="tutorial" fixed mansionBackgroundSrc={MANSION_BG} />

      <div className="relative z-10 h-full flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center px-4 border-b border-gothic-border/50 bg-gothic-panel/70 backdrop-blur-sm flex-shrink-0 h-12">
          <button
            onClick={() => setPhase('title')}
            className="border border-gothic-border text-gothic-muted font-serif text-xs py-1 px-3 hover:border-gothic-accent hover:text-gothic-text transition-all"
          >
            ← 戻る
          </button>
          <h1 className="font-display text-gothic-gold tracking-[0.5em] text-lg mx-auto">遊び方</h1>
          <div className="w-12" />
        </div>

        {/* 本文（左ナビ＋右コンテンツ） */}
        <div className="flex-1 min-h-0 flex">
          {/* 左ナビゲーション */}
          <div className="w-[160px] flex-shrink-0 border-r border-gothic-border/40 bg-gothic-panel/60 backdrop-blur-sm overflow-y-auto">
            {TUTORIAL_STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  'w-full text-left px-3 py-3 border-b border-gothic-border/30 border-l-2 transition-all',
                  i === currentStep
                    ? 'bg-gothic-gold/10 border-l-gothic-gold'
                    : 'border-l-transparent hover:bg-gothic-panel/80'
                )}
              >
                <div
                  className={cn(
                    'font-display text-[10px] tracking-widest mb-0.5',
                    i === currentStep ? 'text-gothic-gold' : 'text-gothic-muted'
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div
                  className={cn(
                    'font-serif text-xs leading-tight',
                    i === currentStep ? 'text-gothic-text' : 'text-gothic-muted/70'
                  )}
                >
                  {s.navTitle}
                </div>
              </button>
            ))}
          </div>

          {/* 右コンテンツ */}
          <div className="flex-1 min-w-0 flex flex-col bg-gothic-panel/40 backdrop-blur-sm">
            {/* ステップタイトル */}
            <div className="px-6 py-3 border-b border-gothic-border/30 flex-shrink-0">
              <h2 className="font-display text-gothic-gold text-lg tracking-widest">
                {step.title}
              </h2>
            </div>

            {/* 画像スロット（画像が設定されている場合のみ表示） */}
            {step.image && (
              <div className="px-6 pt-4 flex-shrink-0">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full max-h-[160px] object-contain border border-gothic-border/50"
                />
              </div>
            )}

            {/* 本文セクション（スクロール可能） */}
            <div className="flex-1 min-h-0 overflow-y-auto game-scrollbar px-6 py-4 space-y-4">
              {step.sections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <p className="font-display text-gothic-gold text-xs tracking-widest mb-2">
                      ■ {section.heading}
                    </p>
                  )}
                  {section.text && (
                    <p className="text-gothic-text font-serif text-sm leading-relaxed">
                      {section.text}
                    </p>
                  )}
                  {section.items && (
                    <ul className="mt-1 space-y-1.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex gap-2 text-gothic-text font-serif text-sm">
                          <span className="text-gothic-gold/70 flex-shrink-0">・</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <div className="mt-2 border-l-2 border-gothic-gold/50 pl-3 py-2 bg-gothic-gold/5">
                      <p className="text-gothic-gold/80 font-serif text-xs leading-relaxed">
                        ★ {section.note}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* 練習シナリオ開始ボタン（最終ステップのみ） */}
              {isLastStep && (
                <div className="pt-4 border-t border-gothic-border/30">
                  <button
                    onClick={startTutorialScenario}
                    className="w-full border border-gothic-gold bg-gothic-gold/10 hover:bg-gothic-gold/20 text-gothic-gold font-display tracking-widest py-3 px-6 transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                  >
                    練習シナリオを始める
                    <span className="block text-xs text-gothic-muted mt-1 font-serif tracking-normal">
                      書斎の夕暮れ
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between px-4 border-t border-gothic-border/50 bg-gothic-panel/70 backdrop-blur-sm flex-shrink-0 h-11">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="border border-gothic-border text-gothic-muted font-serif text-xs py-1 px-4 disabled:opacity-30 hover:border-gothic-accent hover:text-gothic-text transition-all disabled:cursor-not-allowed"
          >
            ← 前へ
          </button>
          {!isLastStep ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(TUTORIAL_STEPS.length - 1, s + 1))}
              className="border border-gothic-gold text-gothic-gold font-display tracking-widest text-xs py-1 px-6 hover:bg-stone-800 transition-all"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={() => setPhase('title')}
              className="border border-gothic-border text-gothic-muted font-serif text-xs py-1 px-4 hover:border-gothic-accent hover:text-gothic-text transition-all"
            >
              タイトルへ戻る
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
