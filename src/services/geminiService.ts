import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Scenario } from '../types/scenario'
import { CHARACTER_APPEARANCE_IDS, ROOM_TYPE_IDS, EVIDENCE_CATEGORY_IDS } from '../constants/assetIds'
import { validateScenario } from './scenarioParser'

const PROMPT = `
あなたは日本のマーダーミステリーシナリオ作家です。
以下のJSONスキーマに厳密に従い、日本語のマーダーミステリーシナリオを1つ生成してください。

## アセットIDカタログ
キャラクター外見ID（いずれか1つを選択）: ${CHARACTER_APPEARANCE_IDS.join(', ')}
部屋タイプID（5つ選択）: ${ROOM_TYPE_IDS.join(', ')}
証拠カテゴリID（12個選択）: ${EVIDENCE_CATEGORY_IDS.join(', ')}

## 制約
- detective: { name: string; description: string } を設定すること（探偵は容疑者の外部にいる第三者。容疑者のid/nameとは別人）
- suspects: 6名固定（全員にユニークなidを付与）
- rooms: 5室固定（各部屋に証拠IDを1-3個配置）
- evidence: 12個固定（うちis_fake: trueが3個）
- murderer_id: suspects内のidと一致すること
- evidence_reactionsは各容疑者が全12証拠に対してリアクションを持つこと
- 犯人の決定的証拠に対するbehaviorはnervous/evasive/angryのいずれか
- リアクションは1-2文に収めること
- 全フィールドに値を設定すること（nullや空文字列不可）
- alibi・timeline・statementsはすべて容疑者本人の視点で記述すること。「〇〇は嘘をついている」「空白がある」「確認不可」などの第三者視点のメタ情報・ナレーター的注釈を一切含めないこと
- descriptionおよびexamination_notesに「〇〇（容疑者名）の指紋と一致」「〇〇が犯人」「〇〇のサイズと一致」のような特定人物を犯人と断定・示唆する記述を含めないこと。物証の客観的な特徴のみを記述し、プレイヤー自身が推理できる余地を残すこと
- 日本語の館ミステリーとして成立するストーリーにすること
- 各容疑者のstatementsは必ず5個設定すること
- 各容疑者にroom_idを設定し、5部屋に6人を割り当てること（1部屋に1〜2人）
- 各証拠にexamination_notesを設定すること
- シナリオにmurder_time_rangeを設定すること（例: "22:00〜01:00（推定）"）
- 各容疑者にtimelineを設定すること（事件当日の行動記録。犯人は1箇所に矛盾・空白を含むこと）

## 論理チェーン設計（必須）
プレイヤーが論理的に犯人に辿り着けるよう、以下の3段論法を設計すること：
1. 動機証拠：犯人がなぜ殺すかを示す証拠（遺言書、借金記録など）
2. 機会証拠：いつ・どこで実行したかを示す証拠（目撃証言、アリバイの矛盾など）
3. 手段証拠：どうやって実行したかを示す証拠（凶器、毒物、指紋など）
この3つが揃えば犯人が確定できるようにすること。

## examination_notes の設計（各証拠に必須）
- 調査員目線の推理メモを2〜4文で記述すること
- 他の証拠や容疑者の証言との論理的な接続を含むこと
- 真の証拠は「なぜ犯人に繋がるか」を明示すること
- 偽証拠（is_fake: true）は「詳しく調べると無関係と判明する理由」を記述すること

## statements の設計（各容疑者に必須・5個）
- 少なくとも1つは他の容疑者の行動についての証言を含むこと
- 犯人は1つの矛盾する証言を含むこと（後で他の証拠で反証できる内容）
- 容疑者同士の証言が相互に補強・矛盾するよう設計すること

## murder_time_range の設計（シナリオに必須）
- 推定犯行時刻の範囲を記述すること（例: "22:00〜01:00（推定）"）
- この時間帯にアリバイが確認できる容疑者は犯人から除外できるようにすること

## timeline の設計（各容疑者に必須）
- 事件当日の行動を時刻付きで記述すること（例: "20:00 晩餐会 → 22:00 退席 → …"）
- 犯人のtimelineは1箇所に矛盾または空白を含むこと
- 無実の容疑者のtimelineはアリバイとして機能すること（時刻が証言と一致）
- statementsの証言に含まれる時刻とtimelineの時刻を一致させること

## room_id の設計（各容疑者に必須）
- 6人を5部屋に割り当てること（1部屋に2人まで）
- 容疑者のroom_idはrooms配列のいずれかのidと一致すること

JSONのみを返してください。説明文は不要です。
`

export async function generateScenario(apiKey: string): Promise<Scenario> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8,
      maxOutputTokens: 16384,
    },
  })

  const result = await model.generateContent(PROMPT)
  const text = result.response.text()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('AIの返答をJSONとして解析できませんでした')
  }

  return validateScenario(parsed)
}
