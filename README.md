# whodunit — 館ミステリー

一人用マーダーミステリーWebゲーム。孤島の洋館で起きた殺人事件の犯人を推理する。

## 概要

- **ジャンル**: 一人用マーダーミステリー（推理ゲーム）
- **プレイ時間**: 約20〜40分／シナリオ
- **言語**: 日本語
- **ポートフォリオ兼販売目的**（itch.io / BOOTH予定）

## デモシナリオ

**「黄昏の晩餐会」** — 固定シナリオ（APIキー不要）

孤島の洋館で開催された晩餐会。翌朝、資産家の黒崎源一郎が書斎で毒殺死体で発見された。招待された6名の容疑者の中に犯人がいる。

## ゲームフロー

```
タイトル
  ├─ 固定シナリオ ──────────────────────────────────┐
  └─ APIキー入力 → Gemini APIでシナリオ生成 ────────┤
                                                      ↓
                                              キャラクター選択
                                                      ↓
                                    探索フェーズ（8アクション制限）
                                      ├─ 部屋を選んで証拠を発見
                                      └─ NPCに話しかける
                                                      ↓
                                              議論フェーズ
                                        証拠を容疑者に突きつけてリアクションを観察
                                                      ↓
                                              最終投票
                                                      ↓
                                       エンディング（正解 / 不正解）
```

## 技術スタック

| 項目 | 採用技術 |
|---|---|
| ビルドツール | Vite |
| フレームワーク | React + TypeScript |
| スタイリング | Tailwind CSS |
| 状態管理 | Zustand |
| 画面遷移 | カスタムステートマシン（React Router不使用） |
| AI API | Google Gemini API（`gemini-2.0-flash`） |
| UIテーマ | ゴシック・ダーク |
| フォント | Noto Serif JP + Cinzel |

## ディレクトリ構成

```
src/
├── constants/
│   ├── assetIds.ts          # キャラ・部屋・証拠のIDカタログ
│   ├── fixedScenario.ts     # 固定シナリオ「黄昏の晩餐会」
│   └── gameConfig.ts        # ゲーム定数（MAX_ACTIONS=8等）
├── types/
│   ├── scenario.ts          # シナリオJSON型定義
│   └── game.ts              # ゲーム状態型
├── stores/
│   └── gameStore.ts         # Zustand グローバルストア
├── machines/
│   └── gameMachine.ts       # フェーズ遷移 + ガード条件
├── services/
│   ├── geminiService.ts     # Gemini API呼び出し
│   ├── scenarioParser.ts    # JSONバリデーション（10項目）
│   └── assetResolver.ts     # アセットID → パス解決
├── hooks/
│   ├── useGamePhase.ts      # フェーズ遷移フック
│   └── useAsset.ts          # アセットパス生成フック
├── components/
│   ├── layout/              # GameShell, GothicPanel
│   ├── phases/              # 各フェーズ画面（8画面）
│   ├── investigation/       # 探索フェーズ用コンポーネント
│   ├── discussion/          # 議論フェーズ用コンポーネント
│   └── shared/              # 共通UI（CharacterCard, EvidenceCard等）
└── utils/
    └── cn.ts                # clsx + tailwind-merge
```

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## AIシナリオ生成（オプション）

タイトル画面から「AIでシナリオ生成」を選択し、[Google AI Studio](https://aistudio.google.com/) で取得したAPIキーを入力するとGemini APIがランダムな館ミステリーシナリオを生成します。

- モデル: `gemini-2.0-flash`
- APIキーはセッション中のみ使用・保存なし

## ゲームシステム詳細

### 探索フェーズ
- 5つの部屋を自由に選択して調査
- 証拠発見・NPC会話それぞれ1アクション消費
- 8アクション使い切るか、証拠を1つ以上発見で議論フェーズへ進める

### 議論フェーズ
- 発見した証拠を6名の容疑者に突きつける
- 容疑者ごとに証拠に対する固有のリアクションと態度（冷静・動揺・怒り・悲嘆・回避）が設定されている
- 投票前に何度でも突きつけ可能

### 投票フェーズ
- 6名の中から犯人と思う人物を1名選んで告発

### エンディング
- 正解：「謎は解けた」— 動機・真相が全文表示
- 不正解：「真犯人を見逃した」— 同様に真相が開示
- 同じシナリオでのリトライ、タイトルへの帰還が可能

## アセットID仕様

キャラクター外見（12種）、部屋タイプ（10種）、証拠カテゴリ（18種）のIDカタログを定義済み。
`public/assets/` 以下に同名の画像ファイルを配置することで差し替え可能。

| カテゴリ | ディレクトリ | フォーマット |
|---|---|---|
| キャラクター | `public/assets/characters/` | `{id}.png` |
| 部屋 | `public/assets/rooms/` | `{id}.jpg` |
| 証拠 | `public/assets/evidence/` | `{id}.png` |

## 公開ロードマップ

| ステップ | 内容 |
|---|---|
| Step 1 | 固定シナリオ1本 + APIキー方式。GitHub公開（現在） |
| Step 2 | 固定シナリオ3〜5本追加。Vercel等でデプロイ + PWA対応 |
| Step 3 | itch.io / BOOTHで公開・販売 |

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが出力されます。バックエンド不要・静的ホスティングのみで動作します。
