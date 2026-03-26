// 固定シナリオ3「月夜の惨劇」（刺殺×人狼ゲーム×月夜の館）
import type { Scenario } from '../types/scenario'
import type { AccusationScenarioData } from '../types/accusation'

// 「月夜の惨劇」告発シーンデータ
const FIXED_ACCUSATION_DATA_3: AccusationScenarioData = {
  correct: {
    defense_statement:
      '……私が犯人？ 確かに彼女の小説で傷つけられた。でも、だからって人を殺せるはずがない。私はあの夜、自室にいた。証拠はないけれど、真実だ。——その脅迫文の下書きとやら、私のものだという証拠を見せてほしい。',
    decisive_evidence_id: 'threatening_draft',
    wrong_evidence_reaction:
      '……それだけでは私を犯人と断定できない。もっと直接的な証拠を持ってくるべきだ。',
    refutation_text:
      '脅迫文の下書きの筆跡を萩原の手書き原稿と照合した結果、完全に一致することが確認された。さらに下書きの最後には「それでも従わないなら、次は体で分からせる」という一文が残されていた。翌日消し去るつもりだったこの下書きは、計画的な犯行の動機と予告が記された決定的な証拠だ。',
    breakdown_statement:
      '（長い沈黙の後、萩原が震える手を顔で覆う）\n……そうだ。あの女が私の人生を壊した。婚約も、仕事も、全部。三年間、何度謝罪を求めても「創作だ」と一蹴された。\n……あの夜、最後に話し合いをしようとサロンに行った。また拒否された。机の上にペーパーナイフがあった。気がついたら、手に持っていた。',
    escape_statement:
      '（萩原は静かに立ち上がる）\n……筆跡の一致だけで犯人と断定できるとでも？ 感情的な動機があることは否定しないが、それは多くの人間が持っていた。手袋に血痕の証拠もない。\n——私はここを去る。証拠不十分だ。',
  },
  incorrect: {
    tsuda_yukiko: {
      confusion_statement:
        '……私が律子を？ 冗談じゃない！ 20年の親友よ！ 確かに最近は意見が合わなくて言い争いもあったけれど……！',
      alibi_reveal:
        '津田由紀子は被害者と共にサークルを運営していたが、小説の執筆方針を巡る対立は創作上の議論に過ぎず殺害動機にはならない。庭園での散歩は久保節子が目撃しており、犯行推定時刻のアリバイが成立する。真犯人は——別にいる。',
    },
    kamata_daisuke: {
      confusion_statement:
        '……え、僕が？ 月島先生には憧れていたし、殺すなんて……！ 屋根裏で野田さんと話していたことを確認してください！',
      alibi_reveal:
        '鎌田大輔は最年少メンバーとして被害者を慕っていた。脅迫文を書く動機も手段もなく、野田治樹が23時頃まで屋根裏で同席していたことを証言しており犯行推定時刻のアリバイが成立する。真犯人は——別にいる。',
    },
    kubo_setsuko: {
      confusion_statement:
        '……私が？ この館に長くお仕えしてきた身ですよ。作家先生に不満がないとは言いませんが、だからって……。',
      alibi_reveal:
        '久保節子は別荘管理人として被害者と信頼関係にあった。来客の扱いに不満があったとはいえ殺害に及ぶ動機はない。台所での深夜の仕込み作業は石田了が確認しており、犯行推定時刻のアリバイが成立する。真犯人は——別にいる。',
    },
    ishida_ryo: {
      confusion_statement:
        '……私が……？ 月島さんの作品を世に出すために全力を尽くしてきたのに。確かに今回の新作の方向性には異論があったけれど……。',
      alibi_reveal:
        '石田了は担当編集者として被害者の新作小説の内容に異論があったが、それは職業上の議論であり殺害動機には至らない。久保節子と台所で深夜まで会話しており犯行推定時刻のアリバイが確認される。真犯人は——別にいる。',
    },
    noda_haruki: {
      confusion_statement:
        '……わしが？ 確かに昔のゲームで何度かトラブルになったことはある。しかし今更そんな……。鎌田と屋根裏にいたことを確認してくれ。',
      alibi_reveal:
        '野田治樹は元サークルメンバーとして過去にゲーム中のトラブルがあったが、すでに解決済みであり殺害動機は存在しない。鎌田大輔と23時頃まで屋根裏で同席しており犯行推定時刻のアリバイが成立する。真犯人は——別にいる。',
    },
  },
}

// 固定シナリオ3「月夜の惨劇」
export const FIXED_SCENARIO_3: Scenario = {
  title: '月夜の惨劇',
  synopsis:
    '深山の洋館で開催された人狼ゲームサークルの合宿。深夜、主宰者の人気作家・月島律子がサロンでペーパーナイフで刺殺された。招待された6名の中に、かつて小説のモデルにされた人物がいる。',
  setting: '満月の夜、深山に建つゴシック様式の洋館。携帯の電波が届かず、山道は霧で閉ざされている。',
  mansion_background_id: 'mansion_night',
  murder_time_range: '23:30〜01:00（推定）',
  victim: {
    name: '月島律子',
    appearance_id: 'female_young_alt',
    description:
      '30代の人気作家。人狼ゲームをテーマにした小説シリーズで名を馳せる。才能は本物だが傲慢で人の感情を省みない一面がある。',
    cause_of_death: '胸部へのペーパーナイフによる刺殺。サロンの椅子に座った状態で発見。',
  },
  murderer_id: 'hagiwara_sou',
  motive:
    '最新作の登場人物として実名に近い形でモデルにされ、「卑怯で利己的なプレイヤー」として描かれた結果、婚約破棄・職場でのいじめを経験。三年間の謝罪要求をすべて拒絶されたことへの復讐。',
  truth:
    '萩原蒼は三年前の小説でモデルにされ社会的損害を受けた。今回の合宿を最後の話し合いの機会と捉えていたが、被害者は今回も拒絶した。深夜のサロンで再び拒否された瞬間、机上のペーパーナイフを手にした。犯行後は手袋を焼却炉で処分したが、机の引き出しに隠した脅迫文の下書きを消し忘れた。',
  suspects: [
    {
      id: 'hagiwara_sou',
      name: '萩原蒼',
      appearance_id: 'male_young_alt',
      age: 31,
      occupation: 'フリーランスデザイナー（元会社員）',
      description:
        '30代前半の青年。かつては快活だったと思われるが、今は目に疲れが見える。表情を読ませない。',
      personality:
        '表面上は穏やかだが、被害者の話題になると微かに声が低くなる。内に深い憤りを秘めている。',
      alibi: '23時以降は自室で読書していたと主張。',
      secret:
        '月島の小説によって職を失い婚約も破棄された。三年間謝罪を求め続けたが拒絶されており、今回の合宿が最後の機会と決意していた。',
      relationship_to_victim: '元サークルメンバー。小説のモデルにされ社会的損害を受けた当事者。',
      room_id: 'room_bedroom2',
      timeline:
        '21:00 夕食 → 22:00 被害者と個別に話し合い（場所と時刻を明かさない） → 23:30 自室に戻ったと主張',
      timeline_has_contradiction: true,
      investigation_dialog: {
        greeting: '……調査ですか。協力しますよ。何を知りたいですか。',
        statements: [
          '月島さんの小説に私が似たキャラクターが出てきたのは事実です。でも今は気にしていません。',
          '23時以降は自室でずっと読書していました。部屋を出ていません。',
          '月島さんとは今回、ゲームの話をしたくて来ました。昔の件は関係ない。',
          '深夜にサロンで物音を聞いたような気がしましたが、気のせいかと思って確認しませんでした。',
          '脅迫文？ そんなもの書いていません。月島さんとは穏やかに話し合うつもりでした。',
        ],
      },
      default_wrong_pursuit_response:
        'それが私の行動と結びつくとは思えません。もう少し整理して話してもらえますか。',
      evidence_reactions: {
        paper_knife: {
          reaction: '……ペーパーナイフですか。机の上にあるものですよね。私には関係ない。',
          behavior: 'evasive',
        },
        novel_original: {
          reaction: '（表情が硬くなる）……それが「あの本」の原稿ですか。',
          behavior: 'nervous',
        },
        apology_refusal: {
          reaction: '……（長い沈黙）……それが月島さんの返事だったんですね。',
          behavior: 'sad',
        },
        muddy_shoes: {
          reaction: '……泥のついた靴？ 私の靴じゃありません。誰のものか知らない。',
          behavior: 'evasive',
        },
        blood_floor: {
          reaction: '……痛ましいですね。月島さんが。',
          behavior: 'sad',
        },
        game_log: {
          reaction: '（目を細める）……昔のゲーム記録ですか。懐かしい。',
          behavior: 'calm',
        },
        broken_bookend: {
          reaction: '格闘の痕跡ですか。私には関係ない。',
          behavior: 'evasive',
        },
        victim_last_note: {
          reaction: '月島さんのメモ……私の名前が書いてあるんですか。',
          behavior: 'nervous',
          contradicts_statement_index: 0,
          wrong_testimony_response: 'そのメモと私の証言のどこに矛盾があるんですか。',
          pursuit_questions: [
            {
              id: 'hagiwara_pq_note_1',
              text: 'あなたは「今は月島さんの小説のことは気にしていない」とおっしゃいましたね。ではなぜ被害者のメモに「H氏：今夜も脅迫」と書かれているのですか？',
              response:
                '……（顔色が変わる）……脅迫なんて……私は話し合いを求めただけです。一方的にそう解釈されただけで……。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['hagiwara_pq_note_2'],
            },
            {
              id: 'hagiwara_pq_note_2',
              text: '「H氏」はあなたのことですよね。被害者と昨夜接触していたということですか？',
              response:
                '……（沈黙）……少し話しました。でも言い争いにはなっていない。私は穏やかに話したんです。',
              behavior: 'evasive',
            },
          ],
        },
        threatening_draft: {
          reaction: '……（顔が青ざめる）それは……どこから……。',
          behavior: 'nervous',
          contradicts_statement_index: 4,
          wrong_testimony_response: 'その手紙の筆跡が私のものだという証明はできないはずだ。',
          pursuit_questions: [
            {
              id: 'hagiwara_pq_draft_1',
              text: 'あなたは「脅迫文など書いていない」とおっしゃいましたね。ではなぜあなたの部屋の引き出しからこの下書きが発見されたのですか？',
              response: '……（手が震える）……それは……昔の気持ちを吐き出しただけで……送るつもりは……。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['hagiwara_pq_draft_2'],
            },
            {
              id: 'hagiwara_pq_draft_2',
              text: '「それでも従わないなら、次は体で分からせる」という一文がありますね。これが計画的な犯行の予告だと判断できます。',
              response:
                '（長い沈黙。萩原は椅子に深く沈み込む）……私は……あの夜、最後に話し合いをしようとサロンに行った。また拒否された。……気がついたら、手に持っていた。',
              behavior: 'sad',
            },
          ],
        },
        blood_card: {
          reaction: '……ゲームのカードですか。染みはワインでしょう。昔からそういうカードがあった。',
          behavior: 'calm',
        },
        medicine_bottle: {
          reaction: '薬瓶ですか。誰かの持病の薬でしょう。私には関係ない。',
          behavior: 'calm',
        },
        old_award: {
          reaction: '（少し目を細める）……昔のゲーム大会の記念ですか。懐かしいですね。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'tsuda_yukiko',
      name: '津田由紀子',
      appearance_id: 'female_middle_alt',
      age: 42,
      occupation: '人狼ゲームサークル副主宰・ライター',
      description:
        '40代の落ち着いた女性。被害者の旧友で長年サークルを共に運営していた。今は複雑な表情をしている。',
      personality: '理知的で公平。被害者との創作上の意見対立を隠そうとしない正直さがある。',
      alibi: '23時頃に庭園を散歩していたと主張。',
      secret:
        '被害者が自分のアイデアをそのまま小説に使ったことに不満を持っていたが、友人として公にしていなかった。',
      relationship_to_victim: '20年来の親友かつ共同運営者。最近は創作の方向性で意見が割れていた。',
      room_id: 'room_library2',
      timeline: '21:00 夕食 → 22:30 書庫で作業 → 23:00 庭園を散歩（久保が目撃） → 就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '……律子が死んだなんて、まだ信じられない。何でも話します。',
        statements: [
          '律子とは最近、小説の方向性で揉めていました。でもそれは創作上の議論です。',
          '23時頃に庭園を散歩していました。久保さんが台所の窓から見ていたはずです。',
          '萩原さんが来ることは正直、心配していました。あの件をまだ引きずっていると思っていたので。',
          '律子は今回の合宿で重要な発表をすると言っていました。新作の内容だと思っていましたが。',
          '昨夜、サロンの方向から言い争う声を聞きました。律子の声と……男性の声だったと思います。',
        ],
      },
      default_wrong_pursuit_response:
        'その点については私も考えていましたが、直接の関係は見えないですね。',
      evidence_reactions: {
        paper_knife: {
          reaction: '……凶器ですね。サロンの机に常に置いてあったものです。',
          behavior: 'sad',
        },
        novel_original: {
          reaction: '……律子の原稿。これが「問題の作品」ですか。',
          behavior: 'calm',
          contradicts_statement_index: 0,
          wrong_testimony_response: 'この原稿と私の証言の矛盾点が分からない。',
          pursuit_questions: [
            {
              id: 'tsuda_pq_novel_1',
              text: 'あなたは「創作上の議論」とおっしゃいましたが、この原稿には津田さんが提案したアイデアがそのまま使われていませんか？',
              response:
                '……（少し間を置く）……ええ、使われています。それについては律子に抗議しました。でも彼女は「インスピレーションをもらっただけ」と言って。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['tsuda_pq_novel_2'],
            },
            {
              id: 'tsuda_pq_novel_2',
              text: 'その件で昨夜も話し合いをしましたか？',
              response:
                'していません。それに、私のアイデアを使われたからといって人は殺しません。萩原さんのケースの方がずっと深刻だった。',
              behavior: 'calm',
            },
          ],
        },
        apology_refusal: {
          reaction: '……これが萩原さんへの返事ですか。律子らしいというか……冷たいですね。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction: '泥のついた靴……庭を歩いた時の泥のつき方と似ています。でも私のサイズじゃない。',
          behavior: 'calm',
        },
        blood_floor: {
          reaction: '血痕……律子はここで……。（顔を背ける）',
          behavior: 'sad',
        },
        game_log: {
          reaction:
            '懐かしいゲーム記録ですね。萩原さんがモデルにされたゲームもここに記録されている。',
          behavior: 'calm',
        },
        broken_bookend: {
          reaction: '格闘の痕跡ですね。椅子の向きも変わっている。短い争いがあったようです。',
          behavior: 'calm',
        },
        victim_last_note: {
          reaction:
            '「H氏：今夜も脅迫」……萩原さんのことですね。昨夜もサロンで接触していたということか。',
          behavior: 'nervous',
        },
        threatening_draft: {
          reaction: '……（手が震える）これが……萩原さんの引き出しから？ 計画的だったんですか。',
          behavior: 'nervous',
        },
        blood_card: {
          reaction:
            'ゲームのカードですね。染みはワインだと思います。昔からこういうカードがあった。',
          behavior: 'calm',
        },
        medicine_bottle: {
          reaction: '薬瓶ですか。野田さんが心臓病の薬を持ち歩いていると言っていましたね。',
          behavior: 'calm',
        },
        old_award: {
          reaction: '古いゲーム大会の表彰状ですね。懐かしい。律子が主催したゲームです。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'kamata_daisuke',
      name: '鎌田大輔',
      appearance_id: 'male_teen',
      age: 20,
      occupation: '大学生（サークル最年少メンバー）',
      description:
        '20歳の活発な青年。人狼ゲームが大好きで被害者を熱烈に尊敬していた。今は混乱した様子。',
      personality: '素直で感情的。嘘がつけない性格で、今回の事件に純粋に動揺している。',
      alibi: '23時頃まで屋根裏部屋で野田と話していたと主張。',
      secret: '被害者から「次作の取材に付き合え」と頼まれており断れずにいた。',
      relationship_to_victim: 'サークル最年少の熱烈なファン兼メンバー。',
      room_id: 'room_attic',
      timeline: '21:00 夕食 → 22:00 屋根裏で野田と雑談 → 23:00 野田が下りるまで同席 → 就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '月島先生が……。信じられない。誰かが先生を……？',
        statements: [
          '月島先生のことは尊敬していました。サークルに入ったのも先生がきっかけです。',
          '22時から23時頃まで屋根裏で野田さんと話していました。その後すぐ自室に戻って寝ました。',
          '萩原さんが来た時、少し雰囲気が変だと思っていました。先生と目が合うたびに硬い顔をするので。',
          'サロンの方向から物音を聞いた気がしますが、風の音かと思いました。',
          '先生は誰かを怒らせるようなことを言う癖がありましたよね。でも、だからって……。',
        ],
      },
      default_wrong_pursuit_response: 'えっと、それが僕と関係あるんですか……？ よく分からないです。',
      evidence_reactions: {
        paper_knife: {
          reaction: 'あのペーパーナイフ……先生が「使いやすい」って言ってたやつだ。',
          behavior: 'sad',
        },
        novel_original: {
          reaction:
            '先生の原稿……読んだことあります。萩原さんをモデルにした部分、確かに似ていました。',
          behavior: 'calm',
        },
        apology_refusal: {
          reaction: '……萩原さんへの返事ですか。先生らしいというか、こういう文章を書く人でした。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction: '泥靴ですか。僕は昨夜、外に出ていません。屋根裏と自室だけでした。',
          behavior: 'calm',
        },
        blood_floor: {
          reaction: '（顔を背ける）……先生が、ここで……。',
          behavior: 'sad',
        },
        game_log: {
          reaction: '古いゲーム記録ですね。萩原さんが出てくるゲームもありますね……。',
          behavior: 'calm',
          contradicts_statement_index: 2,
          wrong_testimony_response: 'ゲーム記録と私の証言の矛盾点がよく分からないです。',
          pursuit_questions: [
            {
              id: 'kamata_pq_log_1',
              text: 'あなたは「萩原さんが先生と目が合うたびに硬い顔をした」とおっしゃいましたね。この記録によると萩原さんは三年前のゲームで不正を疑われたとあります。その件を知っていましたか？',
              response:
                '……知っていました。先生がそのゲームをベースに小説を書いたんです。萩原さんが怒るのは分かります。でも……殺すなんて……。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['kamata_pq_log_2'],
            },
            {
              id: 'kamata_pq_log_2',
              text: '萩原さんが今回の合宿に参加した理由について何か聞いていましたか？',
              response:
                '昨日、萩原さんが「今日が最後の機会だ」って誰かに電話で話しているのを聞いてしまいました。嫌な予感がしたんですが……先生に言えばよかった。',
              behavior: 'sad',
            },
          ],
        },
        broken_bookend: {
          reaction: '格闘の痕跡ですか。先生は抵抗したんですね。',
          behavior: 'sad',
        },
        victim_last_note: {
          reaction: '「H氏」……萩原さんですよね。昨夜もまた揉めていたんだ。',
          behavior: 'nervous',
        },
        threatening_draft: {
          reaction: '……これが萩原さんの部屋から？ こんなものを書いていたなんて……。',
          behavior: 'nervous',
        },
        blood_card: {
          reaction:
            'このカード……ゲームで使うやつですね。染みはワインだと思います。昨日こぼしてた人がいた。',
          behavior: 'calm',
        },
        medicine_bottle: {
          reaction: '薬瓶ですか。野田さんの薬だと思います。屋根裏に来る時に持ってきていました。',
          behavior: 'calm',
        },
        old_award: {
          reaction: '昔のゲーム大会の表彰状ですね。先生が主催したやつかな。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'kubo_setsuko',
      name: '久保節子',
      appearance_id: 'female_elderly',
      age: 65,
      occupation: '別荘管理人',
      description: '60代の実直な女性。この別荘を長年管理しており、来客の様子をよく観察している。',
      personality: '無口で観察眼が鋭い。余計なことは話さないが、聞かれたことには正直に答える。',
      alibi: '深夜まで台所で翌日の仕込みをしていたと主張。',
      secret:
        '作家たちの横柄な態度に不満を持っていたが、仕事として割り切っていた。今回の事件は驚いているが冷静に対処している。',
      relationship_to_victim: '別荘管理人と利用者。信頼関係はあったが感情的な繋がりは薄い。',
      room_id: 'room_kitchen2',
      timeline: '20:00 夕食準備・給仕 → 22:00 片付け → 23:00 庭園で津田を目撃 → 翌01:30まで仕込み',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: 'こういうことになってしまって……。私の知っていることをお話しします。',
        statements: [
          '深夜まで台所で翌日の仕込みをしていました。23時頃、台所の窓から津田さんが庭を歩いているのが見えました。',
          '萩原さんは昨日到着した時から様子が変でした。目が落ち着かなくて、月島先生を見るたびに表情が変わっていました。',
          '深夜0時頃、廊下の物音に気づいて顔を出したら、誰かが素早く角を曲がるのが見えました。背丈は男性で中肉中背でした。',
          '月島先生は正直、お付き合いが難しい方でした。でも長年来てくださっていたので、こんな形になるとは。',
          '萩原さんの靴は昨日見た時に泥がついていました。外から帰ってきたと思っていましたが、今思えば……。',
        ],
      },
      default_wrong_pursuit_response:
        'それについては私には分かりかねます。見ていないことについては何とも言えません。',
      evidence_reactions: {
        paper_knife: {
          reaction:
            'サロンの机の上に置いてあったものですね。よく先生が手紙を開けるのに使っていました。',
          behavior: 'calm',
        },
        novel_original: {
          reaction: '先生の原稿ですか。私はそういったものには疎いもので。',
          behavior: 'calm',
        },
        apology_refusal: {
          reaction: '手紙ですか。先生はよくこういう短い返事を書いていましたね。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction:
            'この泥靴……昨日萩原さんが履いていたものと同じに見えます。サイズも合いそうです。',
          behavior: 'nervous',
          contradicts_statement_index: 4,
          wrong_testimony_response: 'その証言と靴の泥の量を結びつけるのは難しいかもしれません。',
          pursuit_questions: [
            {
              id: 'kubo_pq_shoes_1',
              text: 'あなたは「萩原さんの靴に昨日泥がついていた」とおっしゃいましたね。それはいつ、どこで見ましたか？',
              response:
                '昨日の午後、玄関で靴を確認した時です。萩原さんが一人で山道を歩いてきたと言っていました。しかし今思えば、昨夜の深夜にも外に出たのかもしれません。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['kubo_pq_shoes_2'],
            },
            {
              id: 'kubo_pq_shoes_2',
              text: '深夜0時頃に廊下で見た人影の靴について覚えていますか？',
              response:
                '……そういえば、その人物も泥のついた靴を履いていた気がします。暗かったのでよく見えませんでしたが。',
              behavior: 'nervous',
            },
          ],
        },
        blood_floor: {
          reaction: '朝に発見した時は……本当に驚きました。血が……。',
          behavior: 'sad',
        },
        game_log: {
          reaction: 'こういった記録があるんですね。ゲームのことは私には分かりませんが。',
          behavior: 'calm',
        },
        broken_bookend: {
          reaction: 'ブックエンドが壊れていますね。格闘があったんでしょうか。',
          behavior: 'calm',
        },
        victim_last_note: {
          reaction: '先生のメモ……。「H氏」というのは萩原さんのことでしょうか。',
          behavior: 'nervous',
        },
        threatening_draft: {
          reaction: 'こんな手紙を……。萩原さんはそこまで追い詰められていたんですね。',
          behavior: 'sad',
        },
        blood_card: {
          reaction:
            'このカードは昨日のゲームで使っていたものですね。染みはワインをこぼした時のもので、昨日の昼から気づいていました。',
          behavior: 'calm',
        },
        medicine_bottle: {
          reaction: '野田さんの心臓の薬ですね。毎食後に飲んでいましたよ。毒ではありません。',
          behavior: 'calm',
        },
        old_award: {
          reaction: '懐かしい表彰状ですね。この別荘で開催されたゲーム大会の記念品です。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'ishida_ryo',
      name: '石田了',
      appearance_id: 'male_middle',
      age: 44,
      occupation: '出版社の担当編集者',
      description:
        '40代の実務的な男性。被害者の担当編集として長年仕事をしてきたが、最近は新作の方向性に不満がある。',
      personality:
        '実務的で論理的。感情を仕事に持ち込まないが、新作の内容については強い意見を持つ。',
      alibi: '台所で久保と深夜まで話していたと主張。',
      secret:
        '新作の内容が訴訟リスクをはらんでいることに気づいており、被害者を説得しようとしていた。',
      relationship_to_victim:
        '長年の担当編集。仕事上は信頼関係があったが最近は意見対立が続いていた。',
      room_id: 'room_garden2',
      timeline: '21:00 夕食 → 22:30 庭園を一人で散歩 → 23:00 台所で久保と会話 → 翌01:00まで同席',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '月島さんの死は……仕事上でも大きな損失です。事情を聞かせてください。',
        statements: [
          '月島さんの新作にはモデルとなった人物の名誉毀損リスクがありました。再三指摘していましたが、聞いてもらえなかった。',
          '23時以降は台所で久保さんと話していました。翌1時頃まで一緒にいました。',
          '萩原さんの件は出版社内でも認知していました。今回の合宿への参加は正直、心配していました。',
          '月島さんはあの夜、誰かと深刻な話し合いをする予定があると言っていました。誰とかは言いませんでしたが。',
          '萩原さんの最新の様子について、サークルの知人から「かなり追い詰められている」という情報を聞いていました。',
        ],
      },
      default_wrong_pursuit_response:
        'なるほど、その観点は考えていませんでした。でも私との直接の関連は薄いと思います。',
      evidence_reactions: {
        paper_knife: {
          reaction: 'サロンの机に置いてあったものですね。凶器になるとは……。',
          behavior: 'sad',
        },
        novel_original: {
          reaction:
            '……これが問題の原稿ですか。萩原さんをモデルにした部分は、確かに分かる人には分かります。',
          behavior: 'calm',
        },
        apology_refusal: {
          reaction:
            '月島さんのこういうところが問題でした。謝罪を拒否する文章の書き方が実に冷淡だ。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction: '泥のついた靴ですか。サイズを確認すれば持ち主が絞り込めますね。',
          behavior: 'calm',
        },
        blood_floor: {
          reaction: '……痛ましいですね。苦しんだんでしょうか。',
          behavior: 'sad',
        },
        game_log: {
          reaction:
            'ゲームの記録……。萩原さんとの件が小説のベースになっているとすれば、動機の証拠になりますね。',
          behavior: 'calm',
          contradicts_statement_index: 2,
          wrong_testimony_response: 'その証言とゲーム記録の矛盾点が分からない。',
          pursuit_questions: [
            {
              id: 'ishida_pq_log_1',
              text: 'あなたは「萩原さんの件は出版社内でも認知していた」とおっしゃいましたね。このゲーム記録が小説の直接のベースになっているとしたら、萩原さんの訴訟リスクはどの程度でしたか？',
              response:
                '……かなり高いです。実名に近いイニシャル、特定できる状況描写……正直、法的に見てかなり問題がありました。月島さんを説得できなかった私にも責任があります。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['ishida_pq_log_2'],
            },
            {
              id: 'ishida_pq_log_2',
              text: 'その件について萩原さんは出版差し止めの要求を出していましたか？',
              response:
                '内容証明郵便が届いていました。しかし月島さんは「創作の自由だ」として無視していた。萩原さんが追い詰められていたのは事実です。',
              behavior: 'calm',
            },
          ],
        },
        broken_bookend: {
          reaction: '格闘の痕跡ですか。被害者も抵抗したんですね。',
          behavior: 'calm',
        },
        victim_last_note: {
          reaction: '「H氏：今夜も脅迫」……萩原さんが昨夜も接触していたということですね。',
          behavior: 'nervous',
        },
        threatening_draft: {
          reaction: '……これが萩原さんの筆跡ですか。計画的な犯行だったということになりますね。',
          behavior: 'nervous',
        },
        blood_card: {
          reaction:
            'ゲームのカードですね。染みはワインです。昨日昼のゲーム中にこぼした人がいましたよ。',
          behavior: 'calm',
        },
        medicine_bottle: {
          reaction: '野田さんの持病の薬ですね。心臓病と聞いています。毒とは関係ない。',
          behavior: 'calm',
        },
        old_award: {
          reaction: '古いゲーム大会の表彰状ですか。この別荘に保管されていたものですね。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'noda_haruki',
      name: '野田治樹',
      appearance_id: 'male_elderly',
      age: 68,
      occupation: '元公務員（元サークルメンバー）',
      description:
        '60代後半の穏やかな老人。人狼ゲームの実況担当として長年サークルに関わっていた。今は健康上の不安を抱えている。',
      personality: '温厚で話好き。記憶力が良く昔のゲームのことをよく覚えている。',
      alibi: '22時から23時頃まで屋根裏で鎌田と話していたと主張。',
      secret:
        '過去のゲームでのトラブルが原因で一時サークルを離れたが、当時の経緯は解決済みとしている。',
      relationship_to_victim: '長年のサークルメンバー。過去にトラブルがあったが現在は良好。',
      room_id: 'room_hallway2',
      timeline: '21:00 夕食 → 22:00 屋根裏で鎌田と雑談 → 23:00 自室へ → 就寝',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '月島さんが……悲しいですな。長い付き合いだったのに。',
        statements: [
          '月島さんとは10年以上の付き合いです。色々ありましたが、今は良い関係でした。',
          '22時から23時頃まで屋根裏で鎌田くんと話していました。その後自室に戻りました。',
          '萩原くんはね、本当に気の毒だと思っていましたよ。あの小説の件、私も月島さんに直接言ったことがある。',
          '今回の合宿に萩原くんが来ると聞いた時、月島さんに「気をつけた方がいい」と伝えました。',
          '昨夜、萩原くんが「今日が最後だ」と言っているのを小耳に挟みました。不吉な言葉だと思っていたんですが……。',
        ],
      },
      default_wrong_pursuit_response:
        'それは私には分からんですな。もう少し詳しく教えてもらえますか。',
      evidence_reactions: {
        paper_knife: {
          reaction: 'あのペーパーナイフ……いつも机に置いてありましたな。',
          behavior: 'sad',
        },
        novel_original: {
          reaction:
            '問題の原稿ですな。萩原くんのことが書いてある部分、読んだことがある。確かにひどい描き方だった。',
          behavior: 'calm',
        },
        apology_refusal: {
          reaction:
            '……月島さんらしい文章ですな。謝罪を一切認めない。これが萩原くんを追い詰めた原因ですよ。',
          behavior: 'calm',
        },
        muddy_shoes: {
          reaction: '泥靴ですか。誰のものですかな。サイズが分かれば絞り込めそうですな。',
          behavior: 'calm',
        },
        blood_floor: { reaction: '（目を閉じる）月島さんが……。', behavior: 'sad' },
        game_log: {
          reaction:
            '懐かしいですな。ここに書いてあるゲームは私も実況したものです。萩原くんが問題にされたゲームもここに。',
          behavior: 'calm',
        },
        broken_bookend: {
          reaction: '格闘があったんですな。月島さんは小柄だから、大柄な男性に叶わなかったのかも。',
          behavior: 'sad',
        },
        victim_last_note: {
          reaction: '「H氏：今夜も脅迫」……萩原くんか。やはり昨夜も揉めていたんですな。',
          behavior: 'nervous',
        },
        threatening_draft: {
          reaction: '……これは萩原くんの字に見えますな。こんなものを書いていたとは……。',
          behavior: 'sad',
          contradicts_statement_index: 4,
          wrong_testimony_response: 'この下書きと私の証言の矛盾点が見えない。',
          pursuit_questions: [
            {
              id: 'noda_pq_draft_1',
              text: 'あなたは「萩原さんが「今日が最後だ」と言っているのを聞いた」とおっしゃいましたね。この脅迫文の下書きと合わせると、計画的な犯行を示すものと考えられませんか？',
              response:
                '……（しばらく沈黙する）……そう言われれば、あの言葉は「最後の説得」ではなく……「最後の機会」という意味だったのかもしれんですな。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['noda_pq_draft_2'],
            },
            {
              id: 'noda_pq_draft_2',
              text: '萩原さんはその「最後の機会」について具体的に何か言っていましたか？',
              response:
                '「今日こそ決着をつける」と言っていました。私はゲームの話かと思っていたんですが……まさかこういう意味だったとは。',
              behavior: 'sad',
            },
          ],
        },
        blood_card: {
          reaction:
            'このカードはゲームで使ったものですな。染みはワインです。昼間にこぼしていた人がいたのを覚えています。',
          behavior: 'calm',
        },
        medicine_bottle: {
          reaction: 'ああ、これは私の薬ですな。心臓の持病で。毒ではありませんよ。',
          behavior: 'calm',
        },
        old_award: {
          reaction:
            '懐かしい表彰状ですな。この別荘で開催したゲーム大会のものです。月島さんが主催しました。',
          behavior: 'calm',
        },
      },
    },
  ],
  rooms: [
    {
      id: 'room_salon',
      name: 'サロン',
      type_id: 'study',
      description:
        '暖炉のある広いサロン。犯行現場。椅子に被害者の遺体があった。机の上にペーパーナイフがあった。',
      evidence_ids: ['paper_knife', 'blood_floor', 'broken_bookend'],
    },
    {
      id: 'room_library2',
      name: '書庫',
      type_id: 'library',
      description: '被害者の作品と資料が収められた書庫。被害者の原稿や手紙類が保管されている。',
      evidence_ids: ['novel_original', 'apology_refusal', 'victim_last_note'],
    },
    {
      id: 'room_bedroom2',
      name: '萩原の客室',
      type_id: 'bedroom',
      description: '萩原が泊まっていた客室。引き出しから重要な証拠が発見された。',
      evidence_ids: ['threatening_draft', 'muddy_shoes'],
    },
    {
      id: 'room_kitchen2',
      name: '台所',
      type_id: 'kitchen',
      description: '久保が深夜まで仕込みをしていた台所。石田と久保が深夜まで滞在していた。',
      evidence_ids: ['medicine_bottle', 'old_award'],
    },
    {
      id: 'room_attic',
      name: '屋根裏部屋',
      type_id: 'attic',
      description: '雑多なものが置かれた屋根裏部屋。古いゲーム記録や血のついたカードが発見された。',
      evidence_ids: ['game_log', 'blood_card'],
    },
  ],
  evidence: [
    {
      id: 'paper_knife',
      name: 'ペーパーナイフ',
      category_id: 'weapon_blade',
      description: 'サロンの机に置かれていた金属製のペーパーナイフ。柄の部分に血痕が残っている。',
      is_fake: false,
      relevance: '凶器。被害者の胸部を刺した凶器と一致する。',
      examination_notes:
        '刃の形状と幅が被害者の刺傷と完全に一致する。柄に残る血痕は被害者のもの。刃には持ち主の指紋も残っているが、犯人が手袋を使用したため犯人の指紋は検出されなかった。サロンの机に常時置かれていたため、誰でもアクセス可能だった。',
    },
    {
      id: 'novel_original',
      name: '問題の小説原稿',
      category_id: 'document_diary',
      description:
        '被害者の最新作の原稿。特定の登場人物が実在の人物をモデルにしていることが明確に読み取れる。',
      is_fake: false,
      relevance: '動機の証拠。特定人物を傷つける描写が明記されている。',
      examination_notes:
        '登場人物の「H」のキャラクター設定は、実在人物の氏名・職業・過去の出来事と高い一致率を示す。「H」は卑怯で自己中心的なプレイヤーとして繰り返し描写されており、実在人物が名誉毀損を主張するに十分な内容だ。このモデルとなった人物には、小説の存在により婚約破棄と職場でのいじめという具体的被害が生じている。',
    },
    {
      id: 'apology_refusal',
      name: '謝罪拒絶の手紙',
      category_id: 'document_letter',
      description: '被害者が特定人物に送った手紙のコピー。謝罪と修正の要求を明確に拒否する内容。',
      is_fake: false,
      relevance: '動機の証拠。謝罪を拒絶された人物には強い動機が生じる。',
      examination_notes:
        '手紙の内容は「本作は純粋な創作であり実在人物との類似は偶然の一致に過ぎない」という主張を繰り返しており、謝罪の余地を一切認めていない。日付は三年前から最近まで複数回にわたって送られており、被害を受けた人物が長期間にわたって謝罪を求め続けていたことが分かる。',
    },
    {
      id: 'muddy_shoes',
      name: '泥のついた靴',
      category_id: 'clothing',
      description:
        '萩原の客室で発見された革靴。靴底に大量の泥が付着しており、深夜に屋外を歩いた形跡がある。',
      is_fake: false,
      relevance: '深夜の屋外行動の証拠。サロンへの移動ルートと一致する泥の成分。',
      examination_notes:
        '泥の成分を分析すると、この館の庭園の土と一致する。靴底のパターンから昨夜の深夜に庭を歩いたことが確認できる。萩原が「自室で読書していた」という証言と矛盾する。サロン周辺の庭を通った経路と足跡のパターンが一致している。',
    },
    {
      id: 'blood_floor',
      name: 'サロンの血痕',
      category_id: 'blood_stain',
      description:
        'サロンの床と椅子周辺に広がる血痕。被害者が椅子に座った状態で刺されたことを示す。',
      is_fake: false,
      relevance: '死亡状況の証拠。犯行場所と状況を確定させる。',
      examination_notes:
        '血痕の広がり方から被害者は椅子に座った状態で刺され、ほぼその場で絶命したと推定される。周囲の血痕パターンから被害者の正面からの刺傷であることが分かる。被害者は犯人を知っており、警戒せずに向かい合っていたと考えられる。格闘の痕跡もわずかにあり、咄嗟の抵抗をしたことが読み取れる。',
    },
    {
      id: 'game_log',
      name: '人狼ゲームの勝敗記録',
      category_id: 'document_contract',
      description:
        '過去10年分のゲームの記録。特定の参加者が「不正疑惑」として記録されている回が存在する。',
      is_fake: false,
      relevance: '動機の背景。小説のベースとなったゲームと参加者の関係を示す。',
      examination_notes:
        '三年前のゲーム記録には「H参加者による不正疑惑（未確定）」という付記があり、この回をベースにした小説が発表された時期と一致する。この記録と小説の内容を照合すると、小説が実在のゲームと参加者をベースにしていることが明確に分かる。「H」と一致するイニシャルの参加者は一名のみ。',
    },
    {
      id: 'broken_bookend',
      name: '壊れたブックエンド',
      category_id: 'tool',
      description:
        'サロンの棚から落下して壊れたブックエンド。格闘の際に棚に激突したものとみられる。',
      is_fake: false,
      relevance: '格闘の痕跡。短時間の抵抗があったことを示す。',
      examination_notes:
        'ブックエンドの落下方向から、椅子周辺で人体が棚に触れた衝撃で落下したと判断できる。塵の積もり具合から昨夜落ちたもの。被害者が抵抗した際に棚を押したか、犯人が追い詰めた際に腕が当たったと推測される。格闘時間は短く、奇襲的な犯行だったことが示唆される。',
    },
    {
      id: 'victim_last_note',
      name: '被害者の最後のメモ',
      category_id: 'document_letter',
      description:
        '被害者が昨夜書いたとみられるメモ。「H氏：今夜も脅迫。弁護士に相談必要」と記されている。',
      is_fake: false,
      relevance: '動機の証拠。被害者が脅迫を認識しており、昨夜も接触があったことを示す。',
      examination_notes:
        '筆跡は被害者のものと一致し、インクの乾き具合から昨夜書かれたものと判断される。「H氏」は特定人物のイニシャルと一致する。被害者が脅迫と認識していながら「弁護士に相談」と書いており、致命的な危険とは思っていなかったことが読み取れる。これは犯人が「穏やかに話し合う」という外面を保っていたためと推測される。',
    },
    {
      id: 'threatening_draft',
      name: '脅迫文の下書き',
      category_id: 'document_letter',
      description:
        '萩原の客室の引き出しから発見された手書きの下書き。「次は体で分からせる」という文面が含まれる。',
      is_fake: false,
      relevance: '計画的犯行の証拠。犯行前の意図と動機が明記されている。',
      examination_notes:
        '筆跡を萩原の手書き原稿と照合した結果、完全に一致することが確認された。下書きには三段階の要求が記されており、最終段階に「それでも従わないなら、次は体で分からせる」という一文がある。日付は今回の合宿直前。翌日に消去するつもりだったと推定され、消し忘れが決定的証拠となった。',
    },
    {
      id: 'blood_card',
      name: '染みのあるゲームカード',
      category_id: 'photograph',
      description:
        '屋根裏部屋で見つかったゲームカード。赤い染みがあり、一見すると血のように見える。',
      is_fake: true,
      first_impression:
        '赤い染みが付着したゲームカード。犯行現場から離れた屋根裏で発見されたが、この染みは被害者の血液の可能性がある。犯人がここを通ったことを示す証拠かもしれない。',
      relevance: '血痕に見えるが実際はワインの染みで事件と無関係。',
      examination_notes:
        '赤い染みを詳しく分析した結果、血液ではなく赤ワインの成分と判明した。複数の証言から昨日の昼間のゲーム中にワインをこぼした人がいることが確認されており、その際に付いたものと判断される。今回の犯行との直接的な関連はない。',
    },
    {
      id: 'medicine_bottle',
      name: '薬瓶',
      category_id: 'medicine',
      description: '台所のテーブルに置いてあった小さな薬瓶。内容物は白い錠剤。',
      is_fake: true,
      first_impression:
        '犯行現場近くで発見された薬瓶。白い錠剤が入っており、毒物の可能性がある。被害者を毒殺しようとした証拠かもしれない。',
      relevance: '毒物に見えるが実際は持病の心臓薬で事件と無関係。',
      examination_notes:
        '錠剤を分析した結果、心臓病の標準的な治療薬（ニトログリセリン系）であることが判明した。野田の持病の薬であることが本人も認めており、食後に服用するために台所に置いていたもの。毒物ではなく、被害者の死因とは無関係と判断される。',
    },
    {
      id: 'old_award',
      name: '古い表彰状',
      category_id: 'document_contract',
      description:
        '台所の棚に保管されていた人狼ゲーム大会の表彰状。5年前のもので特定の参加者の名前が記されている。',
      is_fake: true,
      first_impression:
        '5年前の表彰状に記された名前。被害者との過去の関係を示す証拠かもしれない。受賞者は特別なアクセスや情報を得ていた可能性があり、今回の犯行に関係するかもしれない。',
      relevance: '関係者の過去を示すかに見えるが、単なる記念品で事件とは無関係。',
      examination_notes:
        '表彰状は5年前にこの別荘で開催されたゲーム大会の記念品として作成されたものであることが確認された。受賞者は複数名おり、今回の参加者の一部も含まれているが、今回の犯行とは直接関係しない。被害者が主催者として長く関わっていたサークル活動の記録に過ぎない。',
    },
  ],
  evidence_combinations: [
    {
      id: 'combo_motive_confirmed',
      evidence_ids: ['novel_original', 'apology_refusal'],
      name: '犯行動機が確定した',
      description:
        '問題の小説原稿と謝罪拒絶の手紙を合わせることで、特定人物が三年間謝罪を求め続けて拒絶され続けた経緯が完全に明らかになる。社会的損害の大きさと拒絶の冷淡さが、殺害動機として十分であることが証明される。',
      is_critical: true,
      required_suspect_ids: ['hagiwara_sou'],
    },
    {
      id: 'combo_premeditated',
      evidence_ids: ['threatening_draft', 'victim_last_note'],
      name: '計画的犯行が証明された',
      description:
        '脅迫文の下書き（「次は体で分からせる」）と被害者の最後のメモ（「H氏：今夜も脅迫」）を組み合わせることで、犯人が事前に決意していたこと、かつ当日夜に実際に接触していたことが証明される。',
      is_critical: true,
      required_suspect_ids: ['hagiwara_sou'],
    },
    {
      id: 'combo_movement_proof',
      evidence_ids: ['muddy_shoes', 'blood_floor'],
      name: '犯人の行動経路が特定された',
      description:
        '泥のついた靴（庭園を通った証拠）とサロンの血痕を合わせることで、犯人が自室から庭園経由でサロンに向かい犯行を行ったルートが特定される。「自室で読書していた」というアリバイが崩れる。',
      is_critical: true,
    },
    {
      id: 'combo_crime_scene',
      evidence_ids: ['paper_knife', 'broken_bookend'],
      name: '犯行状況が再現された',
      description:
        'ペーパーナイフ（凶器）と壊れたブックエンド（短時間の格闘の痕跡）を合わせることで、犯人が話し合いを装って近づき机上のペーパーナイフを手に取って咄嗟に刺したという犯行状況が再現される。',
      is_critical: false,
    },
  ],
  accusation_data: FIXED_ACCUSATION_DATA_3,
}
