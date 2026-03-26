// 固定シナリオ2「霧の密室」（絞殺×密室×孤島）
import type { Scenario } from '../types/scenario'
import type { AccusationScenarioData } from '../types/accusation'

// 「霧の密室」告発シーンデータ
const FIXED_ACCUSATION_DATA_2: AccusationScenarioData = {
  correct: {
    defense_statement:
      '……西村が犯人？ 馬鹿げている。私は22時以降ずっと書斎にいた。会長の部屋には近づいていない。マスターキーは借りているが、昨夜は使っていない。——証拠があるなら、見せてもらおうか。',
    decisive_evidence_id: 'ledger_copy',
    wrong_evidence_reaction:
      '……それが私を追い詰める証拠になるとでも？ 甘い見立てだ。もっと核心を突くものを持ってきてほしい。',
    refutation_text:
      '横領帳簿のコピーには、西村の承認印と照合可能な特殊なインクの痕跡が残っていた。白河会長はこの写しを金庫に隠し、翌朝弁護士に提出する予定だった。西村がこの帳簿の存在を知っていたのは、金庫の鍵を所持する経理部長という立場があったからだ。そして「帳簿は存在しないはずだ」という反応が、実物を知っていた者でなければ出てこない言葉だった。',
    breakdown_statement:
      '（西村の表情が崩れ、長い沈黙が続く）\n……そうだ。先生は全てを知っていた。15年間、少しずつ……。あの夜、先生に呼ばれた。「明日、弁護士に渡す」と言われた瞬間、全てが終わると思った。\n……絹の紐は、カーテンを留めるものだった。気がついたら、握っていた。窓から出て、外から鍵を閉めた。それだけだ。',
    escape_statement:
      '（西村は薄く笑みを浮かべる）\n……状況証拠だけで人を裁けると思っているのか？ このカフスボタンが私のものという証明は？ 足跡のサイズが一致するだけでは有罪にはならない。\n——私はここを去らせてもらう。止める根拠が、あなたにはない。',
  },
  incorrect: {
    shirakawa_nanami: {
      confusion_statement:
        '……私が父を？ 確かに遺産の件で揉めていたけれど、だからって殺すなんて……！ 美咲と同室だったことを確認してください！',
      alibi_reveal:
        '白河七海は父との遺産争いで動機があるように見えたが、22時以降は加賀美咲と同室で就寝しており、アリバイは完全に立証されている。また、密室を成立させるマスターキーへのアクセス手段を持っていなかった。真犯人は——別にいる。',
    },
    ozawa_ryota: {
      confusion_statement:
        '……え、僕が？ 会長には本当にお世話になっていて、殺す理由なんて……！ 藤田さんと一緒に図書室にいたことを確認してください！',
      alibi_reveal:
        '尾崎良太は被害者の秘書として書類を扱っていたが、横領帳簿への直接のアクセス権限はなかった。藤田奈緒が22時まで図書室で同席していたことを証言しており、犯行推定時刻中のアリバイが成立する。真犯人は——別にいる。',
    },
    fujita_nao: {
      confusion_statement:
        '……私を疑っているの？ 確かに昔の関係は複雑だったけれど、今は仕事上の付き合いよ。動機がないのよ。',
      alibi_reveal:
        '藤田奈緒は元愛人として動機を疑われたが、遺言書への記載はなく金銭的利益がない。22時まで図書室で尾崎と同席しており、犯行推定時刻のアリバイが複数の証言で裏付けられる。真犯人は——別にいる。',
    },
    tanaka_goro: {
      confusion_statement:
        '……わしが啓一を？ 50年来の友人だぞ！ それにこの老体に、あんな力業ができると思うか！',
      alibi_reveal:
        '田中吾郎は旧友として財閥に関わっていたが、横領には無関係だった。高齢による体力的制約があり、素手での絞殺は医師の見解として困難と判断される。ダイニングでの飲酒は複数の従業員が深夜まで証言している。真犯人は——別にいる。',
    },
    kagawa_misaki: {
      confusion_statement:
        'え……私が！？ おじいちゃんを……？ そんなこと絶対にしていません！ 七海おばさんと一緒にいたことを聞いてください！',
      alibi_reveal:
        '加賀美咲は遺産の相続人の一人だったが、遺言書の詳細を知らされていなかった。白河七海と同室で就寝しており、22時以降の行動は完全に証明されている。真犯人は——別にいる。',
    },
  },
}

// 固定シナリオ2「霧の密室」
export const FIXED_SCENARIO_2: Scenario = {
  title: '霧の密室',
  synopsis:
    '霧に閉ざされた孤島の古城ホテルで開かれた白河財閥の親族会議。翌朝、会長の白河啓一が塔の寝室で絞殺体となって発見された——しかも扉も窓も内側から施錠された密室の中で。嵐により本土との連絡は絶たれ、6名の参加者はこの島に閉じ込められたまま互いを疑い続ける。',
  setting:
    '日本海の孤島に建つ白河財閥所有の古城ホテル。16世紀ヨーロッパの城を模した石造りの建物は、霧の中に塔のシルエットを浮かべる。昨晩から続く嵐で定期船は欠航し、無線も通じない完全孤立状態だ。城内には複数の棟が渡り廊下で繋がり、深夜は従業員も退館するため参加者だけが残される。会長が密室で命を絶たれた今、犯人はこの濃霧の城の中にいる。',
  mansion_background_id: 'mansion_gothic',
  murder_time_range: '23:00〜02:00（推定）',
  victim: {
    name: '白河啓一',
    appearance_id: 'male_elderly',
    description:
      '70代の実業家。白髪の紳士で温厚な印象だが、経営判断は冷徹。最近、社内の不正調査を進めていた。',
    cause_of_death: '絹の紐による絞殺。密室状態の塔の寝室で発見。',
  },
  murderer_id: 'nishimura_kenji',
  motive: '15年にわたる横領が会長に発覚し、翌朝弁護士に証拠書類を渡されることを阻止するため。',
  truth:
    '西村健二は白河財閥の経理部長として15年間横領を続けていた。会長がその証拠（横領帳簿のコピー）を翌朝弁護士に提出すると告げたため、深夜に合鍵で部屋へ侵入してカーテンの絹紐で絞殺した。その後、窓から脱出して外側から工具で施錠し密室を偽装。廊下を通って書斎に戻ったが、廊下の泥足跡とカフスボタンの落とし忘れが決定的証拠となった。',
  suspects: [
    {
      id: 'nishimura_kenji',
      name: '西村健二',
      appearance_id: 'male_middle',
      age: 48,
      occupation: '白河財閥 経理部長',
      description:
        '中肉中背の中年男性。眼鏡をかけ、几帳面な印象。常に落ち着いているが、今夜は微かに汗ばんでいる。',
      personality: '几帳面で緻密。冷静を装うが内心は常に計算している。',
      alibi: '23時以降は書斎で資料整理をしていたと主張。',
      secret: '15年間にわたる横領総額は3億円を超える。証拠書類の存在を会長から直接告げられていた。',
      relationship_to_victim: '経理部長。20年来の信頼関係にあったが、実際は横領を続けていた。',
      room_id: 'room_study',
      timeline:
        '21:00 食後に書斎へ → 会長に呼び出され寝室棟へ向かう（時刻を明かさない） → 23:30 書斎に戻ったと主張',
      timeline_has_contradiction: true,
      investigation_dialog: {
        greeting:
          '（静かに立ち上がって）……調査ですか。私は白河財閥の経理部長・西村と申します。20年間お仕えしてきた会長が……本当に信じられない。何でもお聞きください。',
        statements: [
          '会長の死は——信じられません。厳しくも公正な方で、長年私を支えてくださった。こんな形でお別れするとは……。',
          '昨晩22時以降は書斎で資料整理をしていました。翌日の会議に向けた準備です。一度も書斎を出ていない——これは断言できます。',
          'マスターキーは事務局から借りています。経理担当として各部屋の書類を確認する必要があるため。ただし昨夜は一切使っていません。',
          '廊下で足音を聞いたという話が出ているようですが……この城は石造りで音が反響します。足音の主が誰かは特定できないはずです。',
          '横領？（表情が揺らぐ）……馬鹿げている。20年間、清廉に仕事をしてきた。帳簿を隅々まで調べれば分かることです。',
        ],
      },
      default_wrong_pursuit_response:
        'その証拠と私の行動を結びつけるのは論理の飛躍があるように思います。',
      evidence_reactions: {
        silk_cord: {
          reaction: '……絹の紐ですか。カーテンの飾り紐ですね。私には関係ない。',
          behavior: 'evasive',
        },
        ledger_copy: {
          reaction: '……それは……どこから出てきたんですか。そんなものは存在しないはずだ。',
          behavior: 'nervous',
          contradicts_statement_index: 4,
          wrong_testimony_response:
            'その証言と帳簿内容の矛盾を直接示すのは難しいのではありませんか。',
          pursuit_questions: [
            {
              id: 'nishimura_pq_ledger_1',
              text: 'あなたは「帳簿を調べれば分かる」とおっしゃいましたね。ではなぜこの帳簿の写しの存在に「そんなものは存在しないはず」と反応したのですか？',
              response:
                '……（眼鏡を外す）誰かが捏造した可能性を考えたんです。私の承認印を偽造することはできますから。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['nishimura_pq_ledger_2'],
            },
            {
              id: 'nishimura_pq_ledger_2',
              text: '会長は翌朝この帳簿を弁護士に渡す予定でした。そのことをご存じでしたか？',
              response:
                '（顔色が変わる）……知らなかった。……知るはずがない。……会長からそんな話は……。',
              behavior: 'evasive',
            },
          ],
        },
        window_tool: {
          reaction: '窓の傷跡ですか。古い建物なので、そういった傷はどこにでも……。',
          behavior: 'evasive',
        },
        mud_print: {
          reaction: '……泥足跡？ 廊下を歩いた人間は複数います。なぜ私のものと断定できるのですか。',
          behavior: 'nervous',
          contradicts_statement_index: 1,
          wrong_testimony_response: '足跡の位置と私の証言を結びつけるのは飛躍があります。',
          pursuit_questions: [
            {
              id: 'nishimura_pq_mud_1',
              text: 'あなたは「23時以降は書斎から一度も出ていない」とおっしゃいましたね。ではなぜ書斎から寝室棟への廊下にこの泥足跡が残っているのですか？',
              response: '……（沈黙）……この城は廊下が繋がっています。私以外の誰かが歩いたはずです。',
              behavior: 'angry',
              unlocks_pursuit_question_ids: ['nishimura_pq_mud_2'],
            },
            {
              id: 'nishimura_pq_mud_2',
              text: '足跡の靴底パターンと26.5cmのサイズを確認させてください。あなたの革靴と比較したい。',
              response: '（顔が青ざめる）……それは偶然の一致に過ぎない。私は書斎から出ていない。',
              behavior: 'nervous',
            },
          ],
        },
        cufflink_gold: {
          reaction: '……金のカフスボタン？ 似たものを持っている方は多いでしょう。',
          behavior: 'evasive',
        },
        victim_note: {
          reaction: '……会長のメモですか。筆跡は間違いなく会長のものですね。',
          behavior: 'calm',
        },
        master_key: {
          reaction:
            'マスターキーは事務局から貸し出されているものです。借りていますが使っていません。',
          behavior: 'evasive',
        },
        bruise_photo: {
          reaction: '……痛ましい写真ですね。会長がこんな形で……。',
          behavior: 'sad',
        },
        receipt_hidden: {
          reaction: '……それは何ですか。私には関係のないものに見えますが。',
          behavior: 'evasive',
        },
        broken_vase: {
          reaction: '花瓶は以前から割れていたと聞いています。格闘の痕跡ではないでしょう。',
          behavior: 'calm',
        },
        wine_glass_2: {
          reaction: 'グラスが2つ？ 会長はよくお客を招いて飲まれていましたから。',
          behavior: 'calm',
        },
        torn_letter: {
          reaction: '破られた手紙ですか。会長は不要な書類はすぐ破棄される方でした。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'shirakawa_nanami',
      name: '白河七海',
      appearance_id: 'female_young',
      age: 35,
      occupation: '白河財閥 取締役（会長の娘）',
      description: '30代の知的な女性。父に似た鋭い目を持つが、今は悲しみで充血している。',
      personality: '聡明で意志が強い。父との関係は複雑で、遺産を巡り対立していた。',
      alibi: '22時以降は加賀美咲と同室で就寝していたと主張。',
      secret:
        '父から遺産の大幅削減を告げられており動機があるように見えるが、実際は父を深く愛していた。',
      relationship_to_victim: '娘。経営方針を巡り対立していたが、父の死に最も動揺している。',
      room_id: 'room_hallway',
      timeline: '21:00 夕食後 → 22:00 加賀美咲と同室へ戻る → 翌朝まで就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '……父のことで色々聞かれているようですね。私もできる限り協力します。',
        statements: [
          '父とは遺産の件で揉めていました。でもそれは家族の問題です。殺す理由にはなりません。',
          '22時以降は美咲と同室でした。朝まで一緒でしたよ。',
          '西村さんが深夜に廊下を歩いているのを見たような気がします。でもはっきりとは確認していません。',
          '父が横領を調査していたことは最近知りました。誰かが密告したと言っていました。',
          'マスターキーは西村さんが持っていると聞いています。彼だけが自由に部屋を出入りできます。',
        ],
      },
      default_wrong_pursuit_response:
        'その証拠が私の行動と結びつくとは思えません。もう少し論理的に考えてください。',
      evidence_reactions: {
        silk_cord: {
          reaction: '……カーテンの紐ですね。父の部屋のものでしょうか。',
          behavior: 'sad',
        },
        ledger_copy: {
          reaction: '……これが父の言っていた証拠書類ですか。やはり横領は本当だったんですね。',
          behavior: 'calm',
          contradicts_statement_index: 3,
          wrong_testimony_response: 'その証言と帳簿の内容を私と結びつけるのは無理があります。',
          pursuit_questions: [
            {
              id: 'nanami_pq_ledger_1',
              text: 'あなたは「横領を調査していることは最近知った」とおっしゃいましたね。この帳簿のコピーを事前に見ていた可能性はありますか？',
              response: '……見ていません。父は書類を金庫に入れていましたから。',
              behavior: 'calm',
              unlocks_pursuit_question_ids: ['nanami_pq_ledger_2'],
            },
            {
              id: 'nanami_pq_ledger_2',
              text: '金庫の存在をご存じだったのですね。金庫の鍵はどなたが持っていましたか？',
              response: '父と、緊急用として西村さんが一本持っていたはずです。私は持っていません。',
              behavior: 'calm',
            },
          ],
        },
        window_tool: {
          reaction: '……窓に工具の傷が？ 誰かが外から施錠操作をしたのかもしれません。',
          behavior: 'nervous',
        },
        mud_print: {
          reaction: '廊下の泥足跡ですか。私の部屋は別の棟なので、ここには来ていません。',
          behavior: 'calm',
        },
        cufflink_gold: { reaction: 'これは……男性用のカフスボタンですね。', behavior: 'calm' },
        victim_note: {
          reaction: '……父の字ですね。「K・N 横領確認済」……西村さんのイニシャル。',
          behavior: 'nervous',
        },
        master_key: {
          reaction: '西村さんが持っていると聞いています。経理の仕事で必要だそうで。',
          behavior: 'calm',
        },
        bruise_photo: { reaction: '（顔を背ける）……見せないでください。父が……。', behavior: 'sad' },
        receipt_hidden: {
          reaction: '……これは隠し口座の明細ですか。横領の証拠になりますね。',
          behavior: 'calm',
        },
        broken_vase: {
          reaction: '花瓶はもとから割れていたと聞きました。格闘ではないと思います。',
          behavior: 'calm',
        },
        wine_glass_2: {
          reaction: 'グラスが2つあるということは、誰かを招いていたのかもしれません。',
          behavior: 'calm',
        },
        torn_letter: {
          reaction: '破られた手紙……父は不要な書類はすぐ破棄していましたから。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'ozawa_ryota',
      name: '尾崎良太',
      appearance_id: 'male_young',
      age: 28,
      occupation: '会長付き秘書',
      description: '20代後半の誠実そうな青年。メモ帳を常に携帯し、何事も記録する癖がある。',
      personality: '几帳面で誠実。被害者を尊敬しており、今回の調査に協力的。',
      alibi: '22時まで図書室で藤田と共に議事録を作成していたと主張。',
      secret: '被害者の横領調査を水面下で手伝っており、証拠収集に協力していた。',
      relationship_to_victim: '個人秘書。強い信頼関係にあり、横領調査の協力者だった。',
      room_id: 'room_library',
      timeline: '20:00 夕食 → 21:00 図書室で藤田と議事録作業 → 22:00 自室へ → 就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '会長の死は……本当に残念です。私はできる限り捜査に協力します。',
        statements: [
          '会長から横領調査を頼まれていました。西村さんの経理書類に不審な点があると言われて。',
          '22時まで図書室で藤田さんと一緒に作業をしていました。その後は自室に戻りました。',
          '西村さんがマスターキーを持っていることは館の従業員から聞いていました。',
          '昨夜、廊下で誰かが急ぎ足で歩く音を聞きました。23時頃だったと思います。',
          '会長は翌朝、重要な発表をすると言っていました。きっと横領の件だったはずです。',
        ],
      },
      default_wrong_pursuit_response:
        'その点については私も気になっていましたが、直接の関連は見えないですね。',
      evidence_reactions: {
        silk_cord: {
          reaction: '……絞殺に使われた紐ですか。カーテンの飾り紐ですね。',
          behavior: 'sad',
        },
        ledger_copy: {
          reaction: 'これが会長の言っていた証拠書類ですか！ 西村さんの承認印がありますね。',
          behavior: 'nervous',
        },
        window_tool: {
          reaction: '工具の傷跡……密室を作るために使ったのかもしれません。',
          behavior: 'calm',
        },
        mud_print: {
          reaction: 'この足跡のサイズ……26センチ台後半ですね。西村さんの靴に近い気がします。',
          behavior: 'calm',
          contradicts_statement_index: 3,
          wrong_testimony_response: 'その証言と足跡の位置を結びつけるのは少し難しいですね。',
          pursuit_questions: [
            {
              id: 'ozawa_pq_mud_1',
              text: 'あなたは「廊下で誰かが急ぎ足で歩く音を聞いた」とおっしゃいましたね。その人物の方向はどちらでしたか？',
              response:
                '……寝室棟の方向でした。23時頃に足音が行って、しばらくして戻ってきた気がします。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['ozawa_pq_mud_2'],
            },
            {
              id: 'ozawa_pq_mud_2',
              text: 'その足音の主を直接確認しましたか？',
              response: 'ドアの隙間から少し見えました。眼鏡をかけた男性の後ろ姿だったと思います。',
              behavior: 'calm',
            },
          ],
        },
        cufflink_gold: {
          reaction: '金のカフスボタン……西村さんがよく着けているタイプに見えます。',
          behavior: 'calm',
        },
        victim_note: {
          reaction: '会長が残したメモですね。「K・N」……西村さんのイニシャルに違いありません。',
          behavior: 'nervous',
        },
        master_key: {
          reaction: 'これが問題のマスターキーですか。西村さんが持っていたものですね。',
          behavior: 'calm',
        },
        bruise_photo: { reaction: '……（目を背ける）会長が……。', behavior: 'sad' },
        receipt_hidden: {
          reaction: '入金明細……これは横領の資金移動の記録です。会長が収集していた証拠の一つです。',
          behavior: 'calm',
        },
        broken_vase: {
          reaction: '花瓶はもとから割れていたそうです。格闘の痕跡ではないと思います。',
          behavior: 'calm',
        },
        wine_glass_2: {
          reaction: 'グラスが2つ……会長は誰かを部屋に招いていたのかもしれません。',
          behavior: 'calm',
        },
        torn_letter: {
          reaction: '破られた手紙……内容は確認できますか？ 重要な情報があるかもしれません。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'fujita_nao',
      name: '藤田奈緒',
      appearance_id: 'female_middle',
      age: 45,
      occupation: '経営コンサルタント（元愛人）',
      description:
        '40代の洗練された女性。落ち着いた物腰だが、昔の関係についての質問には敏感に反応する。',
      personality: '冷静かつ観察眼が鋭い。過去の関係を利用して自分の立場を守ろうとする。',
      alibi: '22時まで図書室で尾崎と共に作業していたと主張。',
      secret: '過去の愛人関係を清算する代わりにコンサルタント契約を結んでいた。',
      relationship_to_victim: 'コンサルタント兼元愛人。現在は仕事上の関係のみ。',
      room_id: 'room_library',
      timeline: '20:00 夕食 → 21:00 図書室で尾崎と作業 → 22:00 自室へ → 就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: 'コンサルタントとして今回の件は大変残念に思っています。協力できることがあれば。',
        statements: [
          '私と会長の過去の関係は整理がついています。現在は純粋にビジネスの付き合いです。',
          '22時まで図書室で尾崎さんと一緒に書類作業をしていました。それが私のアリバイです。',
          '西村さんの経理処理には以前から不審な点がありました。コンサルタントとして指摘したこともあります。',
          '昨夜、部屋の窓の外で物音がしたような気がしました。錯覚かもしれませんが。',
          '会長は誰かに命を狙われていると私に言っていました。一週間前のことです。',
        ],
      },
      default_wrong_pursuit_response:
        'おっしゃることは理解しますが、それが私と直接関係するとは思えません。',
      evidence_reactions: {
        silk_cord: { reaction: '……絹の紐。凶器になるとは……。', behavior: 'sad' },
        ledger_copy: {
          reaction: '……やはり。西村さんの経理には以前から不自然な点があったんです。',
          behavior: 'calm',
        },
        window_tool: {
          reaction: '窓の傷跡……外側から施錠操作をした痕跡でしょうか。',
          behavior: 'calm',
        },
        mud_print: {
          reaction: '泥足跡ですか。私の部屋は別の棟なので、この廊下は通っていません。',
          behavior: 'calm',
        },
        cufflink_gold: {
          reaction: 'これは……西村さんがいつもつけているカフスボタンに似ています。片方だけですね。',
          behavior: 'nervous',
          contradicts_statement_index: 2,
          wrong_testimony_response: 'そのカフスボタンと私の証言の間に矛盾はないと思いますが。',
          pursuit_questions: [
            {
              id: 'fujita_pq_cufflink_1',
              text: 'あなたは「西村さんの経理に不審な点があり指摘したことがある」とおっしゃいましたね。西村さんとは個人的に話すこともありましたか？',
              response:
                '……ビジネス上の会話はありました。彼はいつもこのタイプのカフスボタンをしていましたよ。',
              behavior: 'calm',
              unlocks_pursuit_question_ids: ['fujita_pq_cufflink_2'],
            },
            {
              id: 'fujita_pq_cufflink_2',
              text: '被害者の部屋で発見されたこのカフスボタンが西村さんのものだとすれば、何を意味すると思いますか？',
              response:
                '……（少し間を置いて）西村さんが昨夜、会長の部屋にいたということになりますね。',
              behavior: 'nervous',
            },
          ],
        },
        victim_note: {
          reaction: '「K・N 横領確認済」……西村健二のイニシャルですね。これは決定的では？',
          behavior: 'nervous',
        },
        master_key: {
          reaction: 'マスターキーですか。これがあれば密室を作ることができますね。',
          behavior: 'calm',
        },
        bruise_photo: { reaction: '……絞殺の痕跡ですね。苦しかったでしょうに。', behavior: 'sad' },
        receipt_hidden: {
          reaction: '隠し口座の入金明細……横領した資金の流れですね。証拠として十分です。',
          behavior: 'calm',
        },
        broken_vase: {
          reaction: '花瓶はもともと割れていたと聞いています。関係ないでしょう。',
          behavior: 'calm',
        },
        wine_glass_2: {
          reaction: 'グラスが2つ……被害者は誰かと話していたのかもしれませんね。',
          behavior: 'calm',
        },
        torn_letter: {
          reaction: '破られた手紙……無関係かもしれませんが内容が気になります。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'tanaka_goro',
      name: '田中吾郎',
      appearance_id: 'male_middle_alt',
      age: 72,
      occupation: '元実業家（白河財閥の旧共同経営者）',
      description:
        '70代の老紳士。白髪を整え、杖をついている。温厚な性格で今回の事件に心底困惑している。',
      personality: '温厚で真直ぐ。嘘をつくことが苦手で、感情が顔に出やすい。',
      alibi: 'ダイニングで飲酒しており、深夜まで複数の証人がいると主張。',
      secret: '30年前に財閥を退いた後、資金繰りに困っており被害者に援助を求めるつもりだった。',
      relationship_to_victim: '50年来の旧友兼元共同経営者。深い信頼関係にあった。',
      room_id: 'room_dining',
      timeline: '20:00 夕食 → 21:30 ダイニングで飲酒 → 翌02:00まで複数人と歓談 → 就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '啓一が死ぬとは……50年来の友人を失った。犯人を探す手伝いならいくらでもする。',
        statements: [
          '啓一とは50年の仲だ。こんな形で別れるとは思わなかった。',
          '昨夜はダイニングで21時半から翌2時まで酒を飲んでいた。従業員も複数人いた。',
          '西村という男は昔から気に入らなかった。目が笑っていない。啓一には忠告したこともあった。',
          '今回の会議は財産整理の話だと啓一から聞いていた。横領の件は知らなかった。',
          '私の体ではとても人を絞め殺せんよ。この腰と膝では無理だ。',
        ],
      },
      default_wrong_pursuit_response:
        'それは私には関係のないことのように思えますが、どういう意味ですか？',
      evidence_reactions: {
        silk_cord: { reaction: '……これで啓一を……。許せんな。', behavior: 'angry' },
        ledger_copy: {
          reaction: '西村の横領帳簿か。啓一が調べていたのはこれか……。',
          behavior: 'angry',
        },
        window_tool: {
          reaction: '窓に傷が……。密室を作ったということか。巧妙な手口だ。',
          behavior: 'calm',
        },
        mud_print: {
          reaction: '私はダイニングからほとんど動いていない。この足跡は私のものではない。',
          behavior: 'calm',
        },
        cufflink_gold: {
          reaction: 'カフスボタン……西村が会議でいつもつけているものと似ているな。',
          behavior: 'calm',
        },
        victim_note: {
          reaction: '啓一の字じゃ。「K・N」……西村健二か。確信を持っていたんだな。',
          behavior: 'angry',
        },
        master_key: {
          reaction: 'マスターキーか。誰が持っているんだ？',
          behavior: 'calm',
          contradicts_statement_index: 3,
          wrong_testimony_response: 'マスターキーと私の証言の矛盾点が分からない。',
          pursuit_questions: [
            {
              id: 'tanaka_pq_key_1',
              text: 'あなたは「横領の件は知らなかった」とおっしゃいましたが、西村さんがマスターキーを持っていることはご存じでしたか？',
              response:
                '……いや、それは知らなかった。経理部長がなぜ合鍵を……。それは問題じゃないのか？',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['tanaka_pq_key_2'],
            },
            {
              id: 'tanaka_pq_key_2',
              text: '合鍵があれば密室を偽装できます。この鍵が犯行の核心だと思いますか？',
              response:
                '……そういうことか。西村は啓一の部屋に入り、絞め殺した後、窓から出て施錠して密室を作った。あいつがやったんだ。',
              behavior: 'angry',
            },
          ],
        },
        receipt_hidden: { reaction: '隠し口座か……啓一が怒るわけだ。', behavior: 'angry' },
        bruise_photo: { reaction: '（目を背ける）見せてくれるな……。', behavior: 'sad' },
        broken_vase: {
          reaction: '花瓶はもともと割れていたそうだ。関係ないだろう。',
          behavior: 'calm',
        },
        wine_glass_2: { reaction: 'グラスが2つ……啓一は誰かを招いていたのか。', behavior: 'calm' },
        torn_letter: {
          reaction: '破られた手紙か。内容は分からんが関係ないじゃろうな。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'kagawa_misaki',
      name: '加賀美咲',
      appearance_id: 'female_teen',
      age: 19,
      occupation: '大学生（会長の孫）',
      description: '10代後半の活発な女性。祖父を慕っており、涙をこらえながら話している。',
      personality: '率直で感情豊か。嘘をつくことが苦手で、思ったことをすぐ口に出す。',
      alibi: '22時以降は七海と同室で就寝していたと主張。',
      secret:
        '遺産相続について「大学卒業まで待て」と言われており不満を漏らしていたが、動機にはならない。',
      relationship_to_victim: '孫娘。祖父を深く慕っていた。',
      room_id: 'room_hallway',
      timeline: '20:00 夕食 → 21:30 七海と雑談 → 22:00 同室で就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: 'おじいちゃんが……。犯人を絶対に見つけてください。私も何でも話します。',
        statements: [
          'おじいちゃんのことは大好きだった。遺産のことで愚痴ったこともあったけど、本当の気持ちじゃなかった。',
          '七海おばさんと22時に部屋に戻って、朝まで一緒にいました。',
          '夜中に廊下で足音を聞いたような気がします。でもすぐに眠ってしまったので……。',
          '西村さんって、なんか怖いです。目が冷たくて。昨夜も何か考え込んでいるみたいでした。',
          'おじいちゃんが「誰かを信用できなくなってしまった」と言っていたのを聞いてしまいました。',
        ],
      },
      default_wrong_pursuit_response: 'えっと……それが私と関係あるんですか？ よく分からないです。',
      evidence_reactions: {
        silk_cord: { reaction: 'これで……おじいちゃんを……。（涙をこらえる）', behavior: 'sad' },
        ledger_copy: {
          reaction: 'お金の書類ですか。私には難しくてよく分からないです。',
          behavior: 'calm',
        },
        window_tool: {
          reaction: '窓の傷跡……誰かが外から施錠したんですか？',
          behavior: 'nervous',
        },
        mud_print: {
          reaction: '泥足跡ですか。私は22時以降は部屋にいたので、ここには来ていません。',
          behavior: 'calm',
        },
        cufflink_gold: {
          reaction: '金のカフスボタン……きれいですね。でも片方だけって変ですね。',
          behavior: 'calm',
        },
        victim_note: {
          reaction: '「K・N」……これって誰のイニシャルですか？ おじいちゃんのメモ？',
          behavior: 'nervous',
        },
        master_key: {
          reaction: '合鍵……全部の部屋に入れる鍵ですよね。怖いな。',
          behavior: 'nervous',
        },
        bruise_photo: { reaction: '（顔を背ける）見たくないです……。', behavior: 'sad' },
        receipt_hidden: {
          reaction: '入金明細……数字がいっぱい。これって悪いことに使われたお金ですか？',
          behavior: 'calm',
          contradicts_statement_index: 4,
          wrong_testimony_response: 'その証言とこの明細書の関係がよく分かりません。',
          pursuit_questions: [
            {
              id: 'kagawa_pq_receipt_1',
              text: 'あなたは「おじいちゃんが誰かを信用できなくなった」とおっしゃいましたね。それはいつ、どんな状況で聞きましたか？',
              response:
                '一週間前に電話で話したとき。「身近な人間を信用できなくなってしまった」って……。すごく辛そうでした。',
              behavior: 'sad',
              unlocks_pursuit_question_ids: ['kagawa_pq_receipt_2'],
            },
            {
              id: 'kagawa_pq_receipt_2',
              text: 'その「信用できない身近な人間」が経営に関わる人物だとしたら、誰が思い当たりますか？',
              response:
                '……西村さんかな。最近おじいちゃんの態度が西村さんに対して冷たかった気がするから。',
              behavior: 'calm',
            },
          ],
        },
        broken_vase: {
          reaction: '花瓶は確かに最初から割れていましたよ。昨日の朝に気づきました。',
          behavior: 'calm',
        },
        wine_glass_2: {
          reaction: 'グラスが2つ……おじいちゃん、誰かと飲んでいたんですね。',
          behavior: 'calm',
        },
        torn_letter: {
          reaction: '破られた手紙……。何が書いてあったんだろう。',
          behavior: 'calm',
        },
      },
    },
  ],
  rooms: [
    {
      id: 'room_tower',
      name: '塔の寝室',
      type_id: 'bedroom',
      description:
        '城の最上階、らせん階段を上った先にある会長専用の寝室。扉は内側から施錠されており、窓の鍵も閉まっていた——完全な密室だ。窓枠のクラシックな金具には、工具でこじ開けた傷跡がわずかに残っている。',
      evidence_ids: ['silk_cord', 'cufflink_gold', 'bruise_photo'],
    },
    {
      id: 'room_study',
      name: '書斎',
      type_id: 'study',
      description:
        '分厚い法律書と財閥の歴史書が壁一面を覆う書斎。西村が夜通し書類仕事をしていたと主張する部屋で、壁際に備え付けの小型金庫がある。卓上に広げられた書類の中には、財務関連の資料が混じっている。',
      evidence_ids: ['ledger_copy', 'victim_note', 'receipt_hidden'],
    },
    {
      id: 'room_library',
      name: '図書室',
      type_id: 'library',
      description:
        '城内で最も広い部屋の一つ。木製の長テーブルに複数のランプが置かれ、尾崎と藤田が深夜まで書類作業をしていた場所だ。古い欧州語の洋書が並ぶ棚の一角に、日本語の法律書と財閥史料がある。',
      evidence_ids: ['torn_letter', 'wine_glass_2'],
    },
    {
      id: 'room_dining',
      name: 'ダイニング',
      type_id: 'dining_room',
      description:
        '中央に重厚なオーク材の長テーブルが置かれた食堂。田中吾郎が深夜まで一人でウイスキーを傾けていた場所で、複数のボトルが残っている。暖炉の残り火がかすかに燃えており、外の嵐の音が石壁を通して届く。',
      evidence_ids: ['broken_vase'],
    },
    {
      id: 'room_hallway',
      name: '寝室棟廊下',
      type_id: 'hallway',
      description:
        '塔の寝室へと続く石畳の細い廊下。深夜は外光が入らず、ランプ1灯だけが照らす暗がりだ。その石畳に、乾ききっていない泥の足跡が一方向にだけ続いていた——誰かが塔へ向かった証拠だ。',
      evidence_ids: ['mud_print', 'master_key', 'window_tool'],
    },
  ],
  evidence: [
    {
      id: 'silk_cord',
      name: '絹の紐',
      category_id: 'fabric',
      description:
        '被害者の首に巻かれた状態で発見された白い絹の紐。もとは寝室のカーテンを束ねていた装飾紐で、一方の端に金具の取り付け痕が残っている。光沢のある繊維は部分的に赤く染まっている。',
      is_fake: false,
      relevance: '凶器。被害者の部屋のカーテンから引き抜かれた形跡がある。',
      examination_notes:
        '繊維分析から被害者の首の索状痕と幅・素材が一致することが確認された。紐の両端には皮膚組織と爪の微細片が付着しており、激しい絞扼と被害者の抵抗があったことを示す。カーテンを固定していた金具は引きちぎられた形で脱落しており、犯人が咄嗟に手近にあったこの紐を凶器として選んだことがわかる。',
    },
    {
      id: 'ledger_copy',
      name: '横領帳簿のコピー',
      category_id: 'document_contract',
      description:
        '会長の金庫から発見された財閥内部の経理書類のコピー。数十ページにわたり、架空会社への不自然な定期振込が几帳面な字で記録されている。余白に被害者自身の注釈と思われる赤ペンの書き込みがある。',
      is_fake: false,
      relevance: '横領の証拠。承認印と照合可能なインク痕が残る。',
      examination_notes:
        '書類の各ページに押された承認印は特殊インクを使用しており、承認者の照合が可能だ。この書類が翌朝弁護士へ渡される予定だったとすれば、横領の当事者には一夜にして全てを失うという強烈な動機が生じる。金庫へのアクセス権を持つ人物は財閥内でも限られており、誰がコピーを作れたかが重要な絞り込み点となる。',
    },
    {
      id: 'window_tool',
      name: '窓枠の工具痕',
      category_id: 'tool',
      description:
        '被害者の部屋の窓枠に残る金属製工具の擦り傷。外側から施錠操作をした痕跡と思われる。',
      is_fake: false,
      relevance: '密室トリックの証拠。窓から脱出後に外側から施錠した痕跡。',
      examination_notes:
        '擦り傷の方向から窓の掛け金を外側から操作しようとした動作と一致する。この建物の窓は特殊な構造で工具があれば外から施錠可能。犯人は絞殺後に窓から脱出して外側から施錠し密室を作り上げた。',
    },
    {
      id: 'mud_print',
      name: '廊下の泥足跡',
      category_id: 'fingerprint',
      description: '寝室棟廊下に残る泥の足跡。靴底のパターンと26.5cmのサイズが確認できる。',
      is_fake: false,
      relevance: '犯行ルートの証拠。書斎から塔の寝室への経路と一致。',
      examination_notes:
        '足跡のサイズ（26.5cm）と靴底パターンから特定の革靴の可能性が高い。足跡は書斎方向から塔の寝室方向へ向かい、戻る痕跡もある。廊下の泥は城の中庭と一致する成分が含まれており、窓から脱出した際に中庭を通った証拠ともなりえる。',
    },
    {
      id: 'cufflink_gold',
      name: '金のカフスボタン',
      category_id: 'jewelry',
      description:
        '塔の寝室の絨毯に落ちていた18金製のカフスボタン。片方だけ発見された。表面に「N.K.」のイニシャルが小さく彫刻されており、贈り物として誂えたような上質な造りだ。',
      is_fake: false,
      relevance: '犯人の落とし物。イニシャルが特定の人物を示す。',
      examination_notes:
        '「N.K.」は西村健二（Nishimura Kenji）のイニシャルを逆にしたもの——頭文字を逆順にする記念品の書式は日本では珍しくない。密室の被害者の部屋で発見されたことは、この人物が昨夜確かにこの部屋に立ち入ったことを示す物的証拠だ。格闘か急いで逃げた際に外れた片方が室内に残されていた。',
    },
    {
      id: 'victim_note',
      name: '被害者のメモ',
      category_id: 'document_letter',
      description:
        '書斎のデスク引き出し奥に折り畳んで隠されていた手書きのメモ。被害者の几帳面な筆跡で「K・N 横領確認済 弁護士に提出 翌10時」と書かれている。これは昨晩の出来事——翌朝には全てが明るみに出るはずだった。',
      is_fake: false,
      relevance: '横領発覚の記録。被害者が翌朝に証拠提出を計画していた証拠。',
      examination_notes:
        '筆跡は被害者・白河啓一のものと鑑定一致。「K・N」は参加者の中の特定人物のイニシャルに対応する。「翌10時」とは今朝の弁護士との個別面談のことだ。もしこのメモの内容を知った者がいれば——その夜中に行動を起こす以外に選択肢はなかったことになる。',
    },
    {
      id: 'master_key',
      name: 'マスターキー',
      category_id: 'key',
      description:
        'ホテル内全室に対応する合鍵。廊下の隅に落ちていた。特定の担当者に貸し出されていたもの。',
      is_fake: false,
      relevance: '密室トリックの道具。全室に出入り可能な鍵。',
      examination_notes:
        'このマスターキーは館の記録によれば経理担当者に貸し出されていたことが確認できる。廊下に落ちていたことは、犯行後に急いで逃げる際に落としたか意図的に捨てたかのいずれかを示す。このキーがあれば被害者の部屋の鍵を閉めた状態での入退室が可能だ。',
    },
    {
      id: 'bruise_photo',
      name: '首の索状痕写真',
      category_id: 'blood_stain',
      description: '検死の際に撮影された首の索状痕の写真。絞殺の状況を詳しく示している。',
      is_fake: false,
      relevance: '死因の確定証拠。絞殺であることを示す。',
      examination_notes:
        '索状痕の幅と深さから直径8〜10mmの細い紐が使われたと推定される。絹の紐と一致する。痕跡から力の方向と犯人の位置関係が推定でき、後ろから羽交い絞めにしたと考えられる。激しい抵抗の痕跡が少ないことから睡眠中か油断していたときに奇襲された可能性が高い。',
    },
    {
      id: 'receipt_hidden',
      name: '隠し口座の入金明細',
      category_id: 'document_diary',
      description: '架空の会社名義の口座に対する高額入金の明細書。被害者の金庫内から発見された。',
      is_fake: false,
      relevance: '横領の証拠。資金移動の規模と継続性を示す。',
      examination_notes:
        '架空会社への送金は15年前から続いており総額は3億円を超える。会社名は実在しないダミーで口座名義人の調査が必要。この明細書が帳簿コピーと合わせて提出されれば横領の全容解明が可能だ。被害者が翌朝弁護士に渡す予定だったものの一つと推定される。',
    },
    {
      id: 'broken_vase',
      name: '割れた花瓶',
      category_id: 'container',
      description: 'ダイニングの棚に置かれていた陶器の花瓶。粉々に割れている。',
      is_fake: true,
      first_impression:
        '被害者の部屋近くで発見された割れた花瓶。もみ合いの際に棚から落ちた可能性があり、格闘の痕跡かもしれない。',
      relevance: '格闘の痕跡に見えるが実際は無関係。',
      examination_notes:
        '花瓶の割れ方を詳しく調べると埃の積もり具合から昨夜以前から割れていたことが分かる。また花瓶はダイニングのもので被害者の部屋から遠く離れている。格闘の痕跡ではなく今回の事件とは無関係と判断される。',
    },
    {
      id: 'wine_glass_2',
      name: '洗浄されたワイングラス',
      category_id: 'food_drink',
      description: '図書室で見つかった2つのワイングラス。丁寧に洗浄されている。',
      is_fake: true,
      first_impression:
        '被害者の部屋の近くで発見された2つのワイングラス。被害者が誰かを深夜に招き共に飲んでいた証拠かもしれない。その人物が犯人だとすれば凶行直前の状況を示す重要な証拠。',
      relevance: '被害者と犯人の会合を示すかに見えるが、実は図書室での作業中に使用されたもの。',
      examination_notes:
        'グラスを詳しく調べると図書室に保管されていたものと同型であることが分かる。尾崎と藤田が作業中に使用したことが確認され被害者の部屋とは無関係。丁寧に洗われているのは館の慣例によるもの。今回の事件との直接的な関連はない。',
    },
    {
      id: 'torn_letter',
      name: '破られた手紙',
      category_id: 'document_letter',
      description: '図書室のゴミ箱で見つかった手紙の断片。内容の一部が読み取れる。',
      is_fake: true,
      first_impression:
        '「……もし貴殿がこの件を公にするならば、私も黙ってはいられない……」という文面の断片。被害者への脅迫状の可能性があり、犯行動機に関わる重要な証拠かもしれない。',
      relevance: '脅迫状に見えるが、古いビジネス上のトラブルに関する手紙で事件とは無関係。',
      examination_notes:
        '手紙の残りの断片を丁寧につなぎ合わせると10年前の取引トラブルに関する書状であることが判明する。用紙の変色具合から保管期間は数年以上で昨夜書かれたものではない。会長が整理のために処分したものとみられ今回の事件との直接的な関連はない。',
    },
  ],
  evidence_combinations: [
    {
      id: 'combo_embezzlement_proof',
      evidence_ids: ['ledger_copy', 'receipt_hidden'],
      name: '横領の全容が明らかになった',
      description:
        '帳簿コピーと隠し口座の入金明細を合わせることで、15年間・3億円超の横領の全容が明確になる。被害者が翌朝弁護士に提出しようとしていた証拠の組み合わせがそろった。',
      is_critical: true,
      required_suspect_ids: ['nishimura_kenji'],
    },
    {
      id: 'combo_murderer_in_room',
      evidence_ids: ['cufflink_gold', 'master_key'],
      name: '犯人が被害者の部屋に侵入した証拠',
      description:
        '被害者の部屋で発見されたイニシャル「N.K.」のカフスボタンと廊下に落ちていたマスターキーを組み合わせることで、この人物が合鍵を使い被害者の部屋に侵入したことが確実になる。',
      is_critical: true,
      required_suspect_ids: ['nishimura_kenji'],
    },
    {
      id: 'combo_locked_room_trick',
      evidence_ids: ['window_tool', 'master_key'],
      name: '密室トリックの手口が判明した',
      description:
        '窓枠の工具痕とマスターキーを組み合わせることで、犯人が絞殺後に窓から脱出して外側から施錠し密室を偽装したトリックが解明される。',
      is_critical: true,
    },
    {
      id: 'combo_motive_trigger',
      evidence_ids: ['victim_note', 'ledger_copy'],
      name: '殺害動機が確定した',
      description:
        '被害者のメモ（翌10時に弁護士へ証拠提出予定）と横領帳簿のコピーを合わせると、横領当事者が証拠を突きつけられる直前だったことが分かる。逃げ場を失った横領犯が発覚を阻止するために殺害に踏み切った動機が確定する。',
      is_critical: false,
    },
  ],
  accusation_data: FIXED_ACCUSATION_DATA_2,
}
