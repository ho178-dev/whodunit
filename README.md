# WhoDuNit

一人用マーダーミステリーゲーム。固定シナリオまたはGemini APIによるAI生成シナリオで遊べる。

---

# commit message ガイドライン

- fix: バグ修正
- feat: 新機能の追加
- docs: ドキュメントの変更
- style: コードのスタイル変更（機能に影響なし）
- refactor: コードのリファクタリング（機能に影響なし）
- test: テストの追加・修正
- chore: その他の変更（ビルドプロセス、依存関係の変更など）

## アセット配置ガイド

- ゲームで使用する画像は `public/assets/` 以下に配置する。
- ファイルが存在しない場合は各カテゴリのデフォルト画像（`default_mansion.png` / `default_character.png` / `default_room.png` / `default_evidence.png`）が自動表示されるため、未配置でも動作する。

## 画像生成

stable-diffusion-webui-1.7.0で生成した画像を使用。

- キャラクターイラスト用Model
  Animagine XL 4.0

- 部屋・館・証拠品イラスト用Model
  SDXL 1.0
  各種イラストは内部でドット風にリサイズして使用するため、元画像は高解像度で生成しておくと見栄えが良い。

### ディレクトリ構成

```
public/
└── assets/
    ├── characters/   # キャラクター立ち絵
    ├── mansion/      # 館の背景画像（事件概要画面）
    ├── rooms/        # 部屋の背景画像
    └── evidence/     # 証拠品アイコン
```

---

### 館背景画像 `public/assets/mansion/`

事件概要画面（シナリオブリーフィング）のヘッダーに表示される館の外観・雰囲気画像。
AIシナリオ生成時にシナリオの設定に合う `mansion_background_id` が自動選択される。

| ファイル名             | 説明                                     |
| ---------------------- | ---------------------------------------- |
| `mansion_gothic.png`   | ゴシック様式の洋館（西洋古典）           |
| `mansion_japanese.png` | 日本家屋・豪邸（和風）                   |
| `mansion_seaside.png`  | 孤島・海辺の館（嵐・孤立）               |
| `mansion_forest.png`   | 深森の中の屋敷（霧・幽玄）               |
| `mansion_snowy.png`    | 雪景色の館（冬・静寂）                   |
| `mansion_night.png`    | 月夜の館（闇夜・月明かり）               |
| `mansion_ruins.png`    | 廃墟・古城風（荒廃・呪われた）           |
| `default_mansion.png`  | デフォルト（上記が存在しない場合に使用） |

- **フォーマット**: PNG（生成サイズ: 1216×684px、横長）
- **フォールバック**: 各IDの画像がない場合は `default_mansion.png` で表示

---

### キャラクター画像 `public/assets/characters/`

| ファイル名               | 説明                                     |
| ------------------------ | ---------------------------------------- |
| `male_teen.png`          | 男性・10代                               |
| `male_teen_alt.png`      | 男性・10代（別バリエーション）           |
| `male_young.png`         | 男性・20〜30代                           |
| `male_young_alt.png`     | 男性・20〜30代（別バリエーション）       |
| `male_young_alt2.png`    | 男性・20〜30代（メガネ・知的）           |
| `male_middle.png`        | 男性・中年                               |
| `male_middle_alt.png`    | 男性・中年（別バリエーション）           |
| `male_middle_alt2.png`   | 男性・中年（禿げ・山羊髭・強面）         |
| `male_elderly.png`       | 男性・老年                               |
| `male_elderly_alt.png`   | 男性・老年（長い白髭・禿げ）             |
| `female_teen.png`        | 女性・10代                               |
| `female_teen_alt.png`    | 女性・10代（ツインテール）               |
| `female_young.png`       | 女性・20〜30代                           |
| `female_young_alt.png`   | 女性・20〜30代（別バリエーション）       |
| `female_young_alt2.png`  | 女性・20〜30代（ポニーテール・凜々しい） |
| `female_middle.png`      | 女性・中年                               |
| `female_middle_alt.png`  | 女性・中年（髷・冷淡な印象）             |
| `female_middle_alt2.png` | 女性・中年（短い巻き髪・威厳）           |
| `female_elderly.png`     | 女性・老年                               |
| `female_elderly_alt.png` | 女性・老年（長い三つ編み・白髪）         |
| `default_character.png`  | デフォルト画像（中性的）                 |

- **フォーマット**: PNG（生成サイズ: 832×1216px、縦長）
- **フォールバック**: 画像なしの場合 `default_character.png` を表示
- **プロンプト**: `public/assets/sd_prompts_v3_2.md` に各ファイルの生成プロンプトを記載

---

### 部屋画像 `public/assets/rooms/`

| ファイル名         | 説明           |
| ------------------ | -------------- |
| `study.png`        | 書斎           |
| `kitchen.png`      | キッチン       |
| `bedroom.png`      | 寝室           |
| `dining_room.png`  | ダイニング     |
| `library.png`      | 図書室         |
| `garden.png`       | 庭園           |
| `hallway.png`      | 廊下           |
| `basement.png`     | 地下室         |
| `attic.png`        | 屋根裏         |
| `bathroom.png`     | 浴室           |
| `default_room.png` | デフォルト画像 |

- **フォーマット**: PNG（生成サイズ: 1216×684px、横長）
- **フォールバック**: 画像なしの場合は`default_room.png`で表示

---

### 証拠品アイコン `public/assets/evidence/`

| ファイル名              | 説明                   |
| ----------------------- | ---------------------- |
| `weapon_blade.png`      | 刃物                   |
| `weapon_blunt.png`      | 鈍器                   |
| `weapon_firearm.png`    | 銃器                   |
| `poison.png`            | 毒物                   |
| `document_letter.png`   | 手紙・メモ             |
| `document_diary.png`    | 日記                   |
| `document_contract.png` | 契約書・遺言書         |
| `clothing.png`          | 衣類・靴               |
| `jewelry.png`           | 装飾品                 |
| `key.png`               | 鍵                     |
| `container.png`         | 容器・グラス           |
| `photograph.png`        | 写真・画像             |
| `medicine.png`          | 薬品                   |
| `food_drink.png`        | 食物・飲料             |
| `tool.png`              | 道具                   |
| `fabric.png`            | 布・ハンカチ           |
| `fingerprint.png`       | 指紋                   |
| `blood_stain.png`       | 血痕                   |
| `default_evidence.png`  | デフォルト画像(虫眼鏡) |

- **フォーマット**: PNG・透過推奨（生成サイズ: 1024×1024px、リサイズして使用）
- **フォールバック**: 画像なしの場合 `default_evidence.png` を表示

---

## 開発・ビルド

```bash
npm install
npm run dev          # 開発サーバー起動（有料版相当・全シナリオ表示）
npm run build:full   # 有料版ビルド（全3シナリオ）
npm run build:trial  # 体験版ビルド（シナリオ1本のみ・予告画面あり）
npm run build        # build:full と同等
```

### 体験版 / 有料版の切り替え

`VITE_TRIAL_MODE` 環境変数でビルド内容を制御する。

| モード | コマンド      | 読み込まれる env ファイル | シナリオ数 | 予告画面 |
| ------ | ------------- | ------------------------- | ---------- | -------- |
| 有料版 | `build:full`  | `.env`                    | 3本        | なし     |
| 体験版 | `build:trial` | `.env.trial`              | 1本        | あり     |

- `.env.trial` には `VITE_TRIAL_MODE=true` が設定済み
- 体験版ではタイトル画面からシナリオ選択を**スキップ**して直接ブリーフィングへ遷移する
- エンディング後に「次のシナリオ予告を見る」ボタンが表示され、シナリオ2・3の紹介とBooth購入リンクを案内する

### デバッグページ

開発サーバー起動中に以下のURLでデバッグページを表示できる（本番ビルドでは無効）。

```
http://localhost:5173/?debug=true
```

| タブ | 内容                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------ |
| 画像 | キャラクター・部屋・館背景・証拠品の全アセットを一覧表示。未配置ファイルは「未配置」と表示される |
| BGM  | BGMファイルの再生テスト。`assetList.ts` の `BGM_ASSETS` に追加して利用する                       |

BGMを追加する手順：

1. `public/assets/bgm/` にファイルを配置する
2. `src/components/debug/assetList.ts` の `BGM_ASSETS` 配列にエントリを追加する

```ts
{ path: '/assets/bgm/title.mp3', label: 'タイトル', category: 'メイン' }
```

---

### Booth販売URL

`src/constants/salesConfig.ts` の `BOOTH_URL` 定数を差し替えること。

```ts
export const BOOTH_URL = 'https://booth.pm/ja/items/PLACEHOLDER' // ← ここをBoothのURLに変更
```

## ゲームデザイン方針

### ゲーム体験の大前提

このゲームの面白さの核は以下の3つ：

1. **推理する楽しさ** — 証拠と証言を組み合わせ、自分の頭で論理を組み立てる体験
2. **トリックを暴く快感** — 犯人の嘘や矛盾を証拠で崩す手応え
3. **犯人を当てたときのカタルシス** — 動機・機会・手段が揃った瞬間の確信と、告発が当たったときの達成感

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS（ゴシックテーマ）
- Zustand（状態管理）
- Google Gemini API（AIシナリオ生成）
