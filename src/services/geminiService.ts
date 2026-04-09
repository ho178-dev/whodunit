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
- suspects 6名と victim のappearance_idは全員異なる値を選択すること（20種類から7種類を重複なしで選ぶ）
- rooms: 5室固定（各部屋に証拠IDを1-3個配置）
- evidence: 12個固定（うちis_fake: trueが3個）
- murderer_id: suspects内のidと一致すること
- evidence_reactionsは各容疑者が全12証拠に対してリアクションを持つこと
- 犯人の決定的証拠に対するbehaviorはnervous/evasive/angryのいずれか
- リアクションは1-2文に収めること
- 全フィールドに値を設定すること（nullや空文字列不可）
- alibi・timeline・statementsはすべて容疑者本人の視点で記述すること。「〇〇は嘘をついている」「空白がある」「確認不可」などの第三者視点のメタ情報・ナレーター的注釈を一切含めないこと
- victim の cause_of_death は「どこで」「どうやって」死んだかを必ず含めること（例：「ダイニングで毒入りのワイングラスを飲んだことによるアコニチン中毒死。翌朝、書斎で倒れているところを発見された。」）
- description・examination_notes・first_impression・relevanceのいずれにも、容疑者・被害者の固有名詞・イニシャル・「〇〇のもの」「〇〇と一致」「〇〇の指紋」のような特定個人を指す表現を含めないこと。物証の客観的な特徴のみを記述し、プレイヤー自身が推理できる余地を残すこと
- 偽証拠（is_fake: true）のexamination_notesは「他の容疑者名を使ったミスリード」ではなく「この物証が今回の事件と無関係と判明する客観的理由」を記述すること
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

## secret の設計（各容疑者に必須）
- 容疑者が隠している秘密・事情を記述すること
- secret の内容は evidence_reactions と pursuit_questions を通じてプレイヤーが発見できるよう設計すること
  例：secret が「脅迫されていた」なら、その脅迫に関連する証拠の evidence_reaction で動揺を示し、pursuit_questions でsecretの内容に迫ること
- 無実の容疑者の secret は「疑われる理由にはなるが、殺害の動機にはならない」内容にすること
- 犯人の secret は動機の核心につながる内容にすること

## confession_statement の設計（犯人のみ必須）
- エンディング画面（真相到達後）で表示される犯人の独白セリフ
- breakdown_statement（告発フェーズの崩壊シーン）とは異なる内容にすること
- 内幕を吐き出すというより、静かに余韻を残す独白にすること
- 最後の一文は epilogue_text（ナレーション）へと自然につながる「引き」で終わること
- 例：「……全部、私がやった。（長い沈黙）これで何かが変わるのかな。もう、どうでもいい……」のように、割り切れない感情の余白で締める

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
- **timeline_has_contradiction フィールド（必須）**: 犯人は必ず true を設定すること。無実の容疑者は原則 false だが、1〜2名はアリバイに疑わしい空白がある設定にして true にしてもよい（プレイヤーへの適度なミスリード）

## room_id の設計（各容疑者に必須）
- 6人を5部屋に割り当てること（1部屋に2人まで）
- **容疑者のroom_idはrooms配列のいずれかのidと完全一致すること**（rooms配列に存在しないIDを容疑者に設定すると、その容疑者がゲームに表示されなくなる致命的バグになる）
- rooms配列を定義した後に各容疑者のroom_idを設定し、必ず一致を確認すること

## 証拠の部屋配置（必須ルール）
- **全12個の証拠IDが、rooms配列のいずれかの evidence_ids に必ず含まれること**（どの部屋にも配置されていない証拠はプレイヤーが調査できず、ゲームが解けなくなる致命的バグになる）
- 各部屋のevidence_idsには必ずevidence配列に存在するidのみを記載すること（存在しないIDを参照すると表示バグになる）
- 12個の証拠IDをevidence_ids合計でちょうど12回参照すること（1証拠が複数部屋に重複配置されることは禁止）

## main_reasoning_path の設計（シナリオに必須）
- プレイヤーが論理的に犯人へ辿り着く推理導線を、番号付きステップで記述すること
- エンディング画面の「推理導線」セクションに表示される（真相開示後のネタバレ解説）
- 形式例：「① 動機証拠→犯人の言動の矛盾\n② アリバイを崩す証拠\n③ 手段の証拠\n④ 証拠組み合わせで確定」
- 各ステップは30〜50字程度。全体で4〜6ステップ
- プレイヤーへの攻略ヒントではなく、「こういう推理を積み重ねれば辿り着けた」という事後説明として書くこと
- シナリオの「truth」フィールドと整合すること

## evidence_combinations の設計（必須・上限指定がない場合は5個を目標）
証拠クロス参照システム。単体では意味が薄い証拠が2〜3個組み合わさって初めて「決定的事実」が解放される仕組み。
プレイヤーが能動的に論理を組み立てる体験の核となる。

### 設計原則
- 各組み合わせは evidence 配列の id を正確に参照すること
- evidence_ids は2〜3個（タプル形式）
- 組み合わせの数は上限指定がない場合は5個を目標にすること（多すぎると総当たりになるため5個が上限）
- **is_critical: true の組み合わせは3個以上必須**（プレイヤーが複数の経路から犯人に辿り着けるようにすること）
- 単体証拠では「何かが繋がる気がする」程度に留め、組み合わせで初めて決定的になること

### is_critical の設計
以下のいずれかに該当する場合は必ず is_critical: true とすること：
- 犯人のアリバイを直接崩す組み合わせ
- 犯行手段（凶器・毒物・方法）を犯人と結びつける組み合わせ
- 犯行動機を犯人と確定させる組み合わせ
- 犯人が現場にいたことを示す組み合わせ
is_critical: false とするのは、事件の背景・人間関係・被害者情報を補強するに留まる組み合わせのみ。

### 必須の組み合わせパターン（以下のうち最低3つを is_critical: true で含めること）
1. 機会を示す組み合わせ：犯人のアリバイの嘘を暴く証拠×2（例：足跡系＋目撃写真）→ is_critical: true
2. 手段を示す組み合わせ：凶器の入手経路を繋ぐ証拠×2（例：原材料＋精製品）→ is_critical: true
3. 動機を示す組み合わせ：犯行動機を確定させる証拠×2〜3（例：書類＋日記）→ is_critical: true
4. 現場証拠の組み合わせ：犯人が現場にいた物証を繋ぐ証拠×2〜3 → is_critical: true

### フィールド定義
- id: ユニークな文字列（例: "combo_garden_intruder"）
- evidence_ids: evidence配列のidから2または3個選択したタプル
- name: 解放されるファクトの短い名前（10〜20文字）。**人物名・固有名詞を含めないこと**。例: "深夜の庭への侵入を示す推理"
- description: ファクトの詳細説明（2〜4文）。**必ず探偵の推理口調で書くこと**（「〜と考えられる」「〜の可能性が高い」「〜と推察される」等の表現を使い、「〜が特定された」「〜が確定した」等の断定表現は使わない）。**人物の固有名詞・氏名・イニシャルを含めないこと**（「ある人物」「館内の誰か」等の一般表現を使う）
- is_critical: boolean（上記基準に従うこと）
- accusation_reaction: is_critical: true の組み合わせに設定することが望ましい（省略可）。告発フェーズでこの推理を突きつけられた時の容疑者の反応（1〜2文）。動揺・言い訳・沈黙を含む自然な反応にすること

JSONのみを返してください。説明文は不要です。
出力するJSONには必ず "main_reasoning_path" フィールドを含めること。
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
- **contradicts_statement_index が設定された evidence_reaction には必ず pursuit_questions を設定すること**（設定漏れはバリデーションエラーになる）
- 犯人（murderer_id: ${scenario.murderer_id}）：contradicts_statement_index が設定された全ての evidence_reaction に pursuit_questions を設定する。チェーンは有罪に繋がる方向で設計する
- **非犯人**：contradicts_statement_index が設定された全ての evidence_reaction に pursuit_questions を設定する。チェーンは容疑者の秘密や事情を明かすが、最終的に「殺してはいない」と証明される方向にする（フェイクリード）

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

### bystander_reactions の追加（犯人の evidence_reaction のみ・省略可）
- 犯人（murderer_id: ${scenario.murderer_id}）の evidence_reactions のうち、contradicts_statement_index が設定されているものに限り、bystander_reactions を設定すること
- 矛盾を追及した瞬間、その場にいる他の容疑者たちが犯人を怪しみ始めるリアクションテキスト
- 設定する容疑者IDは suspects 配列から犯人以外を1〜2名選ぶこと
- テキストは1〜2文。「え、それは…」「まさか、そういうことだったの？」のように、驚き・疑念・動揺を自然に表現すること
- 全員に設定する必要はない。重要な矛盾（最も決定的な証拠）に絞って設定すること

## 出力形式
以下のJSON構造のみを返してください。説明文は不要です。

{
  "pursuit_chains": {
    "{suspect_id}": {
      "{evidence_id}": {
        "wrong_testimony_response": "...",
        "bystander_reactions": [
          { "suspectId": "他容疑者のid", "text": "..." }
        ],
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
  bystander_reactions?: import('../types/scenario').BystanderReaction[]
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
                ...(entry.bystander_reactions?.length && {
                  bystander_reactions: entry.bystander_reactions,
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
  const allCombinations = scenario.evidence_combinations ?? []
  const combinationList =
    allCombinations
      .map(
        (c) =>
          `- ${c.id}: ${c.name}（証拠: ${c.evidence_ids.join(', ')}）${c.is_critical ? ' [is_critical]' : ''}`
      )
      .join('\n') || '（なし）'

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

## 証拠組み合わせ（推理）一覧
${combinationList}

## 告発シーンのフロー
1. プレイヤーが根拠となる証拠品（発見済み推理に含まれるもの）を提示する
2. 容疑者が反論する（evidence_rebuttal）
3. プレイヤーが推理（evidence_combination）を突きつける
4. 提示した証拠を含む推理かつ議論フェーズで犯人追及済みなら → refutation → breakdown → 正解エンド
5. 証拠と推理が噛み合わなければ → wrong_link_rebuttal → Step1に戻る
6. APが尽きると惜敗エンドへ（near_defeat_evidence_text）

## 告発シーンの設計ルール

### 正解ルート（犯人を正しく指名した場合）
- defense_statement: 犯人の最終弁明（3〜5文）。アリバイを主張し無実を訴える。微かな動揺を含め、最後に「証拠があるなら見せてみろ」と挑発で締める
- evidence_rebuttal: 証拠品を提示された直後の反論（1〜2文）。「それが何だと言うんだ」というトーンで余裕を見せつつ動揺を隠す
- wrong_link_rebuttal: 証拠と推理が噛み合わない時の反論（1〜2文）。論理の穴を突いて余裕を見せる
- refutation_text: 汎用フォールバック用ナレーション（2〜3文）。証拠と推理が繋がった瞬間の簡潔な劇的説明。推理固有のナレーションが未設定の場合にのみ使用される
- breakdown_statement: 犯人の崩壊（2〜3文、50〜100字程度）。動揺→観念の流れ。改行で段落を分けること。confession_statement とは異なる内容にすること
- epilogue_text: エンディングの地の文（2〜3文）。事件解決後の静寂・余韻をテーマにした詩的な文章
- near_defeat_evidence_text: 証拠不足型惜敗エンドのナレーション（2〜3文）。探偵が推理の輪を繋げられなかった結末。真犯人が逃げ切る余韻を含む

### 推理固有の論駁ナレーション（combination_refutation_texts）
上記「証拠組み合わせ（推理）一覧」の各組み合わせについて、プレイヤーがその推理で正解ルートに到達した時に表示されるナレーションを設定する。
- 各 combination_id をキーとした辞書形式で出力する
- **is_critical の組み合わせは必ず設定すること**
- is_critical でない組み合わせも可能な範囲で設定すること（省略した場合は refutation_text にフォールバック）
- 各ナレーションは3〜4文。その組み合わせの証拠が具体的に語られるドラマチックな説明にすること
- 探偵が「なぜこの証拠の組み合わせが犯人を指し示すか」を断言調で語る形式
- **人物の固有名詞・氏名を含めてよい**（犯人の名前を含む形での論理の完成を表現すること）

### 不正解ルート（無実の人物を指名した場合）
犯人以外の全容疑者について設定する：
- defense_statement: 誤告発された容疑者の弁明（2〜3文）。キャラの性格を反映した困惑・怒り・抗議
- evidence_rebuttal: 証拠品を提示された直後の反論（1〜2文）。「それが私と何の関係があるのか」というトーン
- wrong_link_rebuttal: 証拠と推理が噛み合わない時の反論（1〜2文）。無実の人物の正当な抗議

### 共通
- near_defeat_wrong_suspect_text: 誤告発型惜敗エンドのナレーション（2〜3文）。探偵が誤った人物を追い続け、真犯人を逃がした結末

## 出力形式
以下のJSON構造のみを返してください。説明文は不要です。

{
  "correct": {
    "defense_statement": "...",
    "evidence_rebuttal": "...",
    "wrong_link_rebuttal": "...",
    "refutation_text": "...",
    "breakdown_statement": "...",
    "epilogue_text": "...",
    "near_defeat_evidence_text": "..."
  },
  "combination_refutation_texts": {
${allCombinations.map((c) => `    "${c.id}": "..."`).join(',\n')}
  },
  "incorrect": {
${scenario.suspects
  .filter((s) => s.id !== scenario.murderer_id)
  .map(
    (s) =>
      `    "${s.id}": { "defense_statement": "...", "evidence_rebuttal": "...", "wrong_link_rebuttal": "..." }`
  )
  .join(',\n')}
  },
  "near_defeat_wrong_suspect_text": "..."
}
`
}

// プレイ可能性チェックのプロンプトを構築する（粗め判定・3点のみ）
function buildPlayabilityPrompt(scenario: Scenario): string {
  const murdererId = scenario.murderer_id
  const murderer = scenario.suspects.find((s) => s.id === murdererId)
  const evidenceNames = scenario.evidence
    .filter((e) => !e.is_fake)
    .map((e) => `- ${e.id}: ${e.name}`)
    .join('\n')
  const suspectNames = scenario.suspects.map((s) => `- ${s.id}: ${s.name}`).join('\n')

  return `
以下のマーダーミステリーシナリオを評価してください。
判定は「明らかに解けないケース」のみNGとする粗めの基準で行うこと。

## シナリオ概要
タイトル: ${scenario.title}
犯人: ${murdererId}（${murderer?.name ?? ''}）
動機: ${scenario.motive}

## 本物の証拠一覧
${evidenceNames}

## 容疑者一覧
${suspectNames}

## 判定する質問（3点）
Q1: 犯人（${murdererId}）を特定できる証拠が最低1つ存在するか。evidence_combinationsまたは単体証拠のどちらでも可。
Q2: 無実の容疑者が全員、アリバイまたは動機なしのいずれかの理由で排除できるか。
Q3: 犯人のアリバイの嘘を暴ける証拠が存在するか（timeline_has_contradictionがtrueの犯人について）。

## 出力形式
JSONのみを返してください。説明文は不要です。
{
  "results": [
    { "question": "Q1", "ok": true, "reason": "..." },
    { "question": "Q2", "ok": true, "reason": "..." },
    { "question": "Q3", "ok": true, "reason": "..." }
  ]
}
`
}

// 生成済みシナリオのプレイ可能性を自己評価させる（3点チェック・粗め判定）
export async function validatePlayability(
  scenario: Scenario,
  apiKey: string
): Promise<{ ok: boolean; failedChecks: string[] }> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  })

  const result = await model.generateContent(buildPlayabilityPrompt(scenario))
  const text = result.response.text()

  let parsed: { results: { question: string; ok: boolean; reason: string }[] }
  try {
    parsed = JSON.parse(text)
  } catch {
    // パース失敗時は通過させる（過剰なリトライ防止）
    return { ok: true, failedChecks: [] }
  }

  const failedChecks = parsed.results.filter((r) => !r.ok).map((r) => `${r.question}: ${r.reason}`)

  return { ok: failedChecks.length === 0, failedChecks }
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
      const accusationParsed = JSON.parse(accusationText) as {
        correct: import('../types/accusation').CorrectAccusationData
        combination_refutation_texts?: Record<string, string>
        incorrect: Record<string, import('../types/accusation').IncorrectAccusationData>
        near_defeat_wrong_suspect_text: string
      }
      if (accusationParsed.correct?.breakdown_statement) {
        const accusationData: import('../types/accusation').AccusationScenarioData = {
          correct: accusationParsed.correct,
          incorrect: accusationParsed.incorrect ?? {},
          near_defeat_wrong_suspect_text: accusationParsed.near_defeat_wrong_suspect_text ?? '',
        }
        // combo個別のrefutation_textをevidence_combinationsにマージ
        const refutationMap = accusationParsed.combination_refutation_texts ?? {}
        const updatedCombinations = (scenario.evidence_combinations ?? []).map((c) =>
          refutationMap[c.id] ? { ...c, refutation_text: refutationMap[c.id] } : c
        )
        scenario = {
          ...scenario,
          accusation_data: accusationData,
          evidence_combinations: updatedCombinations,
        }
      }
    } catch {
      // 告発データのパース失敗時は告発フェーズをスキップ
    }
  }

  return scenario
}
