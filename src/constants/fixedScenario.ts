import type { Scenario } from '../types/scenario'

export const FIXED_SCENARIO: Scenario = {
  title: '黄昏の晩餐会',
  synopsis:
    '孤島の洋館で開催された晩餐会。翌朝、資産家の黒崎源一郎が書斎で冷たくなって発見された。毒殺と思われる。招待された6名の中に犯人がいる。',
  setting: '孤島に建つゴシック様式の洋館。外は嵐で孤立無援の状況。',
  mansion_background_id: 'mansion_seaside',
  victim: {
    name: '黒崎源一郎',
    appearance_id: 'male_elderly',
    description: '70代の資産家。鋭い目つきと白い顎髭が特徴。強引な性格で多くの人に恨まれていた。',
    cause_of_death: '致死量のアコニチン（トリカブト毒）による中毒死',
  },
  murder_time_range: '22:00〜01:00（推定）',
  murderer_id: 'shiraishi_makoto',
  motive: '黒崎が書き換えた遺言書を元に戻すため。自分への遺産相続分が削除されていた。',
  truth:
    '白石誠は黒崎の遠縁で、遺言書に多額の遺産を相続する予定だった。しかし黒崎が密かに遺言書を書き換え、白石への相続分を全て削除していた。白石は書斎の金庫に保管された遺言書の写しを見て事実を知り、晩餐会当日にワイングラスにトリカブト毒を混入した。庭園で採取した毒草を事前に精製し、キッチンで機会を伺って実行した。',
  suspects: [
    {
      id: 'shiraishi_makoto',
      name: '白石誠',
      appearance_id: 'male_young',
      age: 32,
      occupation: '無職（元投資家）',
      default_wrong_pursuit_response:
        'その証言と証拠に関連性を見出すのは、いささか飛躍が過ぎるのではないですか。',
      description: '端正な顔立ちの青年。常に落ち着いた笑みを浮かべているが、目が笑っていない。',
      personality: '計算高く冷静。感情を表に出さない。',
      alibi: '晩餐会の間はずっとダイニングにいたと主張。',
      secret: '多額の借金を抱えており、遺産が唯一の頼みだった。',
      relationship_to_victim:
        '遠縁の甥。遺言書で多額の遺産を相続予定だった（本人はそう思っていた）。',
      room_id: 'room_library',
      timeline:
        '20:00 晩餐会開始 → 終始ダイニングで他の参加者と歓談 → 22:30頃 自室へ退室 → 就寝（深夜は部屋を出ていないと主張）',
      investigation_dialog: {
        greeting: '…やあ、何か用かな。私はただの参加者に過ぎないよ。',
        statements: [
          '黒崎のおじさんとは長い付き合いだ。まさかこんな形で別れることになるとは思わなかった。',
          '晩餐会の間、私はずっとダイニングで皆と一緒にいた。22:00以降も席を外したことはない。それが私のアリバイだ。',
          '庭園？そんな夜に外へ出る理由がないじゃないか。',
          '園田さんが私を見たと言っているそうだが、彼女は何かを見間違えたんだろう。深夜0時など私は部屋にいた。',
          '遺言書の内容？もちろん知っている。おじさんは私に多額の遺産を残すと以前言っていたからね。',
        ],
      },
      evidence_reactions: {
        poison_bottle: {
          reaction: '…それは私のものじゃない。誰かが嵌めようとしているんだろう。',
          behavior: 'evasive',
        },
        will_document: {
          reaction: 'その遺言書は…偽物だ。本物はもっと違う内容のはずだ。',
          behavior: 'nervous',
          contradicts_statement_index: 4,
          wrong_testimony_response:
            'その証言とこの遺言書に、直接の矛盾は見当たらない。見当違いだ。',
          pursuit_questions: [
            {
              id: 'shiraishi_pq_will_1',
              text: 'あなたは「おじさんは私に多額の遺産を残すと以前言っていた」とおっしゃいましたね。ではなぜ「偽物」だとわかるのですか？口頭で聞いただけなら内容の確認はできないはずです。',
              response:
                '…おじさんから以前、口頭で聞いていたんだ。私への相続がある、と。それが今回の内容と違うから偽物と言っているんだ。',
              behavior: 'evasive',
              unlocks_pursuit_question_ids: ['shiraishi_pq_will_2'],
            },
            {
              id: 'shiraishi_pq_will_2',
              text: 'この遺言書は金庫に保管されていました。内容を知るには金庫を開けるしかありません。',
              response:
                '（顔色が変わる）…金庫…？私は金庫を開けていない。コピーがどこから出てきたか知らない。',
              behavior: 'angry',
            },
          ],
        },
        herb_fragment: { reaction: '庭の植物？私は植物学など知らない。', behavior: 'nervous' },
        wine_glass: {
          reaction: '…ワイングラスが何だというんだ。みんな使っていたじゃないか。',
          behavior: 'angry',
        },
        muddy_shoes: {
          reaction: '泥…？これは関係ない。庭には誰でも出られる。',
          behavior: 'evasive',
          contradicts_statement_index: 2,
          wrong_testimony_response: 'その証言と、この泥靴に直接の繋がりはない。見当違いだ。',
          pursuit_questions: [
            {
              id: 'shiraishi_pq_muddy_1',
              text: 'あなたは「庭園？そんな夜に外へ出る理由がないじゃないか」と言いましたね。ではこの泥靴はどう説明しますか？',
              response: '…（視線を逸らす）…少し外の空気を吸いに出ただけだ。それの何が問題なんだ。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['shiraishi_pq_muddy_2'],
            },
            {
              id: 'shiraishi_pq_muddy_2',
              text: '深夜に庭へ出た時刻を教えてください。防犯カメラに映っています。',
              response:
                '（顔が青ざめる）…それは…カメラは故障していると聞いていた。…仮に外に出たとしても、それが何だというんだ。',
              behavior: 'angry',
            },
          ],
        },
        note_paper: { reaction: 'そのメモは私には関係ない。', behavior: 'calm' },
        torn_letter: { reaction: 'その手紙は見たことがない。', behavior: 'calm' },
        kitchen_knife: {
          reaction: 'これは普通の包丁だろう。料理人なら誰でも使う。',
          behavior: 'calm',
        },
        photo_garden: {
          reaction: '写真？不鮮明で誰だかわからないじゃないか。',
          behavior: 'nervous',
          contradicts_statement_index: 3,
          wrong_testimony_response: 'その証言と、この写真に直接の矛盾はない。的外れだ。',
          pursuit_questions: [
            {
              id: 'shiraishi_pq_photo_1',
              text: 'あなたは「園田さんは見間違えた、深夜0時は部屋にいた」と言いましたね。この写真の撮影時刻は深夜0:15です。どう説明しますか？',
              response:
                '…それは…カメラの時刻設定がおかしいんだろう。あの晩、嵐で電力が不安定だったじゃないか。',
              behavior: 'evasive',
              unlocks_pursuit_question_ids: ['shiraishi_pq_photo_2'],
            },
            {
              id: 'shiraishi_pq_photo_2',
              text: '同じ時刻に裏口の電池式センサーが反応しています。停電は関係ありません。',
              response:
                '（長い沈黙の後）…わかった。外に出た。だが煙草を吸いに行っただけだ。あそこで何かを採取したわけじゃない。',
              behavior: 'nervous',
            },
          ],
        },
        safe_key: { reaction: '金庫の鍵…それがどうしたんだ。', behavior: 'angry' },
        handkerchief: {
          reaction: 'ハンカチか。同じイニシャルの人間が他にもいるかもしれない。',
          behavior: 'evasive',
        },
        diary_entry: {
          reaction: '日記に何が書いてある…？見せてもらえないか。',
          behavior: 'nervous',
        },
      },
    },
    {
      id: 'kurosaki_misaki',
      name: '黒崎美咲',
      appearance_id: 'female_young',
      age: 28,
      occupation: 'OL',
      default_wrong_pursuit_response:
        'その証言とこの証拠に何の関係があるっていうんですか！？見当違いもいいところです！',
      description: '被害者の姪。黒い喪服のような服が印象的。泣き腫らした目をしている。',
      personality: '感情的で思ったことをすぐ口にする。',
      alibi: '自室で眠っていたと主張。',
      secret: '黒崎に多額の借金があり、返済を迫られていた。',
      relationship_to_victim: '姪。かつては溺愛されていたが、最近は関係が冷え込んでいた。',
      room_id: 'room_dining',
      timeline: '20:00 晩餐会参加 → 21:30頃 気分が優れず自室へ → 就寝',
      investigation_dialog: {
        greeting: 'あなたも調べているの？叔父の死の真相を…私も知りたい。',
        statements: [
          '叔父はお金に厳しくて、私への返済期限が来週だったの。でもだからって殺したりしない。',
          '昨晩21:30頃には部屋に引き取ったわ。あの晩餐会の雰囲気が嫌で早めに席を立ったの。',
          '白石さんが怪しいと思う。叔父の遺言のことで揉めていたって聞いたもの。',
          '部屋に戻る前の22:00頃、白石さんがキッチン方向へ向かうのを廊下で見たの。席を立っていた時間が確かにあったわ。',
          '叔父は遺言書を書き換えたと藤堂弁護士から聞いたわ。誰かが大きな損失を受けたはず。',
        ],
      },
      evidence_reactions: {
        poison_bottle: { reaction: 'これは…毒？こんなものが館に！？', behavior: 'sad' },
        will_document: {
          reaction: '遺言書！これって叔父の…内容が違う。書き換えられてる！',
          behavior: 'angry',
          contradicts_statement_index: 4,
          wrong_testimony_response:
            'その証言と、この遺言書に直接の矛盾はないわ。見当違いじゃない？',
          pursuit_questions: [
            {
              id: 'misaki_pq_will_1',
              text: 'あなたは「藤堂弁護士から遺言書の書き換えを聞いた」と言いましたね。しかし今の反応はまるで初めて見たかのようです。いつ弁護士から聞いたのですか？',
              response:
                '…ッ。…聞いたのは昨晩よ。でも…実際に書き換えられた遺言書を目にしたのは初めてだから…動揺してしまって。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['misaki_pq_will_2'],
            },
            {
              id: 'misaki_pq_will_2',
              text: '弁護士はなぜ相続人でもないあなたに守秘義務のある遺言内容を教えたのですか？',
              response:
                '（観念したように）…正直に言う。廊下で叔父と藤堂先生が話しているのを立ち聞きしてしまったの。直接聞いたわけじゃない。でも私は遺言の受益者じゃないから、殺す動機がない。叔父への借金は…別の問題よ。',
              behavior: 'evasive',
            },
          ],
        },
        herb_fragment: {
          reaction: 'これって…トリカブトの葉じゃないの？庭にあったの？',
          behavior: 'nervous',
        },
        wine_glass: {
          reaction: 'ワイングラスに毒が？信じられない…誰がこんな事を。',
          behavior: 'sad',
        },
        muddy_shoes: { reaction: '泥のついた靴？昨晩誰かが外に出たのね。', behavior: 'calm' },
        note_paper: {
          reaction: 'このメモの字…見覚えがある気がする。',
          behavior: 'nervous',
          contradicts_statement_index: 1,
        },
        torn_letter: { reaction: '破られた手紙。誰かが証拠を隠滅しようとした？', behavior: 'calm' },
        kitchen_knife: { reaction: '包丁…でも叔父は毒で亡くなったんでしょ？', behavior: 'calm' },
        photo_garden: {
          reaction: 'この写真、庭で何かを採取している人がいる。誰なの？',
          behavior: 'nervous',
        },
        safe_key: { reaction: '叔父の金庫の鍵！これは書斎にあったはずよ。', behavior: 'angry' },
        handkerchief: {
          reaction: 'このハンカチは…白石さんのイニシャルじゃない？',
          behavior: 'nervous',
        },
        diary_entry: { reaction: '叔父の日記！何が書いてあるの？', behavior: 'nervous' },
      },
    },
    {
      id: 'kito_takeo',
      name: '鬼頭武雄',
      appearance_id: 'male_middle',
      age: 52,
      occupation: '会社役員',
      default_wrong_pursuit_response:
        '見当違いな追及だ。その証言とこの証拠に何の繋がりがある？時間を無駄にするな。',
      description: '恰幅のいい中年男性。高価なスーツを着ており、傲慢な態度が目立つ。',
      personality: '権威的で強引。金と権力を重視する。',
      alibi: 'バーラウンジで酒を飲んでいたと主張。バーテンダーが証言。',
      secret: '黒崎と共同で行った不正取引の証拠を黒崎に握られていた。',
      relationship_to_victim: 'ビジネスパートナー。表向きは友好的だが実際は脅迫関係。',
      room_id: 'room_study',
      timeline: '20:00 晩餐会 → 21:00頃 バーラウンジへ移動 → 翌02:00頃まで飲酒',
      investigation_dialog: {
        greeting: 'なんだ、君か。私は忙しい。手短に頼む。',
        statements: [
          '黒崎とは長年の付き合いだ。彼のような人物がいなくなるのは業界にとっても損失だよ。',
          '昨晩21:00からバーラウンジにいた。バーテンダーが翌02:00まで私がいたと証言できる。',
          '不正取引？そんな話は知らない。根も葉もない噂だ。',
          '白石という男は怪しい。22:00頃に席を離れていたし、戻ってきた時に表情がおかしかった。',
          '庭に深夜出るなんて普通じゃない。私は21:00以降バーにいた。アリバイは完璧だ。',
        ],
      },
      evidence_reactions: {
        poison_bottle: { reaction: 'こんなものを使ったのか。残忍な奴だ。', behavior: 'calm' },
        will_document: { reaction: '遺言書か。私には関係ない話だ。', behavior: 'calm' },
        herb_fragment: { reaction: '植物のことは詳しくない。', behavior: 'calm' },
        wine_glass: { reaction: 'ワイングラスで毒を？用意周到な犯人だな。', behavior: 'calm' },
        muddy_shoes: { reaction: '泥だと？私は昨晩外に出ていない。', behavior: 'calm' },
        note_paper: { reaction: 'このメモ…黒崎の筆跡だな。何が書いてある？', behavior: 'nervous' },
        torn_letter: {
          reaction: 'これは…まずい。私宛の手紙じゃないか。',
          behavior: 'nervous',
          contradicts_statement_index: 2,
          wrong_testimony_response: 'その証言とこの手紙に、直接の矛盾はない。見当違いだ。',
          pursuit_questions: [
            {
              id: 'kito_pq_letter_1',
              text: 'あなたは「不正取引？そんな話は知らない」と言いました。ではこの手紙に「取引の証拠を握っている」と書かれているのに、なぜこれほど動揺するのですか？',
              response:
                '…うるさい！これは昔の話だ。今回の事件とは関係ない！黒崎が死んでも私には何の得もない！',
              behavior: 'angry',
              unlocks_pursuit_question_ids: ['kito_pq_letter_2'],
            },
            {
              id: 'kito_pq_letter_2',
              text: '黒崎はあなたを脅していたのですか？正直に話してください。',
              response:
                '（大きなため息）…そうだ。証拠を握られていた。だから私は彼が死んでは困る。生きていてもらわないと困る側の人間だ。殺したのは私じゃない。',
              behavior: 'evasive',
            },
          ],
        },
        kitchen_knife: { reaction: '刃物か。毒殺とは関係ないだろう。', behavior: 'calm' },
        photo_garden: { reaction: 'この写真は関係ない。', behavior: 'calm' },
        safe_key: { reaction: '金庫の鍵か。中身が気になるが私には関係ない。', behavior: 'nervous' },
        handkerchief: { reaction: '私のものじゃない。', behavior: 'calm' },
        diary_entry: { reaction: '日記だと！？見せろ！…いや、関係ない。', behavior: 'angry' },
      },
    },
    {
      id: 'akai_reiko',
      name: '赤井玲子',
      appearance_id: 'female_middle',
      age: 45,
      occupation: '医師',
      default_wrong_pursuit_response:
        '論理的に整理してください。その証言とこの証拠の間に矛盾は存在しません。',
      description: '白衣を脱いでも医師の雰囲気が漂う女性。知的な目をしている。',
      personality: '論理的で冷静。感情より事実を重視する。',
      alibi: '図書室で本を読んでいたと主張。',
      secret: '黒崎の主治医として不適切な診断書を書いたことがある。',
      relationship_to_victim: '主治医。20年来の付き合い。',
      room_id: 'room_garden',
      timeline: '20:00 晩餐会 → 21:30頃 図書室へ移動・読書 → 23:00頃 就寝',
      investigation_dialog: {
        greeting: 'あなたも真相を探っているの？医師として、死因については気になることがあって。',
        statements: [
          '死因はアコニチン中毒で間違いないわ。症状と経過からして。問題は誰が投与したか。',
          '昨晩21:30頃から図書室で医学書を読んでいた。正確にはアコニチンについての文献を。…偶然よ。',
          'トリカブトは庭園に生えていたはず。私は医師として知識があるけれど、だからこそ疑われるのね。',
          'アコニチンを精製するには特殊な知識が要る。でも調べれば誰でも作れる。犯人は十分な準備をしていたはず。',
          '23:00頃、図書室への廊下でキッチン方向から来た白石さんとすれ違ったわ。急いでいる様子だった。',
        ],
      },
      evidence_reactions: {
        poison_bottle: {
          reaction: 'アコニチンの精製品ね。これを作るには専門知識が必要よ。',
          behavior: 'calm',
        },
        will_document: {
          reaction: '遺言書の内容？私には関係ないけれど、誰かが動機を持っていたのね。',
          behavior: 'calm',
        },
        herb_fragment: {
          reaction: 'トリカブトの葉。庭で採取したものね。これだけでは毒は作れないけれど。',
          behavior: 'calm',
        },
        wine_glass: {
          reaction: 'ワイングラスに混入したのね。タイミングを計る必要があったはず。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction: '昨晩外に出た人がいるのね。庭でトリカブトを採取するために。',
          behavior: 'calm',
        },
        note_paper: {
          reaction: 'このメモ…薬物の計算式？医学的な知識がある人が書いたわね。',
          behavior: 'nervous',
          contradicts_statement_index: 1,
          wrong_testimony_response:
            'その証言と、このメモの間に直接の矛盾は見当たらない。的外れよ。',
          pursuit_questions: [
            {
              id: 'akai_pq_note_1',
              text: 'あなたは「アコニチンについての文献を読んでいた、偶然よ」と言いました。このメモにはアコニチンの致死量計算が記されています。偶然にしては詳しすぎませんか？',
              response:
                '…筆跡を見れば私のものじゃないとわかるはずよ。でも…確かにこのフォーマットは医師が使う記録方式ね。',
              behavior: 'evasive',
              unlocks_pursuit_question_ids: ['akai_pq_note_2'],
            },
            {
              id: 'akai_pq_note_2',
              text: '医師として致死量を知っているなら、誰かに頼まれてこの量を計算することも可能だったのでは？',
              response:
                '（深く息をついて）…正直に言う。私は黒崎様の体重を知っていた。主治医だから。でもこのメモは私が書いたものじゃない。誰かが私に疑いを向けようとしている。',
              behavior: 'nervous',
            },
          ],
        },
        torn_letter: {
          reaction: 'この手紙は…患者の情報が含まれているようね。',
          behavior: 'nervous',
        },
        kitchen_knife: { reaction: '毒殺とは関係ないでしょう。', behavior: 'calm' },
        photo_garden: {
          reaction: 'この人物…夜の庭でトリカブトを採っているのね。',
          behavior: 'calm',
        },
        safe_key: { reaction: '金庫の鍵。中に何が入っているのかしら。', behavior: 'calm' },
        handkerchief: {
          reaction: 'このハンカチに見覚えが…白石さんのものじゃないかしら。',
          behavior: 'calm',
        },
        diary_entry: {
          reaction: '黒崎の日記。読んでいいものかしら…でも真相解明には必要ね。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'todo_shinichi',
      name: '藤堂慎一',
      appearance_id: 'male_young_alt',
      age: 35,
      occupation: '弁護士',
      default_wrong_pursuit_response:
        '証拠と証言の関連性が示されていません。それは推測の域を出ない話です。',
      description: 'メガネをかけた細身の男性。常に書類を持ち歩いている印象。',
      personality: '慎重で言葉を選ぶ。法的な観点から物事を見る。',
      alibi: '自室で書類仕事をしていたと主張。',
      secret: '黒崎の遺言書作成に関わっており、書き換えを知っていた。',
      relationship_to_victim: '顧問弁護士。遺言書の作成と管理を担当。',
      room_id: 'room_study',
      timeline: '20:00 晩餐会 → 21:00頃 自室へ → 深夜まで書類仕事',
      investigation_dialog: {
        greeting: '調査ですか。弁護士として、法的な観点から協力できることがあれば。',
        statements: [
          '黒崎様の遺言については守秘義務があります。ただ…最近変更があったことは確かです。',
          '昨晩21:00から自室で契約書の確認をしていました。夜を徹して作業していたので、廊下の音にも気づくことがありました。',
          '遺言書の内容が動機に関わるとすれば、相続人の確認が必要です。',
          '法的に申し上げると、遺言書は先月20日に公式に書き換えられています。白石様への相続分は全額削除されました。',
          '22:30頃、廊下へ出たところ白石様が書斎から出てくるのを目撃しました。手に何かを持ち、顔色が青かった。',
        ],
      },
      evidence_reactions: {
        poison_bottle: {
          reaction: 'こんな証拠が出てくるとは…誰かが計画的に動いていたのですね。',
          behavior: 'calm',
        },
        will_document: {
          reaction: 'これは…！この遺言書は先月書き換えられたものです。私が立会いました。',
          behavior: 'nervous',
        },
        herb_fragment: { reaction: '植物についての知識は私にはありません。', behavior: 'calm' },
        wine_glass: {
          reaction: 'ワイングラスに毒を。タイミングを知っている人間の犯行ですね。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction: '外に出た人物がいるのですね。記録しておきます。',
          behavior: 'calm',
        },
        note_paper: {
          reaction: 'このメモは…法的に見て問題のある内容が含まれています。',
          behavior: 'nervous',
        },
        torn_letter: {
          reaction: 'この手紙…黒崎様から私への連絡ですね。証拠として保全が必要です。',
          behavior: 'nervous',
        },
        kitchen_knife: { reaction: '今回の件には関係ないと思われます。', behavior: 'calm' },
        photo_garden: { reaction: 'この写真の人物…白石さんに似ていますね。', behavior: 'nervous' },
        safe_key: {
          reaction: '金庫の鍵！これは書斎の金庫に保管されているはずの…なぜここに？',
          behavior: 'angry',
          contradicts_statement_index: 1,
          wrong_testimony_response:
            'その証言と、この鍵に直接の矛盾はありません。もう一度考え直してください。',
          pursuit_questions: [
            {
              id: 'todo_pq_key_1',
              text: 'あなたは「21:00から自室で書類仕事をしていた」と言いましたね。この鍵の通常の保管場所をなぜご存知なのですか？部屋にいたはずなのに。',
              response:
                '…弁護士として書斎の金庫を管理する立場ですので、保管場所を知っているのは当然です。自室にいたことと、知識があることは矛盾しません。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['todo_pq_key_2'],
            },
            {
              id: 'todo_pq_key_2',
              text: 'では昨晩、書斎に立ち入りましたか？正直に教えてください。',
              response:
                '（しばらく沈黙の後）…実は22:00頃、黒崎様に書類確認のため呼ばれて書斎へ行きました。その際、金庫の鍵は黒崎様がデスクに置いていました。私はそれを確認して自室に戻りました。白石さんが後から来たのかもしれません。',
              behavior: 'evasive',
            },
          ],
        },
        handkerchief: {
          reaction: '誰かの所有物ですね。持ち主を特定すれば手がかりになります。',
          behavior: 'calm',
        },
        diary_entry: {
          reaction: '黒崎様の日記…これは重要な証拠になります。内容次第では。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'sonoda_yukino',
      name: '園田雪乃',
      appearance_id: 'female_young_alt',
      age: 24,
      occupation: '家政婦',
      default_wrong_pursuit_response:
        'その証言は…この証拠とは関係ないように思いますが。私の見方が違うでしょうか？',
      description: '小柄で物静かな女性。館で長年働いており、館の事情を最もよく知っている。',
      personality: '観察眼が鋭い。普段は目立たないが、見ている。',
      alibi: 'キッチンで後片付けをしていたと主張。',
      secret: '白石が夜中に庭に出るのを目撃していた。',
      relationship_to_victim: '長年仕える家政婦。館の全てを知り尽くしている。',
      room_id: 'room_kitchen',
      timeline: '20:00 晩餐会給仕・後片付け → 22:00頃 片付け開始 → 01:00頃 就寝',
      investigation_dialog: {
        greeting: '…何かお手伝いできることがあれば。私は目立たない存在ですが、見ています。',
        statements: [
          '深夜00:00頃、白石様が裏口から庭へ出るのを見ました。1時間近く外にいらっしゃいました。',
          '庭にはトリカブトが生えています。旦那様は何度か刈り取るよう言っていましたが、なかなか。',
          '昨晩22:00頃からキッチンで後片付けをしていました。その時、キッチンに見知らぬ小瓶があるのに気づきました。翌朝には消えていましたが。',
          '22:30頃、廊下を通ったら白石様が書斎から出てくるところでした。旦那様がまだご存命の時間帯です。手に何かを持っていました。',
          '旦那様は最近、白石様のことを「困った子だ」と口にされていました。遺言の件を話すつもりだったようで。',
        ],
      },
      evidence_reactions: {
        poison_bottle: {
          reaction: 'これです！キッチンで見た小瓶に似ています。白石様が持っていかれた…。',
          behavior: 'nervous',
        },
        will_document: {
          reaction:
            '遺言書…旦那様は先月こっそり書き直されていました。白石様には内緒で、と言っていました。',
          behavior: 'sad',
        },
        herb_fragment: {
          reaction: 'これは庭のトリカブトですね。白石様が立っていた場所の近くに生えているもの。',
          behavior: 'nervous',
        },
        wine_glass: {
          reaction: 'そのグラス…白石様が旦那様のそばに立っていた時に持っていたものかも。',
          behavior: 'nervous',
        },
        muddy_shoes: {
          reaction: 'この泥の形…裏庭の土と同じです。深夜に出た方のものでしょう。',
          behavior: 'calm',
        },
        note_paper: {
          reaction: '白石様のお部屋で見たものと同じ紙に見えます。',
          behavior: 'nervous',
        },
        torn_letter: {
          reaction: '破られた手紙…ゴミ箱から回収したものかもしれません。',
          behavior: 'calm',
        },
        kitchen_knife: {
          reaction: 'これはキッチンの包丁です。普通のものですよ。',
          behavior: 'calm',
        },
        photo_garden: {
          reaction: 'この写真！これは白石様です。深夜の庭で何かを採っています。',
          behavior: 'nervous',
        },
        safe_key: {
          reaction: '旦那様の金庫の鍵…これは書斎にあったはずです。誰かが持ち出した？',
          behavior: 'nervous',
        },
        handkerchief: {
          reaction: 'これは白石様のハンカチです。イニシャルが刺繍してあります。',
          behavior: 'calm',
        },
        diary_entry: {
          reaction: '旦那様の日記。最後のページに白石様のことが書かれていたはずです。',
          behavior: 'sad',
          contradicts_statement_index: 4,
        },
      },
    },
  ],
  rooms: [
    {
      id: 'room_study',
      name: '書斎',
      type_id: 'study',
      description:
        '重厚な木製の本棚に囲まれた部屋。主人の遺体が発見された場所。デスクの上には書類が散乱している。',
      evidence_ids: ['will_document', 'safe_key', 'diary_entry'],
    },
    {
      id: 'room_dining',
      name: 'ダイニング',
      type_id: 'dining_room',
      description: '長い晩餐テーブルが中央に置かれた部屋。昨晩の食器がまだ片付けられていない。',
      evidence_ids: ['wine_glass', 'handkerchief'],
    },
    {
      id: 'room_kitchen',
      name: 'キッチン',
      type_id: 'kitchen',
      description:
        '業務用の厨房設備が並ぶ広いキッチン。料理道具の隙間に何かが隠れているかもしれない。',
      evidence_ids: ['poison_bottle', 'kitchen_knife', 'note_paper'],
    },
    {
      id: 'room_library',
      name: '図書室',
      type_id: 'library',
      description: '古い書物が天井まで並ぶ図書室。医学書や植物図鑑なども混じっている。',
      evidence_ids: ['torn_letter'],
    },
    {
      id: 'room_garden',
      name: '庭園',
      type_id: 'garden',
      description:
        '洋館を囲む広大な庭園。様々な植物が植えられており、夜露に濡れた泥が足跡を残している。',
      evidence_ids: ['herb_fragment', 'muddy_shoes', 'photo_garden'],
    },
  ],
  evidence: [
    {
      id: 'poison_bottle',
      name: '小さな小瓶',
      category_id: 'poison',
      description:
        'キッチンの棚の奥に隠されていた無色の液体が入った小瓶。微量でも致死量のアコニチンが含まれている。',
      is_fake: false,
      relevance: '犯行に使用された毒薬。白石誠の指紋が検出された。',
      examination_notes:
        '成分を調べると高純度のアコニチン。市販品ではなく手製の精製品。瓶の表面に拭き取りきれない指紋が残っており、鑑定によって所持者を特定できる可能性がある。庭で採取したトリカブトから精製したと考えると、毒草の葉片との物証が繋がる。',
    },
    {
      id: 'will_document',
      name: '遺言書の写し',
      category_id: 'document_contract',
      description:
        '書斎の金庫に保管されていた遺言書のコピー。先月日付が変更されており、白石誠への相続分が削除されている。',
      is_fake: false,
      relevance: '白石誠の殺害動機を示す直接的な証拠。',
      examination_notes:
        '先月20日付けで書き換えられた遺言書のコピー。白石誠への相続分（推定3000万円相当）が完全に削除されている。藤堂弁護士の署名と立会日も記載されており、書き換えが正式に行われたことがわかる。これを知った者には強烈な動機が生まれる。',
    },
    {
      id: 'herb_fragment',
      name: 'トリカブトの葉片',
      category_id: 'poison',
      description: '庭園で採取されたと思われるトリカブトの葉の断片。摘み取られた形跡がある。',
      is_fake: false,
      relevance: '毒の原料となった植物。採取場所の特定につながる。',
      examination_notes:
        '庭園の特定区画（裏口近く）に生えるトリカブトの葉。摘み取り痕が新しく、昨晩採取されたと考えられる。葉の断片が泥のついた革靴の踵部分にも付着しており、同一人物が庭に出て採取したことを示す。',
    },
    {
      id: 'wine_glass',
      name: '主人のワイングラス',
      category_id: 'container',
      description: 'ダイニングに残された被害者のワイングラス。底部に毒物の残留反応がある。',
      is_fake: false,
      relevance: '毒が投与された経路。グラスに近づいた人物が犯人の可能性が高い。',
      examination_notes:
        '底部に微量のアコニチンが検出された。グラスの指紋は意図的に拭き取られているが、縁付近に使い捨て手袋のラテックス片が残っていた。誰かが証拠隠滅を図ったことを示す。毒を混入できたのはグラスに近づいた機会を持つ者だ。',
    },
    {
      id: 'muddy_shoes',
      name: '泥のついた革靴',
      category_id: 'clothing',
      description: '庭園の特有の粘土質の土がついた革靴。サイズは26.5cm程度。',
      is_fake: false,
      relevance: '昨晩深夜に庭に出た人物のもの。白石誠のサイズと一致。',
      examination_notes:
        '靴底の泥は庭園裏口付近特有の粘土質で、他の場所とは組成が異なる。サイズ26.5cmで、この館の参加者のうち誰が該当するか照合する必要がある。踵にトリカブトの葉片が付着しており、この靴の持ち主が庭でトリカブトを採取したと断定できる。',
    },
    {
      id: 'note_paper',
      name: '計算メモ',
      category_id: 'document_letter',
      description:
        'キッチンで見つかった小さなメモ。アコニチンの致死量計算と思われる数式が走り書きされている。',
      is_fake: false,
      relevance: '事前に毒の量を計算していた証拠。筆跡鑑定で白石誠のものと判明。',
      examination_notes:
        'アコニチンの致死量計算式が記されており、体重70kgの人物への投与量が計算されている。書いた人物の特定には筆跡鑑定が必要だが、犯行を事前に綿密に計画していた証拠となる。',
    },
    {
      id: 'safe_key',
      name: '金庫の鍵',
      category_id: 'key',
      description:
        '書斎の金庫を開ける鍵。通常は黒崎が肌身離さず持っていたはずだが、デスクの引き出しに放置されていた。',
      is_fake: false,
      relevance: '白石誠が金庫を開け遺言書を確認した証拠となりうる。',
      examination_notes:
        '黒崎源一郎が常に携帯していた金庫の鍵が、なぜか書斎のデスク引き出しに放置されていた。誰かが金庫を開けて遺言書の内容を確認した後に放置したと考えられる。昨晩書斎に立ち入った人物の特定が重要だ。',
    },
    {
      id: 'diary_entry',
      name: '日記の最終ページ',
      category_id: 'document_diary',
      description: '黒崎の日記。「白石には知らせていない。今夜の反応が見ものだ」という記述がある。',
      is_fake: false,
      relevance: '黒崎が遺言書変更を白石に意図的に隠していたことを示す。',
      examination_notes:
        '日記には遺言書の変更を知らせていない参加者がいることが示唆されている。その人物が今夜どのような反応を示したか——黒崎はそれを楽しみにしていた。変更内容を知った人物の反応こそが、事件の動機に直結する可能性がある。',
    },
    {
      id: 'photo_garden',
      name: '防犯カメラの画像',
      category_id: 'photograph',
      description:
        '庭園の防犯カメラが捉えた深夜の人物。トリカブトが生える区画に立っている。顔は不鮮明で誰か特定するには詳細な分析が必要。',
      is_fake: false,
      relevance: '白石誠が深夜に庭でトリカブトを採取した可能性を示す写真証拠。',
      examination_notes:
        '深夜0時過ぎに庭園のトリカブト群生地に立つ人物が写っている。体型・コートの形状を参加者と照合することで人物を特定できる可能性がある。画像解析により植物を採取する動作が確認でき、この時刻の行動が翌朝の毒殺と時系列上一致する。',
    },
    {
      id: 'handkerchief',
      name: 'イニシャル入りハンカチ',
      category_id: 'fabric',
      description: 'ダイニングのテーブル下に落ちていた白いハンカチ。「S.M.」の刺繍がある。',
      is_fake: false,
      relevance: 'Shiraishi Makoto（白石誠）のイニシャルと一致。犯行現場付近に残された物証。',
      examination_notes:
        '「S.M.」のイニシャルに該当する参加者がいないか確認が必要。被害者の席の真横というこの位置は、ワイングラスへの毒物混入時に落とされた可能性を示唆する。所持者が被害者のグラスに近づいていたことを示す物的証拠となりうる。',
    },
    {
      id: 'torn_letter',
      name: '破られた手紙の断片',
      category_id: 'document_letter',
      description:
        '図書室のゴミ箱から回収した手紙の断片。「…取引の証拠は私が握っている。おとなしくしていろ…」という文字が読める。',
      is_fake: true,
      first_impression:
        '「取引の証拠を握っている」という脅迫文句。宛先は不明だが、誰かが事件当日に受け取りゴミ箱に捨てたと考えられる。この手紙を送りつけた人物——あるいは受け取った人物——が今夜の殺人と関わっている可能性がある。',
      relevance:
        '鬼頭武雄への脅迫状の可能性がある。ただし今回の殺人との直接的な関係はない偽の手がかり。',
      examination_notes:
        '断片を仔細に検討すると、これは今夜書かれたものではない。インクの酸化度から数週間前に作成されたと推定できる。内容を精査すると黒崎が鬼頭の不正取引を掴んで送った警告文と判明し、今回の毒殺とは無関係だ。あなたが仮説に組み込んでいた動機の一つは崩れた。',
    },
    {
      id: 'kitchen_knife',
      name: '血のついた包丁',
      category_id: 'weapon_blade',
      description:
        'キッチンで発見された包丁。赤い染みがついているが、分析すると牛肉の血液と判明した。',
      is_fake: true,
      first_impression:
        'キッチンのまな板脇に無造作に置かれた包丁。刃には赤褐色の染みが複数残っており、まだ乾ききっていない。被害者が倒れた時刻から逆算すると、この包丁が使われた可能性は十分にある。',
      relevance: '一見すると凶器に見えるが、実際は料理で使用された無関係な包丁。',
      examination_notes:
        '赤褐色の染みを詳細に分析した結果、ヒト由来のヘモグロビン反応は陰性だった。昨晩のディナーで使用した牛肉の血液と確認され、凶器ではない。黒崎源一郎の死因はアコニチン中毒であり、刃物は一切関係しない。包丁を凶器と見ていた仮説は根底から崩れる。',
    },
  ],
  // 証拠クロス参照：複数の証拠が揃って初めて解放される決定的事実
  evidence_combinations: [
    {
      id: 'combo_garden_intruder',
      evidence_ids: ['muddy_shoes', 'photo_garden'],
      name: '深夜に庭へ出た人物が特定された',
      description:
        '泥靴の足跡サイズと庭園の写真に映り込んだ人物の輪郭が一致する。深夜0時頃、白石誠が庭園へ出て何かを採取していたことが明らかになった。アリバイ「部屋にいた」と矛盾する。',
      is_critical: false,
    },
    {
      id: 'combo_poison_origin',
      evidence_ids: ['herb_fragment', 'poison_bottle'],
      name: '毒の入手経路が判明した',
      description:
        '庭で採取されたトリカブトの葉片と小瓶の毒成分が同一種由来と確認された。犯人は庭園からトリカブトを採取し、キッチンで毒を精製していた。市販品でなく自家製である点が、館内の人物による犯行を強く示唆する。',
      is_critical: true,
    },
    {
      id: 'combo_motive_confirmed',
      evidence_ids: ['will_document', 'diary_entry'],
      name: '遺言書書き換えによる動機が確定した',
      description:
        '遺言書の写しと日記の記述が合致し、黒崎源一郎が先月密かに遺言書を書き換えていた事実が確定した。相続分を削除された人物には3000万円超の損失が生じる。この事実を知っていた者が最有力の動機を持つ。',
      is_critical: true,
    },
    {
      id: 'combo_study_intrusion',
      evidence_ids: ['handkerchief', 'safe_key', 'will_document'],
      name: '書斎へ侵入して遺言書を確認した人物が特定された',
      description:
        '「S.M.」イニシャルのハンカチ・金庫の鍵・遺言書の写しが一つの行動を示す。白石誠が金庫の鍵を用いて書斎に侵入し、遺言書の内容を確認した上でコピーを残した。動機・機会・現場の三点が交差する決定的な証拠連鎖だ。',
      is_critical: true,
    },
  ],
}
