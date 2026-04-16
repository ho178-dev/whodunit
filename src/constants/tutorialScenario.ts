// チュートリアル専用の練習シナリオ。容疑者2名・証拠3つ・部屋1室の一本道ミニシナリオ
import type { Scenario } from '../types/scenario'

export const TUTORIAL_SCENARIO: Scenario = {
  title: '書斎の夕暮れ',
  synopsis:
    'ある秋の夕暮れ、屋敷の書斎で主人・篠崎清志が倒れているのが発見された。その場にいた二人の中に犯人がいる。探偵として証拠を調べ、犯人を突き止めよう。',
  setting:
    '古い洋館の重厚な書斎。本棚が四方を囲み、革張りの椅子の前で主人が倒れていた。デスクの上には書類が散乱している。',
  murder_time_range: '18:00〜19:00（推定）',
  mansion_background_id: 'mansion_gothic',

  victim: {
    name: '篠崎清志',
    appearance_id: 'male_elderly',
    description: '70代の厳格な資産家。几帳面な性格で知られ、長年使用人を雇い続けてきた。',
    cause_of_death: '鈍器による頭部外傷。書斎の革張り椅子の前で倒れているのを発見された。',
  },

  murderer_id: 'tanaka_ichiro',
  motive: '当日、解雇と遺産相続権の剥奪を同時に告げられ、激情に駆られた。',
  truth:
    '田中一郎は書斎で主人から解雇と遺産剥奪を言い渡された。長年の奉公が全て無駄になると悟った田中は激高し、近くにあった置物で主人を殴打した。その後、自分の手袋をその場に残したまま書斎を後にした。',
  main_reasoning_path:
    '① 血痕のついた手袋のサイズが田中一郎のものと一致 → ② 解雇通知書で動機が判明 → ③ 遺言書の写しと解雇通知書の組み合わせで田中の犯行動機が確定',

  suspects: [
    {
      id: 'nakamura_kenji',
      name: '中村健二',
      appearance_id: 'male_young',
      age: 28,
      occupation: '庭師',
      description:
        '若い庭師。日焼けした顔に疲れと驚きが混じっている。事件を聞いて血の気が引いたようだ。',
      personality: '真面目で口数が少ない。屋敷の仕事に誇りを持っている。',
      alibi:
        '夕方5時から7時まで、屋敷の外の庭園で垣根の剪定作業をしていました。近所の方も見ていたはずです。',
      secret: '特に後ろめたいことはない。旦那様には親切にしてもらっていた。',
      relationship_to_victim: '2年前から雇われた庭師',
      room_id: 'study',
      timeline:
        '15:00 庭作業開始 → 17:00 屋敷外の庭園で垣根剪定 → 19:00 作業終了・帰宅 → 翌朝 事件を聞く',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting:
          '（帽子を手に持ちながら）まさかこんなことになるとは……旦那様には良くしていただいていたのに。',
        statements: [
          'あの日は夕方ずっと外の庭園で作業していました。書斎には近づいていません。',
          '田中さんとはあまり話したことがありません。物静かな方ですが……最近は少し様子が違うように見えていました。',
          '山田さんは気さくで、いつも声をかけてくれます。信頼できる方だと思います。',
          '旦那様の遺産とか相続とか……そういうことは私には関係ないことですから、よく知りません。',
        ],
      },
      default_wrong_pursuit_response: 'すみません、私にはよくわかりません……。',
      evidence_reactions: {
        bloody_glove: {
          reaction: '（首を振って）血が……。こんなものが書斎に。私のものじゃないですよ、絶対に。',
          behavior: 'calm',
        },
        will_copy: {
          reaction: '遺言書ですか。そういうことは……お屋敷の中のことですから、私には縁遠い話です。',
          behavior: 'calm',
        },
        dismissal_notice: {
          reaction: '田中さんが解雇？それは……知りませんでした。最近ピリピリしてた気がしてたけど。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'tanaka_ichiro',
      name: '田中一郎',
      appearance_id: 'male_middle_alt',
      age: 45,
      occupation: '秘書',
      description:
        '落ち着いた物腰の中年男性。几帳面な印象だが、この日は顔色が悪く、目もとに疲れがにじんでいる。',
      personality: '長年の奉公で磨かれた忠実さを持つが、内に抑えきれない怒りを秘めている。',
      alibi: '午後6時半には書斎を出て、以後はずっと自室にいました。書斎には近づいていません。',
      secret: '主人から解雇と遺産剥奪を告げられ、衝動的に犯行に及んだ。',
      relationship_to_victim: '15年間仕えた秘書',
      room_id: 'study',
      timeline: '18:00 書斎に呼ばれる → 18:30 書斎を出る（主張） → 19:00 自室で過ごす（主張）',
      timeline_has_contradiction: true,
      investigation_dialog: {
        greeting: '（うつむいて）……探偵を呼ぶとは。旦那様も、念には念を入れる方でしたね。',
        statements: [
          '旦那様には15年間お仕えしました。こんなことになるとは……ただ、悲しいです。',
          '夕方6時頃、旦那様に書斎に呼ばれました。少しお話して……30分ほどで出ました。その後はずっと自室にいました。',
          '山田さんは長年ここで働かれている方です。真面目で誠実な方ですよ。',
          '（一瞬目が泳ぐ）旦那様との関係は……ごく普通の、主従関係でした。特に問題はありませんでした。',
          'その手袋……見たことがありません。私のものではないです。',
        ],
      },
      default_wrong_pursuit_response: '……（静かに首を振る）その証拠と私には、関係がありません。',
      confession_statement:
        '……そうです。私が……やりました。解雇だけならまだしも、遺産まで全部……あの日限りだと言われて……気が、狂いそうになって……',
      evidence_reactions: {
        bloody_glove: {
          reaction: '……（手が震える）それは……何かの間違いです。私のものではない。',
          behavior: 'nervous',
          contradicts_statement_index: 4,
          pursuit_questions: [
            {
              id: 'tanaka_pq_glove_1',
              text: 'あなたは「その手袋を見たことがない」とおっしゃいましたね。しかしこの手袋の血液は被害者のものと一致しています。どう説明しますか？',
              response: '……（顔色が変わる）そんな……。私は……知らない……',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['tanaka_pq_glove_2'],
            },
            {
              id: 'tanaka_pq_glove_2',
              text: 'さらに、この手袋のサイズはあなたの手に合うと分析されました。',
              response: '……（長い沈黙）……',
              behavior: 'angry',
            },
          ],
        },
        will_copy: {
          reaction:
            '遺言書……（視線を逸らす）旦那様の遺産については……知っていました。以前、約束してくださっていたから。',
          behavior: 'evasive',
          contradicts_statement_index: 3,
          pursuit_questions: [
            {
              id: 'tanaka_pq_will_1',
              text: 'この遺言書を見れば、田中さんへの遺産贈与が全額削除されているとわかります。「旦那様との関係に問題はなかった」とおっしゃいましたが、それは本当ですか？',
              response:
                '……（唇を引き結ぶ）……遺産のことは……知りませんでした。あの日、書斎で初めて……見せられたんです。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['tanaka_pq_will_2'],
            },
            {
              id: 'tanaka_pq_will_2',
              text: '解雇だけでなく、遺産まで取り上げられた。15年間の奉公が全て水の泡になった——そのとき、何を感じましたか？',
              response:
                '……（長い沈黙）……頭の中が……真っ白になりました。あの瞬間のことは……あまり覚えていません。',
              behavior: 'angry',
            },
          ],
        },
        dismissal_notice: {
          reaction: '（ぴくりと反応して）……そんなものが。旦那様は……本気だったのか。',
          behavior: 'evasive',
          contradicts_statement_index: 3,
          pursuit_questions: [
            {
              id: 'tanaka_pq_dismissal_1',
              text: 'この解雇通知書を見て動揺されていますね。「旦那様との関係に問題はなかった」とおっしゃっていましたが。',
              response:
                '……（ため息をつく）わかりました。あの日、書斎で……解雇を言い渡されました。長年仕えてきたのに。',
              behavior: 'sad',
              unlocks_pursuit_question_ids: ['tanaka_pq_dismissal_2'],
            },
            {
              id: 'tanaka_pq_dismissal_2',
              text: 'つまり、解雇を告げられた直後に被害者が亡くなった、ということですね。',
              response: '……（唇を震わせる）……それは……関係ありません。私は……',
              behavior: 'nervous',
            },
          ],
        },
      },
    },
    {
      id: 'yamada_hanako',
      name: '山田花子',
      appearance_id: 'female_middle_alt2',
      age: 52,
      occupation: '家政婦',
      description: '品のある物腰の中年女性。目が赤く腫れており、ずっと泣いていたことがわかる。',
      personality: '誠実で落ち着きがあり、長年の奉公で培った気品がある。',
      alibi: '夕方6時から台所で翌日の食事の準備をしていました。書斎には行っていません。',
      secret: '遺言書に感謝の言葉が記されており、旦那様のことを深く尊敬していた。',
      relationship_to_victim: '20年間仕えた家政婦',
      room_id: 'study',
      timeline:
        '17:00 夕食準備 → 18:00 台所で翌日の下ごしらえ → 19:30 異変に気づき書斎へ → 被害者を発見',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '（深くお辞儀をして）……どうか、真相を明らかにしてください。旦那様のためにも。',
        statements: [
          '旦那様には20年お世話になりました。こんなことになるなんて……（目を拭く）',
          '夕方6時から台所で翌日の食事の準備をしていました。書斎には行っておりません。',
          '田中さんとは最近、あまり話していませんでした。何かご様子が違うように思っていましたが……',
          '7時半頃、書斎が静かすぎることに気づいて確認しに行ったんです。そしたら旦那様が……。',
          '私に怨恨はございません。旦那様は私にとって大切な方でした。',
        ],
      },
      default_wrong_pursuit_response: '申し訳ありません。私にはわかりかねます……',
      evidence_reactions: {
        bloody_glove: {
          reaction:
            'まあ……これは。書斎でこんなものが……（考え込む）田中さんは手が大きい方でしたわ。',
          behavior: 'calm',
        },
        will_copy: {
          reaction:
            '（静かに目を閉じる）……旦那様は私のことを気にかけてくださっていたんですね。それが今は、ただ悲しくて……',
          behavior: 'sad',
        },
        dismissal_notice: {
          reaction: '（息を呑む）解雇通知……田中さんが？それは存じませんでした。お気の毒に……',
          behavior: 'calm',
        },
      },
    },
  ],

  rooms: [
    {
      id: 'study',
      name: '書斎',
      type_id: 'study',
      description:
        '重厚な本棚が四方を囲む静謐な書斎。革張りの椅子の前で主人・篠崎清志が倒れていた。デスクの上には書類が散乱しており、何かを急いで探したような痕跡がある。',
      evidence_ids: ['bloody_glove', 'will_copy', 'dismissal_notice'],
    },
  ],

  evidence: [
    {
      id: 'bloody_glove',
      name: '血痕のついた手袋',
      category_id: 'clothing',
      description: '革製の黒い手袋（右手のみ）。甲の部分に赤黒い染みがある。書斎の隅に落ちていた。',
      is_fake: false,
      relevance: '犯人が犯行時に使用した可能性が高い。',
      examination_notes:
        '手袋に付着した血液は被害者のものと一致する。成人男性用のサイズで、手首内側には汗染みを拭き取ったような痕跡がある。このサイズは田中一郎の手に合う。',
    },
    {
      id: 'will_copy',
      name: '遺言書の写し',
      category_id: 'document_contract',
      description: '篠崎家の遺言書のコピー。いくつかの修正箇所がある。',
      is_fake: false,
      relevance: '被害者の財産配分を示す文書。',
      examination_notes:
        '最新版の遺言書では、田中一郎への遺産贈与が全額削除されている。代わりに山田花子への感謝金が明記されている。修正は事件の約1週間前に行われたことがわかる。',
    },
    {
      id: 'dismissal_notice',
      name: '解雇通知書',
      category_id: 'document_letter',
      description:
        '篠崎清志の署名入りの書状。「本日をもって田中一郎の雇用を終了する」と記されている。',
      is_fake: false,
      relevance: '田中の解雇を証明する文書。',
      examination_notes:
        '日付は事件当日。解雇理由として「職務上の問題行動」が記載されている。同日に遺言書の修正が行われたことと照らし合わせると、田中が全てを失った日であることがわかる。',
    },
  ],

  evidence_combinations: [
    {
      id: 'combo_full_truth',
      evidence_ids: ['bloody_glove', 'will_copy', 'dismissal_notice'],
      name: '三つの証拠が示す真実',
      description:
        '血痕のついた手袋（犯行の痕跡）、遺言書の写し（遺産剥奪）、解雇通知書（解雇）——三つの証拠が一本の線で繋がった。田中一郎は当日、全てを失うと知り、激情に駆られて犯行に及んだ。',
      is_critical: true,
      refutation_text:
        '手袋・遺言書・解雇通知書。三つの証拠が田中一郎の動機と犯行を完全に証明した。',
    },
  ],

  accusation_data: {
    correct: {
      defense_statement: '……私が犯人だと？根拠を示してください。',
      evidence_rebuttal: '……状況証拠だけでは、人を裁けませんよ。',
      wrong_link_rebuttal:
        '（静かに首を振る）……証拠と私の間に、論理的な繋がりがまだ証明されていません。',
      refutation_text: '血痕のついた手袋と解雇通知書。田中一郎の嘘が崩れ去った。',
      breakdown_statement:
        '……（長い沈黙の後）……そうです。私が……やりました。解雇だけならまだしも、遺産まで全部……あの日限りだと言われて……気が、狂いそうになって……',
      epilogue_text: '長年の忠義が、一日で裏切られた。怒りは、取り返しのつかない結末を招いた。',
      escape_statement: '証拠が足りません。私を有罪にするには、もっと確かな証拠が必要です。',
      near_defeat_evidence_text:
        '探偵は真相に手が届く場所まで来ていた——しかし、証拠の繋がりを示すことができなかった。',
    },
    incorrect: {
      yamada_hanako: {
        defense_statement: '……私が？旦那様に20年仕えてきた私が……なぜそのようなことを。',
        evidence_rebuttal: '……その証拠と私には、何の関係もございません。',
        wrong_link_rebuttal: '（静かに首を振って）……論理が繋がっていないように思います。',
        defeat_statement:
          '（涙ぐんで）……信じていただけましたか。私は……旦那様のことを、心から大切に思っていたんです。',
      },
      nakamura_kenji: {
        defense_statement: '（目を見開いて）え……私が？書斎にも近づいていないのに、どうして。',
        evidence_rebuttal:
          '……その証拠は私とは全く関係ありません。あの時間、ずっと外にいたんですから。',
        wrong_link_rebuttal:
          '（首を振って）……繋がりが見えません。私には動機もなければ機会もなかった。',
        defeat_statement:
          '（ほっとした様子で）……信じてもらえましたか。ただ庭師として働いていただけなのに、怖かった。',
      },
    },
    near_defeat_wrong_suspect_text: '探偵は真犯人に迫れなかった。田中一郎は静かに館を後にした。',
  },
}
