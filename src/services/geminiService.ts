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
- suspects: 6名固定（全員にユニークなidを付与）
- rooms: 5室固定（各部屋に証拠IDを1-3個配置）
- evidence: 12個固定（うちis_fake: trueが3個）
- murderer_id: suspects内のidと一致すること
- evidence_reactionsは各容疑者が全12証拠に対してリアクションを持つこと
- 犯人の決定的証拠に対するbehaviorはnervous/evasive/angryのいずれか
- リアクションは1-2文に収めること
- 全フィールドに値を設定すること（nullや空文字列不可）
- 日本語の館ミステリーとして成立するストーリーにすること

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
