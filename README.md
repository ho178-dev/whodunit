# 館ミステリー

一人用マーダーミステリーゲーム。固定シナリオまたはGemini APIによるAI生成シナリオで遊べる。

---

## アセット配置ガイド

ゲームで使用する画像は `public/assets/` 以下に配置する。
ファイルが存在しない場合はフォールバック（絵文字）が自動表示されるため、未配置でも動作する。

## 画像生成

stable-diffusion-webui-1.7.0で生成した画像を使用。

- キャラクターイラスト用Model
  DreamShaper XL

- 背景・館の雰囲気画像用Model
  Juggernaut XL

- ゴシック特化LoRA（上記と組み合わせ）
  Dark Gothic Horror LoRA

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
| `default.png`          | デフォルト（上記が存在しない場合に使用） |

- **フォーマット**: PNG（推奨サイズ: 1200×600px 以上、横長）
- **フォールバック**: 各IDの画像がない場合は `default.png` で表示

---

### キャラクター画像 `public/assets/characters/`

| ファイル名              | 説明                               |
| ----------------------- | ---------------------------------- |
| `male_teen.png`         | 男性・10代                         |
| `male_young.png`        | 男性・20〜30代                     |
| `male_young_alt.png`    | 男性・20〜30代（別バリエーション） |
| `male_middle.png`       | 男性・中年                         |
| `male_middle_alt.png`   | 男性・中年（別バリエーション）     |
| `male_elderly.png`      | 男性・老年                         |
| `female_teen.png`       | 女性・10代                         |
| `female_young.png`      | 女性・20〜30代                     |
| `female_young_alt.png`  | 女性・20〜30代（別バリエーション） |
| `female_middle.png`     | 女性・中年                         |
| `female_middle_alt.png` | 女性・中年（別バリエーション）     |
| `female_elderly.png`    | 女性・老年                         |

- **フォーマット**: PNG（推奨サイズ: 256×320px 以上、縦長）
- **フォールバック**: 画像なしの場合 `👤` を表示

---

### 部屋画像 `public/assets/rooms/`

| ファイル名        | 説明           |
| ----------------- | -------------- |
| `study.png`       | 書斎           |
| `kitchen.png`     | キッチン       |
| `bedroom.png`     | 寝室           |
| `dining_room.png` | ダイニング     |
| `library.png`     | 図書室         |
| `garden.png`      | 庭園           |
| `hallway.png`     | 廊下           |
| `basement.png`    | 地下室         |
| `attic.png`       | 屋根裏         |
| `bathroom.png`    | 浴室           |
| `default.png`     | デフォルト画像 |

- **フォーマット**: PNG（推奨サイズ: 800×500px 以上、横長）
- **フォールバック**: 画像なしの場合は`default.png`で表示

---

### 証拠品アイコン `public/assets/evidence/`

| ファイル名              | 説明           |
| ----------------------- | -------------- |
| `weapon_blade.png`      | 刃物           |
| `weapon_blunt.png`      | 鈍器           |
| `weapon_firearm.png`    | 銃器           |
| `poison.png`            | 毒物           |
| `document_letter.png`   | 手紙・メモ     |
| `document_diary.png`    | 日記           |
| `document_contract.png` | 契約書・遺言書 |
| `clothing.png`          | 衣類・靴       |
| `jewelry.png`           | 装飾品         |
| `key.png`               | 鍵             |
| `container.png`         | 容器・グラス   |
| `photograph.png`        | 写真・画像     |
| `medicine.png`          | 薬品           |
| `food_drink.png`        | 食物・飲料     |
| `tool.png`              | 道具           |
| `fabric.png`            | 布・ハンカチ   |
| `fingerprint.png`       | 指紋           |
| `blood_stain.png`       | 血痕           |

- **フォーマット**: PNG・透過推奨（推奨サイズ: 128×128px）
- **フォールバック**: 画像なしの場合 `🔍` を表示

---

## 開発

```bash
npm install
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
```

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS（ゴシックテーマ）
- Zustand（状態管理）
- Google Gemini API（AIシナリオ生成）
