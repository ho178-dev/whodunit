// Gemini APIを使ってマーダーミステリーシナリオを生成するサービス
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Scenario } from '../types/scenario'
import {
  CHARACTER_APPEARANCE_IDS,
  ROOM_TYPE_IDS,
  EVIDENCE_CATEGORY_IDS,
  MANSION_BACKGROUND_IDS,
} from '../constants/assetIds'
import { validateScenario } from './scenarioParser'
import { SUSPECT_CONTRADICTION_COUNT, MURDERER_CONTRADICTION_COUNT } from '../constants/gameConfig'

const PROMPT = `
あなたは日本のマーダーミステリーシナリオ作家です。
以下のJSONスキーマに厳密に従い、日本語のマーダーミステリーシナリオを1つ生成してください。

## アセットIDカタログ
キャラクター外見ID（いずれか1つを選択）: ${CHARACTER_APPEARANCE_IDS.join(', ')}
部屋タイプID（5つ選択）: ${ROOM_TYPE_IDS.join(', ')}
証拠カテゴリID（12個選択）: ${EVIDENCE_CATEGORY_IDS.join(', ')}
館背景ID（いずれか1つを選択）: ${MANSION_BACKGROUND_IDS.join(', ')}

## 制約
- mansion_background_id: 館背景IDカタログからシナリオの舞台・雰囲気に最も合う1つを選択すること
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
- 各容疑者にdefault_wrong_pursuit_responseを設定すること（見当違いの証言で矛盾を追及されたときの容疑者ごとの反応。性格に合った1文）
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
- 偽証拠（is_fake: true）は「詳しく調べると無関係と判明する理由」を記述すること。「あなたが立てていた仮説が崩れる」という体験を与えるような文言にすること

## first_impression の設計（偽証拠のみ必須）
- is_fake: true の証拠には必ず first_impression フィールドを設定すること
- 1段階目の調査（外観確認）時に表示する「本物っぽく見えるミスリード説明」を記述すること
- 2〜3文で、プレイヤーが「これは重要な証拠かもしれない」と感じる内容にすること
- description とは異なり、本物であるかのように偽装した文体で書くこと（「〜の可能性がある」「〜と考えられる」など）
- examination_notes で覆される伏線を仕込むこと（例：染みの色→血痕に見える、手紙の内容→今夜の事件と関係ありそう）

## statements の設計（各容疑者に必須・5個）
- 少なくとも1つは他の容疑者の行動についての証言を含むこと
- 犯人は1つの矛盾する証言を含むこと（後で他の証拠で反証できる内容）
- 容疑者同士の証言が相互に補強・矛盾するよう設計すること
- 他の容疑者の行動を目撃した証言では、犯人の名前を直接明記しないこと。「誰かが」「ある方が」「男性の影が」のような間接的な表現にし、プレイヤーが自ら推理で特定できる余地を残すこと
- 各容疑者に1〜2個はミスリードとなる疑わしい要素（怪しい行動・動機・専門知識など）を含めること。これにより犯人以外の容疑者もプレイヤーの推理対象として成立させること

## contradicts_statement_index の設計（矛盾インジケーター）
- ある証拠が容疑者の発言（statements[]の0〜4のいずれか）と直接矛盾する場合、その evidence_reaction に contradicts_statement_index を設定すること
- 犯人には必ず ${MURDERER_CONTRADICTION_COUNT} 件の evidence_reaction に contradicts_statement_index を設定すること
- 犯人以外の各容疑者には ${SUSPECT_CONTRADICTION_COUNT} 件の evidence_reaction に contradicts_statement_index を設定すること
- 矛盾の定義：証拠の存在が「その容疑者が当該 statements で語った内容を嘘または不正確と示す」場合のみ設定すること
- 値は矛盾する statements[] のインデックス（0〜4の整数）

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

## evidence_combinations の設計（必須・3〜5個）
証拠クロス参照システム。単体では意味が薄い証拠が2〜3個組み合わさって初めて「決定的事実」が解放される仕組み。
プレイヤーが能動的に論理を組み立てる体験の核となる。

### 設計原則
- 各組み合わせは evidence 配列の id を正確に参照すること
- evidence_ids は2〜3個（タプル形式）
- 組み合わせの数は3〜5個（多すぎると総当たりになる）
- **is_critical: true の組み合わせは2個以上必須**（プレイヤーが複数の経路から犯人に辿り着けるようにすること）
- 単体証拠では「何かが繋がる気がする」程度に留め、組み合わせで初めて決定的になること

### is_critical の設計
以下のいずれかに該当する場合は必ず is_critical: true とすること：
- 犯人の名前・イニシャル・特定の人物を指す表現が description に登場する組み合わせ
- 犯人のアリバイを直接崩す組み合わせ
- 犯行手段（凶器・毒物・方法）を犯人と結びつける組み合わせ
- 犯行動機を犯人と確定させる組み合わせ
is_critical: false とするのは、事件の背景・人間関係・被害者情報を補強するに留まる組み合わせのみ。

### 必須の組み合わせパターン（以下のうち最低2つを is_critical: true で含めること）
1. 機会を示す組み合わせ：犯人のアリバイの嘘を暴く証拠×2（例：足跡系＋目撃写真）→ is_critical: true
2. 手段を示す組み合わせ：凶器の入手経路を繋ぐ証拠×2（例：原材料＋精製品）→ is_critical: true
3. 動機を示す組み合わせ：犯行動機を確定させる証拠×2〜3（例：書類＋日記）→ is_critical: true

### フィールド定義
- id: ユニークな文字列（例: "combo_garden_intruder"）
- evidence_ids: evidence配列のidから2または3個選択したタプル
- name: 解放されるファクトの短い名前（10〜20文字）例: "深夜に庭へ出た人物が特定された"
- description: ファクトの詳細説明（2〜4文）。なぜこの組み合わせが決定的かを明示すること
- is_critical: boolean（上記基準に従うこと）
- required_suspect_ids: description に特定の容疑者の名前・イニシャルが直接登場する場合のみ設定すること。suspects 配列から該当する容疑者のidを1〜2個選ぶ。「館内の人物」「犯行者」等の一般表現しか含まない場合は省略する。省略した場合は証拠条件のみで発火する。設定した場合は対象容疑者のプロフィール閲覧＋全証言聴取も発火条件に追加される

JSONのみを返してください。説明文は不要です。
`

// Step2 用：ベースシナリオを受け取って追及チェーンJSONを生成するプロンプトを構築する
function buildPursuitChainPrompt(scenario: Scenario): string {
  return `
あなたは日本のマーダーミステリーシナリオ作家です。
以下のシナリオデータを元に、各容疑者の evidence_reactions に追及質問チェーンを設計してください。

## シナリオデータ
${JSON.stringify(scenario, null, 2)}

## 追及質問チェーンの設計ルール

### 対象の選び方
- **全容疑者**に最低1つの pursuit_questions を設計すること
- 犯人（murderer_id: ${scenario.murderer_id}）：contradicts_statement_index が設定された evidence_reaction を2〜3個選ぶ。チェーンは有罪に繋がる方向で設計する
- **非犯人**：contradicts_statement_index が設定された evidence_reaction を1個選ぶ。チェーンは容疑者の秘密や事情を明かすが、最終的に「殺してはいない」と証明される方向にする（フェイクリード）

### 質問の構造
- pursuit_questions は各 evidence_reaction に2個設定する（1個目がルート、2個目が連鎖）
- 1個目（ルート質問）の unlocks_pursuit_question_ids に2個目のIDを設定する
- 2個目（連鎖質問）は unlocks_pursuit_question_ids を設定しない
- 質問IDの形式："{suspect_id}_pq_{evidence_id}_{番号}" （例: "shiraishi_pq_muddy_1"）

### 質問文（text）の書き方
- **必ずその容疑者が実際に言った証言（statements の文章）を直接引用すること**
- 例：「あなたは『〇〇』と言いましたね。ではこの証拠はどう説明しますか？」という形式
- 引用する証言は contradicts_statement_index が示す statements[index] の内容を使うこと
- 1文で完結させ、30〜60字程度

### 返答（response）の書き方
- 容疑者の動揺・言い訳・開き直りを含む（1〜2文）
- behavior は nervous / evasive / angry のいずれか
- 犯人の返答：特に動揺が強く、最終的に言葉に詰まること
- 非犯人の返答：「疑われる理由はわかるが、殺していない。なぜなら〜」という方向

### wrong_testimony_response の追加
- pursuit_questions を持つ全ての evidence_reaction に wrong_testimony_response フィールドも必ず設定すること
- これはプレイヤーが**誤った証言**を選択したときに表示される容疑者のリアクション（1文）
- 例：「その証言と、この証拠に直接の矛盾はない。見当違いだ。」

## 出力形式
以下のJSON構造のみを返してください。説明文は不要です。

{
  "pursuit_chains": {
    "{suspect_id}": {
      "{evidence_id}": {
        "wrong_testimony_response": "...",
        "questions": [
          {
            "id": "...",
            "text": "あなたは『実際の証言文』と言いましたね。ではこの証拠はどう説明しますか？",
            "response": "...",
            "behavior": "nervous",
            "unlocks_pursuit_question_ids": ["..."]
          },
          {
            "id": "...",
            "text": "...",
            "response": "...",
            "behavior": "angry"
          }
        ]
      }
    }
  }
}
`
}

type PursuitChainEntry = {
  wrong_testimony_response?: string
  questions: import('../types/scenario').PursuitQuestion[]
}

// pursuit_chains をベースシナリオの evidence_reactions にマージする
function mergePursuitChains(
  scenario: Scenario,
  chains: Record<string, Record<string, PursuitChainEntry>>
): Scenario {
  return {
    ...scenario,
    suspects: scenario.suspects.map((suspect) => {
      const suspectChains = chains[suspect.id]
      if (!suspectChains) return suspect
      return {
        ...suspect,
        evidence_reactions: Object.fromEntries(
          Object.entries(suspect.evidence_reactions).map(([evidenceId, reaction]) => {
            const entry = suspectChains[evidenceId]
            if (!entry?.questions?.length) return [evidenceId, reaction]
            return [
              evidenceId,
              {
                ...reaction,
                pursuit_questions: entry.questions,
                ...(entry.wrong_testimony_response && {
                  wrong_testimony_response: entry.wrong_testimony_response,
                }),
              },
            ]
          })
        ),
      }
    }),
  }
}

// Step3 用：ベースシナリオを受け取って告発シーンJSONを生成するプロンプトを構築する
function buildAccusationPrompt(scenario: Scenario): string {
  const suspectList = scenario.suspects.map((s) => `- ${s.id}: ${s.name}`).join('\n')
  const evidenceList = scenario.evidence
    .filter((e) => !e.is_fake)
    .map((e) => `- ${e.id}: ${e.name}`)
    .join('\n')

  return `
あなたは日本のマーダーミステリーシナリオ作家です。
以下のシナリオデータを元に、告発シーン（犯人指名後の対決演出）のデータを生成してください。

## シナリオ概要
- タイトル: ${scenario.title}
- 犯人: ${scenario.murderer_id}
- 動機: ${scenario.motive}
- 真相: ${scenario.truth}

## 容疑者一覧
${suspectList}

## 本物の証拠一覧
${evidenceList}

## 告発シーンの設計ルール

### 正解ルート（犯人を正しく指名した場合）
- defense_statement: 犯人の最終弁明（3〜5文）。アリバイを主張し無実を訴える。ただし微かな動揺を含めること。最後に「証拠があるなら見せてみろ」と挑発で締める
- decisive_evidence_id: 犯人の弁明を最も効果的に覆せる証拠1つのID。動機を直接証明する証拠を優先する
- wrong_evidence_reaction: 誤った証拠を選んだ時の犯人の反応（1〜2文）。余裕を見せつつ再挑戦を促す
- refutation_text: 正しい証拠を突き付けた時のナレーション（3〜4文）。なぜこの証拠が弁明を覆すかを論理的に説明する
- breakdown_statement: 犯人の崩壊・告白（3〜5文）。動揺→観念→犯行の動機を自白する流れ。改行で段落を分けること

### 不正解ルート（無実の人物を指名した場合）
犯人以外の全容疑者について以下を設定する：
- confusion_statement: 困惑の第一声（2〜3文）。キャラの性格を反映した反応
- alibi_reveal: アリバイ・動機不在の説明（2〜3文）。なぜこの人物が犯人ではないかを客観的に示す。最後に「真犯人は——別にいる。」で締める

## 出力形式
以下のJSON構造のみを返してください。説明文は不要です。

{
  "correct": {
    "defense_statement": "...",
    "decisive_evidence_id": "...",
    "wrong_evidence_reaction": "...",
    "refutation_text": "...",
    "breakdown_statement": "..."
  },
  "incorrect": {
${scenario.suspects
  .filter((s) => s.id !== scenario.murderer_id)
  .map((s) => `    "${s.id}": { "confusion_statement": "...", "alibi_reveal": "..." }`)
  .join(',\n')}
  }
}
`
}

// Gemini APIにプロンプトを送信してシナリオJSONを生成・バリデーションして返す（3ステップ生成）
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

  // Step1: ベースシナリオ生成
  const result = await model.generateContent(PROMPT)
  const text = result.response.text()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('AIの返答をJSONとして解析できませんでした')
  }

  const baseScenario = validateScenario(parsed)

  // Step2（追及チェーン）とStep3（告発データ）は互いに独立のため並列実行
  const [chainResult, accusationResult] = await Promise.allSettled([
    model.generateContent(buildPursuitChainPrompt(baseScenario)),
    model.generateContent(buildAccusationPrompt(baseScenario)),
  ])

  let scenario = baseScenario

  // Step2 結果マージ
  if (chainResult.status === 'fulfilled') {
    try {
      const chainText = chainResult.value.response.text()
      const chainParsed = JSON.parse(chainText) as {
        pursuit_chains: Record<string, Record<string, PursuitChainEntry>>
      }
      if (chainParsed.pursuit_chains) {
        scenario = mergePursuitChains(scenario, chainParsed.pursuit_chains)
      }
    } catch {
      // 追及チェーンのパース失敗はゲームを壊さない
    }
  }

  // Step3 結果マージ
  if (accusationResult.status === 'fulfilled') {
    try {
      const accusationText = accusationResult.value.response.text()
      const accusationParsed = JSON.parse(
        accusationText
      ) as import('../types/accusation').AccusationScenarioData
      if (accusationParsed.correct?.decisive_evidence_id) {
        scenario = { ...scenario, accusation_data: accusationParsed }
      }
    } catch {
      // 告発データのパース失敗時は告発フェーズをスキップ
    }
  }

  return scenario
}
