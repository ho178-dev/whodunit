// 固定シナリオ3「月光の審判」（人狼×現代日本×オカルト儀式）
import type { Scenario } from '../types/scenario'
import type { AccusationScenarioData } from '../types/accusation'

// 「月光の審判」告発シーンデータ
const FIXED_ACCUSATION_DATA_3: AccusationScenarioData = {
  correct: {
    defense_statement:
      '……私が人狼、ですか。（静かに笑う）証拠が揃っているとしても——占いの結果は作れる。足跡は誰のものとも言えない。もう少し確かなものを持ってきてほしかったですね。',
    evidence_rebuttal:
      '……それだけでは私を追い詰めることはできない。もっと核心に迫るものを出してほしいですね。',
    wrong_link_rebuttal:
      '（静かに微笑む）……証拠と推理が噛み合っていない。その程度の論理では、私には届かない。',
    refutation_text:
      '探偵は証拠と推理を伊沢の前に並べた。三百年の血脈を持つ者も、論理の輪の前では無力だった。長い沈黙の後、伊沢の目の色が静かに変わっていった。',
    breakdown_statement:
      '（長い沈黙の後、伊沢の目の色が変わる）\n……見事だ。ここまで辿り着いた人間は久しぶりだ。\n（低く、別人のような声で）\n——三百年。この山の血を受け継いできた。あなた方凡人が暴けるとは思っていなかった。\n……認めよう。だが——私一人を捕らえたところで、この山の夜は終わらない。',
    epilogue_text:
      '月は西に傾き、山の夜が白みはじめていた。\n三百年の秘密は、ひとりの探偵の推理によって封じられた——あるいは、封じられたように見えた。\n夜は終わる。だが山は変わらない。次の満月を、静かに、待ち続けている。',
    escape_statement:
      '（静かに立ち上がり、微笑む）\n……状況証拠ですね。ペンダントが私のものという確証は？ 占い結果が「正確」だという根拠は？\n私は村人です。根拠のない告発には従う義理はない。\n——失礼します。',
    near_defeat_evidence_text:
      '探偵は真相に迫りながら、最後の一手を繋げることができなかった。\n伊沢は静かな笑みを残して儀式の場を去り、山の夜が再び静寂を取り戻した。\n人狼は今夜も、次の満月を静かに待ち続けている。',
  },
  incorrect: {
    kuroda_genichi: {
      defense_statement:
        '（一瞬だけ驚いた表情。すぐに、口元に冷たい笑みが浮かぶ）\n……ふふ。あなたは私を選んだ。\n——惜しかった。でも、それで十分だ。人狼は助かった。おめでとう。',
      evidence_rebuttal: '……ふふ。その証拠が私に何を示すというんですか。（余裕の笑みで）',
      wrong_link_rebuttal:
        '……証拠と推理が噛み合っていない。もっと核心に迫るものを持ってきてほしい。',
    },
    shiraha_seira: {
      defense_statement:
        '……私が人狼？（首を振り、悲しそうに）違います。私は本物の占い師で、昨夜正確に人狼を特定した。どうして私を……もう一度、証拠を見てください。',
      evidence_rebuttal: '……それが私の有罪を示す証拠になるとでも？（首を振る）見当違いです。',
      wrong_link_rebuttal:
        '（静かに）証拠と結論の間に論理的な繋がりが成立していない。もう一度考えてください。',
    },
    tamura_shou: {
      defense_statement:
        '……え！？ 私が人狼！？ 違います！ 黒田さんが嘘をついているんです！ アリバイを確認してください！ 私には夜通し一緒にいた証人がいます！',
      evidence_rebuttal: '……え、それが僕への証拠なんですか！？（声が上ずる）',
      wrong_link_rebuttal:
        '（焦った様子で）証拠と推理が全く繋がっていない！アリバイを確認してください！',
    },
    mizusawa_kana: {
      defense_statement:
        '……え、私が！？ 違います！ 私は昨夜見たことを正直に話しただけで……！ 私が嘘をついていたとでも思っているんですか！',
      evidence_rebuttal: '……それが私と何の関係があるって言うんですか。（困惑した表情で）',
      wrong_link_rebuttal:
        '（悲しそうに）証拠と推理が繋がっていない……私は正直に話しているだけです。',
    },
    odo_saburo: {
      defense_statement:
        '……私が人狼？（深くため息をついて）60年、この儀式を守ってきました。こんな形で疑われるとは思っていませんでしたが……仕方ありません。証拠を見てください。私には動機も手段もありません。',
      evidence_rebuttal: '……その証拠を持ってきてどうしようというのか。（静かに問う）',
      wrong_link_rebuttal:
        '（淡々と）証拠と推理の間に論理的な繋がりがない。60年の経験から申し上げます。',
    },
  },
  near_defeat_wrong_suspect_text:
    '探偵の推理は誤った方向を向いていた。\n本物の人狼は気づかれることなく、満月の夜の闇に溶けていった。\n山は変わらない——次の満月も、その次も、静かに人を待ち続ける。',
}

// 固定シナリオ3「月光の審判」
export const FIXED_SCENARIO_3: Scenario = {
  title: '月光の審判',
  synopsis:
    '山奥の民宿で開かれた年に一度の「月の夜の儀式」。満月の翌朝、参加者の青木亮が裏の林で変死体となって発見された。胸部と肩には深い爪痕と咬傷——人狼による犯行と見られる。携帯の電波は届かず、山道は霧に閉ざされた。7名の参加者の中に占い師を騙る者と、本物の人狼がいる。',
  setting:
    '奥多摩の深山に建つ民宿「月の家」。山奥に一軒だけ立つ古い建物で、携帯電話の電波は全キャリア圏外、最寄りの集落まで山道を40分歩かなければならない。毎年満月の夜、この場所で「月の夜の儀式」が開かれる。参加者は古い作法で役職（村人・占い師・人狼）を割り当てられ、夜明けまで人狼を見つける儀式を行う。しかし今年の夜——本物の人狼が紛れ込んでいた。',
  mansion_background_id: 'mansion_night',
  murder_time_range: '23:30〜01:30（推定）',
  victim: {
    name: '青木亮',
    appearance_id: 'male_teen_alt',
    description:
      '33歳の会社員。儀式への参加は今年で2年目の比較的新しいメンバー。明るく社交的で場を盛り上げるのが得意。昨夜の儀式でも真っ先に笑い声を上げていた。',
    cause_of_death:
      '裏の林で発見。胸部と肩部に複数の深い爪痕と咬傷。人狼が変身した状態での犯行と推定。',
  },
  murderer_id: 'izawa_kei',
  motive:
    '三百年続く人狼の血脈の末裔として、満月の夜に覚醒した本能による殺害。今年もこの儀式に紛れ込み、最も無防備だった青木亮を標的にした。',
  truth:
    '伊沢慧は三百年続く人狼の血脈の末裔だ。毎年この儀式に村人を装って参加し、満月の夜に獲物を狙ってきた。今年は青木亮を標的に選び、深夜に変身して裏の林へ誘い出し殺害した。自室へ戻る際に血の足跡を残し、変身の衝撃で胸元のペンダントを犯行現場に落とした。本物の占い師・白石星奈が既に正体を見抜いており、狂人・黒田玄一が偶然にも田村に疑いを向けていることが一時的な隠れ蓑となっていた。',
  main_reasoning_path:
    '① 白石星奈の占い結果書→伊沢が「黒（人狼）」と判定\n② 犯行現場（林）に残る血の足跡→サイズ・パターンが伊沢の靴と一致。「自室にいた」アリバイが崩れる\n③ 犯行現場で発見されたペンダント→伊沢のもの。自室・廊下で落とした説明が成立しない\n④ 黒田玄一の偽の占い結果書→田村への誘導工作。伊沢と協調関係の可能性',
  suspects: [
    {
      id: 'izawa_kei',
      name: '伊沢慧',
      appearance_id: 'male_teen',
      age: 27,
      occupation: '大学院生（民俗学専攻）',
      default_wrong_pursuit_response:
        'その証拠と私の行動を結びつけるには、もう少し根拠が必要だと思いますよ。',
      confession_statement:
        '……（低く、静かに笑う）よく気づいた。本当に。ずっと、この夜が来ることを知っていた。三百年の血が——満月のたびに呼ぶんだ。人間の私がいくら抗っても、あの瞬間だけは止められない。これが私の本質だよ。……君は、いい探偵だ。',
      description:
        '細身で物腰が柔らかい青年。民俗学を専攻しており、この儀式にも学術的な興味で参加していると言っている。誰からも好かれるタイプに見えるが、目が笑っていないことがある。',
      personality: '穏やかで知的。感情をほとんど表に出さない。',
      alibi: '儀式終了後の22時頃に自室に戻り、朝まで眠っていたと主張。',
      secret: '三百年続く人狼の血脈の末裔。毎年この儀式に紛れ込んで標的を探している。',
      relationship_to_victim: '今年初めて同じ儀式に参加した面識の浅い相手。',
      room_id: 'room_izawa',
      timeline:
        '20:30 夕食・懇親 → 22:00 儀式終了後に自室へ退出（本人申告）→ 深夜 変身して裏の林へ → 01:30頃 客室へ戻る（推定）',
      timeline_has_contradiction: true,
      investigation_dialog: {
        greeting:
          '（静かな笑みで）……調査、ですか。青木さんのことは本当に驚きました。何でも話しますよ。',
        statements: [
          '青木さんとは昨日初めてちゃんと話した。明るい方でしたね。こんな形になるとは……信じたくないです。',
          '昨夜は儀式が終わった22時頃に自室に戻りました。朝まで部屋を出ていない——それだけです。',
          '白石さんが私を占ったら黒が出た？ それは何かの間違いじゃないですか。私は普通の村人として参加しています。',
          '深夜に変身する人影を見たと水沢さんが言っているそうですが……暗がりで嵐の夜ですよ。見間違いじゃないですか。',
          '黒田さんが田村さんを人狼だと言っています。あの占い結果書を見れば、田村さんが怪しいと思いますよ。',
        ],
      },
      evidence_reactions: {
        claw_marks: {
          reaction: '獣の爪痕……（視線を逸らす）山の獣に遭ったのでしょうか。',
          behavior: 'evasive',
        },
        wolf_fur: {
          reaction: '灰色の毛……動物のものですよね。山ですし、不思議はないかと。',
          behavior: 'calm',
        },
        torn_clothes: {
          reaction: '（表情が一瞬固まる）……それは、誰の服ですか。私の衣類は揃っているはずですが。',
          behavior: 'nervous',
        },
        oracle_result: {
          reaction: '（目が細くなる）……白石さんの結果書ですか。私が黒、とは……何かの間違いですよ。',
          behavior: 'nervous',
        },
        divination_crystal: {
          reaction: '本物の占術水晶らしいですね。私には関係ない道具ですが。',
          behavior: 'calm',
        },
        bloody_footprint: {
          reaction:
            '足跡……（間が空いて）サイズは分かりますか。私の靴のサイズとは一致しないはずですが。',
          behavior: 'nervous',
          contradicts_statement_index: 1,
          wrong_testimony_response:
            'その証言と足跡のサイズが一致するだけでは、私がそこにいた証明にはなりません。',
          pursuit_questions: [
            {
              id: 'izawa_pq_footprint_1',
              text: 'この足跡のサイズを計測したところ、あなたの靴と完全に一致しました。自室で眠っていたのに、なぜ犯行現場からあなたの部屋方向へ足跡が続くのですか？',
              response:
                '（長い沈黙）……偶然でしょう。同じサイズの人間は他にもいます。それに、朝に外に出たかもしれない。',
              behavior: 'evasive',
              unlocks_pursuit_question_ids: ['izawa_pq_footprint_2'],
            },
            {
              id: 'izawa_pq_footprint_2',
              text: 'これは深夜の足跡です。朝の行動ではありません。昨夜、本当に部屋を出なかったと言えますか？',
              response:
                '（視線が揺れる）……少し、外の空気を吸いに出ただけです。それだけです。それが何の証拠になるんですか。',
              behavior: 'angry',
            },
          ],
        },
        witness_memo: {
          reaction: '変身する人影……（落ち着いた声で）暗がりの見間違いだと思いますよ。',
          behavior: 'evasive',
        },
        ritual_record: {
          reaction: '人狼の特徴と見分け方……古い文書ですね。（さらりと流す）',
          behavior: 'calm',
        },
        lost_pendant: {
          reaction: '（目が動く）……そのペンダントは、どこで見つかりましたか。',
          behavior: 'nervous',
          contradicts_statement_index: 1,
          wrong_testimony_response:
            'ペンダントが現場にあったことと、私が現場にいたことは別の話です。',
          pursuit_questions: [
            {
              id: 'izawa_pq_pendant_1',
              text: '裏の林の犯行現場で発見されました。あなたのものですよね？',
              response:
                '（顔が青ざめる）……私の……ですが、どこで落としたか。自室か廊下か、どこかで……。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['izawa_pq_pendant_2'],
            },
            {
              id: 'izawa_pq_pendant_2',
              text: 'あなたは自室で眠っていたと言いました。自室か廊下で落としたなら、なぜ林の中に？',
              response: '（長い沈黙。口を開きかけて、閉じる）……。',
              behavior: 'evasive',
            },
          ],
          bystander_reactions: [
            {
              suspectId: 'shiraha_seira',
              text: '……やっぱり。昨夜の占いで伊沢さんが「黒」だったのは、間違いじゃなかった。あの目——ずっと気になっていたんです。',
            },
            {
              suspectId: 'mizusawa_kana',
              text: '（震える声で）私が深夜に見た人影——あれは伊沢さんだったの……？ずっと怖かった……。',
            },
          ],
        },
        fake_oracle_result: {
          reaction: '黒田さんの占い結果書ですね。田村さんが黒……確かに気になりますね。',
          behavior: 'calm',
        },
        old_knife: {
          reaction: '田村さんの荷物に銀のナイフがあったんですか。確かに怪しい。',
          behavior: 'calm',
        },
        dried_herbs: {
          reaction: '薬草……田村さんの部屋に。どんな用途のものか調べた方がいいかもしれませんね。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'kuroda_genichi',
      name: '黒田玄一',
      appearance_id: 'male_middle_alt3',
      age: 45,
      occupation: '占星術師',
      default_wrong_pursuit_response:
        'その証拠と私の発言を結びつけるのは飛躍がある。もっと論理的に話してほしい。',
      description:
        'くたびれたスーツ姿の中年男性。生え際が後退し、疲弊した風貌をしている。自称占い師で、この儀式には「本物の霊能を確かめるため」と言って毎年参加している。一見冴えない外見だが、視線に油断ならない鋭さがある。',
      personality: '自信家で独善的。自分の判断を絶対に正しいと信じている。',
      alibi: '儀式終了後は自室で瞑想していたと主張。',
      secret:
        '人狼の側に立つ「狂人」。人狼の存在を信じており、人狼が勝つことを望んでいる。ただし、誰が人狼かは知らない。',
      relationship_to_victim: '面識があった。儀式での会話以上の関係はない。',
      room_id: 'room_ritual',
      timeline:
        '20:30 夕食 → 21:30 儀式の間で偽の占い結果を発表 → 22:00以降 自室で瞑想（本人申告）',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '（腕を組んで）……調査ですか。私が協力できることは限られているが、聞きましょう。',
        statements: [
          '私が本物の占い師だ。昨夜の儀式で田村翔を占った結果、黒（人狼）が出た。田村が人狼の正体です。',
          '白石という女も占い師を名乗っているが、経験も格も違う。どちらが本物か、水晶の質を比べれば明らかだ。',
          '私の水晶は先祖代々受け継いだ本物の占術道具だ。偽物と同じに見えても、反応が全く違う。',
          '青木さんが亡くなった……人狼の仕業に違いない。そして人狼は田村だ。',
          '田村の部屋に怪しいものがあると聞いた。人狼の道具を隠しているに違いない。',
        ],
      },
      evidence_reactions: {
        claw_marks: {
          reaction: 'これが……人狼の爪痕だ。田村のものに違いない。',
          behavior: 'nervous',
        },
        wolf_fur: {
          reaction: 'この灰色の毛……田村が変身した時のものだ。証拠が揃ってきた。',
          behavior: 'nervous',
        },
        torn_clothes: {
          reaction: '誰かの服か……田村の部屋から出たものじゃないのか。',
          behavior: 'evasive',
        },
        oracle_result: {
          reaction: '……白石の結果書か（舌打ち）。あれは偽物だ。私の結果の方が正確に決まっている。',
          behavior: 'angry',
        },
        divination_crystal: {
          reaction: '白石の水晶……見た目は似ているが、私の水晶とは別物だ。',
          behavior: 'nervous',
        },
        bloody_footprint: {
          reaction: '足跡のサイズ……田村のものとも一致するんじゃないか。',
          behavior: 'calm',
        },
        witness_memo: {
          reaction: '水沢が見た人影……田村の変身だ。タイミングが合う。',
          behavior: 'evasive',
        },
        ritual_record: {
          reaction: '（素早く目を通して）……人狼の特徴か。田村に当てはまる点があるな。',
          behavior: 'nervous',
        },
        lost_pendant: {
          reaction: '誰のペンダントだ。田村の可能性もあるんじゃないか。',
          behavior: 'calm',
        },
        fake_oracle_result: {
          reaction: '（ひるんだ様子）……それは私の占い結果書です。何か問題でも？',
          behavior: 'nervous',
          contradicts_statement_index: 0,
          wrong_testimony_response: 'この結果書と私の発言に、直接の矛盾があるとは言えないはずだ。',
          pursuit_questions: [
            {
              id: 'kuroda_pq_oracle_1',
              text: 'あなたは「私が本物の占い師、田村が黒だった」と言いましたが、白石さんの水晶には昨夜の使用痕があります。あなたの水晶に使用痕はありますか？',
              response:
                '（目を細める）……水晶の種類によって痕の残り方は違う。私のは残らないタイプだ。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['kuroda_pq_oracle_2'],
            },
            {
              id: 'kuroda_pq_oracle_2',
              text: '白石さんの水晶は専門家に鑑定されました。本物の占術水晶です。あなたの水晶は？',
              response:
                '（長い沈黙の後）……詮索が過ぎる。私がここで何をしようと、あなたには関係ない。田村が人狼だということには変わりない。',
              behavior: 'angry',
            },
          ],
        },
        old_knife: {
          reaction: '田村の銀のナイフ！ これが証拠だ！ 人狼狩りの道具を隠していたんだ。',
          behavior: 'nervous',
        },
        dried_herbs: {
          reaction: 'これが田村の部屋にあった薬草か……人狼を引き寄せる呪術用のものかもしれない。',
          behavior: 'nervous',
        },
      },
    },
    {
      id: 'shiraha_seira',
      name: '白石星奈',
      appearance_id: 'female_middle_alt2',
      age: 32,
      occupation: '霊媒師',
      default_wrong_pursuit_response:
        'その証言とこの証拠の間に、論理的な矛盾はないように思います。もう一度整理してみてください。',
      description:
        '落ち着いた雰囲気の女性。白い装束を着ており、この儀式では毎年占い師役を担ってきた。声は穏やかだが、発言は常に明確で揺るがない。',
      personality: '冷静で誠実。嘘をつくことを極端に嫌う。',
      alibi: '22時頃から占術室で儀式を行い、深夜2時頃まで滞在していた。',
      secret: '本物の霊能力を持つ占い師。昨夜の占いで伊沢の正体を見抜いている。',
      relationship_to_victim: 'この儀式を通じた顔見知り。',
      room_id: 'room_oracle',
      timeline:
        '20:30 夕食 → 21:00 占術室へ移動・儀式準備 → 22:00 占い結果を発表 → 深夜2時頃まで占術室に残る',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '（静かに頷いて）……真相を調べているのですね。私が知っていることをお伝えします。',
        statements: [
          '私が本物の占い師です。昨夜の儀式で伊沢慧さんを占いました。結果は黒——人狼の反応です。',
          '黒田さんも占い師を名乗っていますが、彼の水晶は本物ではありません。素人目には同じに見えても、私には分かります。',
          '昨夜22時頃から占術室で儀式を行いました。水晶の反応は強く、はっきりとした黒の結果でした。',
          '水沢さんが深夜0時過ぎに変身する人影を目撃したと聞きました。その方向と時刻が、私の占い結果と一致しています。',
          '占い結果は正直なものです。本物の水晶が反応した「黒」は——偽造不可能なはずです。',
        ],
      },
      evidence_reactions: {
        claw_marks: {
          reaction: 'これが爪痕……人狼の変身時の痕跡ね。被害者の傷と一致するはずよ。',
          behavior: 'calm',
        },
        wolf_fur: {
          reaction: '獣毛……変身した証拠。これが残っているということは、人狼は昨夜確かに変身した。',
          behavior: 'calm',
        },
        torn_clothes: {
          reaction: '変身の際に衣服が裂けるのは古来の記録通りね。これは変身した人物のものよ。',
          behavior: 'calm',
        },
        oracle_result: {
          reaction: '（静かに）……私が昨夜書いた占い結果書よ。伊沢慧——黒。間違いない。',
          behavior: 'calm',
        },
        divination_crystal: {
          reaction: '私の水晶よ。この内部の変色が、昨夜の占いで反応した証拠。',
          behavior: 'calm',
        },
        bloody_footprint: {
          reaction: '犯行現場からの足跡……人狼が逃走した経路ね。辿れば誰の部屋に続くか分かる。',
          behavior: 'calm',
        },
        witness_memo: {
          reaction: '水沢さんが見た人影の記録。時刻と方向が、私の占い結果と一致しているわ。',
          behavior: 'calm',
        },
        ritual_record: {
          reaction: '人狼の特徴を記した古文書……伊沢さんの状況と符合する点が多い。',
          behavior: 'calm',
        },
        lost_pendant: {
          reaction: '犯行現場で見つかったペンダント……持ち主を特定すれば決定的な証拠になる。',
          behavior: 'calm',
        },
        fake_oracle_result: {
          reaction:
            '（じっと見つめて）……これは！ 本物そっくりに見えるけど——待って、書式が私のものと違う。',
          behavior: 'nervous',
          contradicts_statement_index: 4,
          wrong_testimony_response:
            'その証言と、この結果書が偽物である事実の間に直接の矛盾はないわ。',
          pursuit_questions: [
            {
              id: 'shiraha_pq_fake_1',
              text: 'あなたは「占い結果は偽造不可能」と言いました。でもこれは本物そっくりに見えます。どう説明しますか？',
              response:
                '……一見本物に見える。でもよく見て——水晶の押印の形が私のものとは違う。誰かが模倣して作ったのよ。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['shiraha_pq_fake_2'],
            },
            {
              id: 'shiraha_pq_fake_2',
              text: '黒田さんの水晶と比べた場合、何が決定的に違いますか？',
              response:
                '（水晶を手に取り）……見て。私の水晶は昨夜の使用で内部に光の屈折跡が残っている。黒田さんのは——使用痕が全くない。昨夜は一度も使っていない、ということよ。',
              behavior: 'calm',
            },
          ],
        },
        old_knife: {
          reaction: '銀製のナイフ……でも人狼に効くほどの純度ではないわ。普通のナイフね。',
          behavior: 'calm',
        },
        dried_herbs: {
          reaction: 'これは一般的な傷薬の薬草よ。人狼とは無関係ね。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'tamura_shou',
      name: '田村翔',
      appearance_id: 'male_young_alt3',
      age: 29,
      occupation: '会社員',
      default_wrong_pursuit_response:
        'それが私の行動と結びつくとは思えないんですが。もう少し整理してもらえますか。',
      description:
        '短い黒髪にパーカー姿のスポーティな若い男性。山歩きが趣味で、この儀式には3年前から参加している。黒田から「人狼」と告発されて困惑しており、緊張した面持ちで警戒心を見せている。',
      personality: '真面目で正直。不当な疑いに対しては強く反論する。',
      alibi: '大堂芳子と大広間で深夜2時頃まで話し込んでいた。',
      secret:
        '山歩きの護身用に銀色のナイフを持参していたが、場の雰囲気を考えて申告していなかった。',
      relationship_to_victim: '昨年も同じ儀式に参加した顔見知り。',
      room_id: 'room_storage',
      timeline: '20:30 夕食 → 22:00以降 大堂芳子と大広間で談笑 → 深夜2時頃就寝（大堂証言あり）',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting:
          '（苛立ちを抑えながら）……聞いてください。私は人狼じゃない。黒田さんが嘘をついているんです。',
        statements: [
          '黒田さんの占い結果は嘘です。私は人狼じゃない。白石さんの結果の方を信じてください。',
          '昨夜は22時過ぎから大堂さんと大広間で話し込んでいました。深夜2時頃まで一緒にいた。大堂さんが証言してくれるはずです。',
          '青木さんとは今年初めて会った。面識はほとんどなかったけど、楽しそうな人でしたよ。',
          '荷物に人狼と関係するものは何も持ってきていません。完全に普通の一般人です。',
          '白石さんの占いを信じてほしい。伊沢さんが黒（人狼）なんです。',
        ],
      },
      evidence_reactions: {
        claw_marks: {
          reaction: '青木さんに……こんなことが（目を逸らす）。人狼が本当にいるんですね。',
          behavior: 'sad',
        },
        wolf_fur: {
          reaction: '獣毛……本物の人狼がいる証拠ですね。私じゃないです、絶対に。',
          behavior: 'nervous',
        },
        torn_clothes: {
          reaction: '変身で服が破れた……ということは、この服の持ち主が人狼ですよね。',
          behavior: 'calm',
        },
        oracle_result: {
          reaction: '白石さんの結果書です！ これが本物です！ 伊沢さんが黒なんですよ。',
          behavior: 'angry',
        },
        divination_crystal: {
          reaction: '白石さんの水晶……本物の占術道具なんですね。',
          behavior: 'calm',
        },
        bloody_footprint: {
          reaction: '足跡……これ、私のじゃないです。サイズが違うはずです。',
          behavior: 'calm',
        },
        witness_memo: {
          reaction: '水沢さんの目撃証言……伊沢さんの方向ですよね、これ。',
          behavior: 'calm',
        },
        ritual_record: {
          reaction: '人狼の特徴……伊沢さんに当てはまることが書いてありますよね。',
          behavior: 'calm',
        },
        lost_pendant: {
          reaction: '犯行現場のペンダント……誰のものか分かれば犯人の特定に繋がりますね。',
          behavior: 'nervous',
        },
        fake_oracle_result: {
          reaction: '黒田さんの嘘の結果書！ これで私が人狼みたいに見えてますが全部嘘です！',
          behavior: 'angry',
        },
        old_knife: {
          reaction: '……（少し間が空く）あの、それは確かに私の荷物に入っていたものですが……。',
          behavior: 'nervous',
          contradicts_statement_index: 3,
          wrong_testimony_response:
            'その証言と、ナイフを持参していたこととは直接の矛盾にはならないはずですが。',
          pursuit_questions: [
            {
              id: 'tamura_pq_knife_1',
              text: '人狼と関係するものは持ってきていないと言いましたが、銀のナイフはどういうことですか？',
              response:
                'す、すみません。山に来る時の護身用に持ってきていて……言うのを忘れていました。',
              behavior: 'nervous',
              unlocks_pursuit_question_ids: ['tamura_pq_knife_2'],
            },
            {
              id: 'tamura_pq_knife_2',
              text: 'なぜ最初から申告しなかったのですか？',
              response:
                '（うなずいて）……この状況で銀のナイフを持っていると言ったら絶対に怪しまれると思って。でもこれは登山用品店で買ったステンレス製のナイフで、銀製じゃないですよ。確認してもらえれば分かります。',
              behavior: 'evasive',
            },
          ],
        },
        dried_herbs: {
          reaction: '薬草……ああ、それは私が持ってきた傷薬の材料です。山歩きで使うんで。',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'mizusawa_kana',
      name: '水沢加奈',
      appearance_id: 'female_teen_alt',
      age: 24,
      occupation: '大学生',
      default_wrong_pursuit_response:
        'その証言はこの証拠とは関係ないように思いますが……私の見方が違うでしょうか。',
      description:
        '小柄で神経質そうな印象の女性。大学で民俗学を専攻しており、大堂の紹介でこの儀式に参加した。昨夜見た「変身する人影」に今も動揺している。',
      personality: '観察眼が鋭い。正直だが、恐怖から行動を隠すことがある。',
      alibi: '自室の窓から外を観察していたと主張。ただし一度だけ外に出たことを最初は隠していた。',
      secret: '深夜に怖くなって一度だけ外に出て確認しようとしたが、林には入っていない。',
      relationship_to_victim: '今年初めて会った。',
      room_id: 'room_forest',
      timeline:
        '20:30 夕食 → 22:00 自室へ → 23:30頃 窓から外の観察開始 → 深夜0時頃 変身する人影を目撃 → 0時30分頃 裏口まで外出（約5分）→ 自室へ戻る',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting: '（青い顔で）……昨夜見たことがまだ頭から離れなくて。何でも話します。',
        statements: [
          '深夜0時過ぎ、窓から外を見ていたら……人が変身するような影を見ました。夢じゃないと思う。',
          '人影は裏の林の方向に向かっていきました。身長は高めで、走り方が普通じゃなかった。',
          '変身の瞬間、すごい音がした。骨が……そんな音が。今でも頭から離れない。',
          '私は昨夜、室内からずっと外を観察していました。外に出たことは一切ありません。',
          '伊沢さんを見た時、なんとなく変な感じがしていました。目の色というか……視線が怖かった。',
        ],
      },
      evidence_reactions: {
        claw_marks: {
          reaction: '……これが青木さんの傷に（目を逸らす）。見ているだけで気分が悪くなる。',
          behavior: 'nervous',
        },
        wolf_fur: {
          reaction: 'この毛が……あの夜見た人影と関係しているんですね。',
          behavior: 'nervous',
        },
        torn_clothes: {
          reaction: '変身で服が破れた……ということは、この服の持ち主が……。',
          behavior: 'nervous',
        },
        oracle_result: {
          reaction:
            '白石さんの占い結果……伊沢さんが黒。私の目撃した人影の方向と一致している気がします。',
          behavior: 'calm',
        },
        divination_crystal: {
          reaction: '白石さんの水晶。本物なんですね。',
          behavior: 'calm',
        },
        bloody_footprint: {
          reaction: '（足跡を見て、動揺が走る）あ……この足跡……。',
          behavior: 'nervous',
          contradicts_statement_index: 3,
          wrong_testimony_response:
            'その証言と、この足跡の存在に直接の矛盾があるとは言い切れません。',
          pursuit_questions: [
            {
              id: 'mizusawa_pq_footprint_1',
              text: 'あなたは室内からずっと外を見ていたと言いました。この足跡は裏口付近にもあります。',
              response:
                '（少し間が空いて）……ごめんなさい。一度だけ外に出ました。怖くて……確認したくて。でも林には入っていないです。',
              behavior: 'sad',
              unlocks_pursuit_question_ids: ['mizusawa_pq_footprint_2'],
            },
            {
              id: 'mizusawa_pq_footprint_2',
              text: '何時頃、どのくらい外にいましたか？',
              response:
                '0時30分くらいに、5分くらいだと思います。裏口のところまでです。足跡があるとしたらそれです——林の中には絶対入っていない。怖くて無理でした。',
              behavior: 'sad',
            },
          ],
        },
        witness_memo: {
          reaction: '……これは私が昨夜書いたメモです。あの時見たことを忘れないように。',
          behavior: 'nervous',
        },
        ritual_record: {
          reaction: '人狼の記録……こんな文書が本当にあったんですね。',
          behavior: 'calm',
        },
        lost_pendant: {
          reaction: '犯行現場のペンダント……誰のものか特定できますか。',
          behavior: 'calm',
        },
        fake_oracle_result: {
          reaction: '黒田さんの占い結果書ですね。でも田村さんが人狼という気はしないんですが。',
          behavior: 'calm',
        },
        old_knife: {
          reaction: '田村さんの荷物にあったものですか。',
          behavior: 'calm',
        },
        dried_herbs: {
          reaction: '薬草……田村さんが持ってきたもの？',
          behavior: 'calm',
        },
      },
    },
    {
      id: 'odo_saburo',
      name: '大堂芳子',
      appearance_id: 'female_elderly',
      age: 62,
      occupation: '民俗学者（退職）',
      default_wrong_pursuit_response:
        'その証拠とその証言の間に矛盾があるとは、私には判断しかねますね。',
      description:
        '銀髪を上品にまとめた初老の女性。元民俗学者で、この儀式を30年前に「復活」させた人物。威厳ある佇まいの中にどこか憂いを帯びた表情を見せる。人狼に関する知識は参加者の誰よりも深い。田村のアリバイを保証できる立場にある。',
      personality: '温厚で物知り。ただし過去に重大な事実を隠していた。',
      alibi: '田村翔と深夜2時頃まで大広間で話し込んでいた。',
      secret:
        '14年前にも同じ儀式で人狼が現れて死者が出たことを知っており、若い参加者に隠していた。',
      relationship_to_victim: '儀式の主催者として青木を勧誘した人物。',
      room_id: 'room_ritual',
      timeline:
        '20:30 夕食・儀式進行 → 22:00以降 大広間で田村翔と談笑 → 深夜1時頃就寝（田村証言あり）',
      timeline_has_contradiction: false,
      investigation_dialog: {
        greeting:
          '（重くため息をついて）……青木君が……私が呼んだのです。責任を感じています。何でも聞いてください。',
        statements: [
          'この「月の夜の儀式」は300年以上続く古い慣わしです。人狼の血筋が現れた時のために続けてきました。',
          '占いの結果が2つ出るのは「占い師対決」——どちらかが嘘をついている。それを見破るのが村人の知恵です。',
          '長年この儀式に参加してきましたが、本物の人狼が現れたことは、これまで一度もありませんでした。',
          '田村君は昨夜ずっと私と話し込んでいました。深夜2時まで一緒でした。彼のアリバイは私が保証します。',
          '人狼を見分けるには、爪痕と獣毛の一致が決定的証拠となります。昔の文献にそう書かれています。',
        ],
      },
      evidence_reactions: {
        claw_marks: {
          reaction: 'これが……。古い文献に記された人狼の爪痕と一致します。青木君が気の毒です。',
          behavior: 'sad',
        },
        wolf_fur: {
          reaction: 'この毛……変身の証拠です。本物の人狼が来たということでしょうか。',
          behavior: 'sad',
        },
        torn_clothes: {
          reaction:
            '変身時の衣服の破損は記録にあります。これが本物なら、変身した人物の部屋を調べるべきです。',
          behavior: 'calm',
        },
        oracle_result: {
          reaction: '白石さんの占い結果……本物の水晶による判定なら信頼できます。',
          behavior: 'calm',
        },
        divination_crystal: {
          reaction: 'これが白石さんの水晶ですか。使用痕がある——昨夜確かに使われた証拠です。',
          behavior: 'calm',
        },
        bloody_footprint: {
          reaction:
            '足跡……犯行現場から誰かの部屋方向へ向かっています。丁寧に追えば犯人が分かるはずです。',
          behavior: 'calm',
        },
        witness_memo: {
          reaction: '水沢さんの目撃記録ですね。深夜0時——変身の時刻と合致します。',
          behavior: 'calm',
        },
        ritual_record: {
          reaction: '（目を細めて読む）……これは……14年前の記録も載っているのですか。',
          behavior: 'nervous',
          contradicts_statement_index: 2,
          wrong_testimony_response:
            'その証言と、14年前の記録の存在に直接の矛盾があるとは言い切れません。',
          pursuit_questions: [
            {
              id: 'odo_pq_record_1',
              text: 'この記録には14年前にも人狼が現れて死者が出たと書かれています。あなたは知っていましたか？',
              response:
                '（長い沈黙）……ええ。14年前に一人亡くなりました。私は……若い参加者に言えなかったのです。',
              behavior: 'sad',
              unlocks_pursuit_question_ids: ['odo_pq_record_2'],
            },
            {
              id: 'odo_pq_record_2',
              text: 'なぜ隠していたのですか？ 伝えていれば青木さんが守れたかもしれません。',
              response:
                '（深く頭を垂れる）……怖がらせたくなかったのです。儀式を続けたかった。それが判断ミスでした。今回のことがあれば、最初から全員に告げておくべきだった——申し訳ありません。',
              behavior: 'sad',
            },
          ],
        },
        lost_pendant: {
          reaction: '犯行現場のペンダント……どこかで見た気がしますが。誰のものか思い出せません。',
          behavior: 'calm',
        },
        fake_oracle_result: {
          reaction:
            '黒田の結果書ですか……本物らしく作られていますが、水晶の使用痕がない点が引っかかります。',
          behavior: 'calm',
        },
        old_knife: {
          reaction: '銀のナイフ……田村君が持っていたのですか。しかしこれは登山用の道具のようです。',
          behavior: 'calm',
        },
        dried_herbs: {
          reaction: '薬草ですか……山歩きで採取した傷薬でしょう。人狼とは無関係です。',
          behavior: 'calm',
        },
      },
    },
  ],
  rooms: [
    {
      id: 'room_ritual',
      name: '儀式の間',
      type_id: 'dining_room',
      description:
        '民宿の大広間を改装した儀式の場。長テーブルの中央にランプが灯され、昨夜ここで役職が配られた。2つの「占い師」を名乗る者が互いの結果書を突き付け合ったのもこの部屋だ。テーブルの上には昨夜の儀式の痕跡が残っている。',
      evidence_ids: ['oracle_result', 'fake_oracle_result', 'ritual_record'],
    },
    {
      id: 'room_forest',
      name: '裏の林',
      type_id: 'garden',
      description:
        '民宿の裏手に広がる深い林。青木亮の遺体が発見された犯行現場だ。満月の光が木々の隙間から差し込み、湿った地面に足跡を鮮明に残している。茂みには何かが引っかかった形跡があり、変身の痕跡が随所に残る。',
      evidence_ids: ['claw_marks', 'wolf_fur', 'bloody_footprint'],
    },
    {
      id: 'room_oracle',
      name: '占術室',
      type_id: 'study',
      description:
        '白石星奈が昨夜儀式を行った小部屋。古い木製の棚に霊能道具が並び、卓上の水晶台にはまだ使用の熱が残っている。部屋の窓は裏の林に面しており、深夜の人影が見えやすい位置にある。',
      evidence_ids: ['divination_crystal', 'witness_memo'],
    },
    {
      id: 'room_izawa',
      name: '伊沢の客室',
      type_id: 'bedroom',
      description:
        '伊沢慧に割り当てられた二階の客室。一見整頓されているが、衣装ケースの下に破れた布が落ちていた。窓の鍵は内側から閉まっているが、框に細かな傷がある。林に面した窓からは犯行現場が直接見える。',
      evidence_ids: ['torn_clothes', 'lost_pendant'],
    },
    {
      id: 'room_storage',
      name: '物置部屋',
      type_id: 'attic',
      description:
        '民宿の裏手にある物置兼用の倉庫。参加者の荷物の一部が保管されており、田村翔の荷物もここに置かれていた。古い農具や山道具が混在しており、田村のバックパックの中から怪しいものが発見された。',
      evidence_ids: ['old_knife', 'dried_herbs'],
    },
  ],
  evidence: [
    {
      id: 'claw_marks',
      name: '爪痕の写し',
      category_id: 'photograph',
      description:
        '青木亮の遺体の胸部と肩部に残る深い爪痕を撮影した写真。4本の平行した爪痕は人間の爪では作れない深さと間隔で、かつ指の付け根付近に獣の爪の特徴が見られる。',
      is_fake: false,
      relevance: '人狼による犯行の直接証拠。変身状態で攻撃されたことを示す。',
      examination_notes:
        '爪痕の形状・深さ・間隔を分析すると、人間の爪と動物の爪の中間的な特徴を持つ。医師の見解では「人間の手によるものではない」とされており、変身した人狼による攻撃と一致する。これと同じ特徴の爪跡を残せる生物は、変身状態の人狼以外に考えにくい。',
    },
    {
      id: 'wolf_fur',
      name: '灰色の獣毛',
      category_id: 'fabric',
      description:
        '犯行現場の茂みに残っていた灰色の毛の束。人間の髪よりも太く硬く、明らかに動物の毛だが、根元付近には人毛との移行的な特徴が見られる。',
      is_fake: false,
      relevance: '人狼の変身を示す物的証拠。変身中に残置された体毛と推定。',
      examination_notes:
        '毛の断面分析を行うと、根元側が人間の髪と同じ構造を持ち、先端に向かって大型犬に近い獣毛の構造に変化している。この「混成構造」は変身の過渡状態でのみ生じると古来の記録にもある。同一の毛が犯行現場と伊沢の客室近くで採取されており、変身した人物を特定する根拠となる。',
    },
    {
      id: 'torn_clothes',
      name: '破れた衣服片',
      category_id: 'clothing',
      description:
        '伊沢の客室の床に落ちていた布の断片。シャツの袖口と思われる部分が、縫い目ではなく布地自体が内側から裂けたように破れている。伊沢が着ていたシャツと同じ素材だ。',
      is_fake: false,
      relevance: '変身時に衣服が破れた痕跡。変身した本人の部屋から発見された。',
      examination_notes:
        '布の破断面を顕微鏡で確認すると、縫い目からではなく繊維が内側の膨張圧力で裂けた特徴が見られる。これは人体が急激に膨張・変形した際に生じる破断の典型的なパターンだ。発見場所が伊沢の客室であることと合わせると、この部屋の使用者が変身したことを示す。',
    },
    {
      id: 'oracle_result',
      name: '占い結果書（本物）',
      category_id: 'document_contract',
      description:
        '白石星奈が昨夜の儀式で書いた占い結果書。儀式用の和紙に毛筆で「伊沢慧：黒（人狼）」と記され、水晶の使用印が押されている。インクはまだ24時間以内のものだ。',
      is_fake: false,
      relevance: '本物の占い師による人狼の特定。これが決定的証拠となる。',
      examination_notes:
        '結果書に押された水晶の印は、本物の占術水晶でなければ再現できない特殊な光の屈折跡を残す。白石の水晶と照合すると完全に一致した。また筆跡は白石のものと鑑定一致。「黒（人狼）」という判定は、人狼の血脈に反応する本物の占いの結果だ。',
    },
    {
      id: 'divination_crystal',
      name: '占術の水晶',
      category_id: 'container',
      description:
        '白石星奈が使用する占術専用の水晶球。内部に微細な亀裂が走り、強い光を当てると独特の虹色の屈折が生じる。昨夜の使用後、内部に新たな熱変性の跡が残っている。',
      is_fake: false,
      relevance: '本物の占術道具の証明。使用痕が昨夜の儀式実施を裏付ける。',
      examination_notes:
        '水晶内部の熱変性跡（昨夜の使用によるもの）を確認した。本物の占術水晶は人狼の気配に反応して内部温度が上昇し、この変性跡を残す。黒田の水晶と比較すると、黒田のものには使用痕が一切なく、昨夜は一度も使用されていないことが判明した。白石の水晶が本物であることは、占い結果書の信頼性を直接裏付ける。',
    },
    {
      id: 'bloody_footprint',
      name: '血の足跡',
      category_id: 'blood_stain',
      description:
        '裏の林の犯行現場から民宿の裏口を経て、二階の特定の客室方向へ続く足跡。靴底のパターンと26.5cmのサイズが確認できる。場所によっては薄い血の痕が混じっている。',
      is_fake: false,
      relevance: '犯行後の逃走ルートと犯人の特定証拠。客室の方向が示す人物が犯人。',
      examination_notes:
        '足跡のサイズ（26.5cm）と靴底パターンを参加者全員のものと照合した結果、伊沢慧の靴と完全に一致した。足跡は犯行現場から伊沢の客室方向へ続いており、逆方向（自室→林）の足跡は確認されていない。伊沢が「自室で朝まで眠っていた」という証言と直接矛盾する物的証拠だ。',
    },
    {
      id: 'witness_memo',
      name: '目撃記録メモ',
      category_id: 'document_letter',
      description:
        '水沢加奈が深夜に書いたメモ。「深夜0:05 占術室側の窓から裏の林方向に人影を目撃。変身するような動作——骨の音。身長170cm以上。走り方が異常」と記されている。手書きの文字は動揺しているのか乱れている。',
      is_fake: false,
      relevance: '変身した人狼を目撃した証言の記録。時刻と方向が犯行と一致する。',
      examination_notes:
        '目撃時刻（深夜0:05）と犯行推定時刻（23:30〜01:30）が一致する。目撃方向は占術室の窓から「裏の林の北東区画」であり、遺体発見場所と同じエリアだ。また「骨の音」という描写は人狼の変身過程で生じる骨格の変形音と古い記録に一致する。この証言が本物なら、変身した犯人を目撃したことになる。',
    },
    {
      id: 'ritual_record',
      name: '儀式の古文書',
      category_id: 'document_diary',
      description:
        'この儀式の記録を300年にわたって記し続けた古文書。人狼の特徴・見分け方・弱点が記されているが、最後のページに14年前の出来事も記録されている。',
      is_fake: false,
      relevance: '人狼の特徴と過去の事件記録。今回の証拠との照合に使える。',
      examination_notes:
        '古文書の記述によると、人狼の見分け方は「変身時の爪痕の形状」「獣毛と人毛の混成」「本物の占術水晶への反応」の三点が決め手とされている。今回発見された証拠はいずれもこれに合致する。また14年前にも同様の事件が起きており、その時の犯人の特徴が今回の状況と一致する点がある。',
    },
    {
      id: 'lost_pendant',
      name: '落とされたペンダント',
      category_id: 'jewelry',
      description:
        '犯行現場の林の中に落ちていたシルバー製のペンダント。チェーンが途中で切れており、激しい動作の際に外れたと思われる。裏面に持ち主の名前のイニシャルと思われる彫刻がある。',
      is_fake: false,
      relevance: '犯人が犯行現場に落とした個人の持ち物。所有者が現場にいた証拠。',
      examination_notes:
        'ペンダント裏面の彫刻「K.I.」は伊沢慧のイニシャルに一致する（Kei Izawa）。参加者への確認でも、このデザインのペンダントを持っているのは伊沢だけだ。チェーンの切断面は引きちぎられた形跡があり、変身の際の体格変化で外れたと推定される。伊沢が「自室にいた」という主張と直接矛盾する決定的な物証だ。',
    },
    {
      id: 'fake_oracle_result',
      name: '偽の占い結果書',
      category_id: 'document_contract',
      description:
        '黒田玄一が提示する占い結果書。儀式用の和紙に「田村翔：黒（人狼）」と記されており、水晶の使用印のようなものが押されている。一見すると白石の結果書と見分けがつかない。',
      is_fake: true,
      first_impression:
        '本物と見紛う出来栄えの結果書。「田村翔：黒（人狼）」という記述と水晶の印——これが本物なら、田村こそが人狼の正体ということになる。二人の占い師が互いに相手を偽物と言い合っている今、どちらが本物かを見極めることが推理の核心だ。',
      relevance: '狂人が作成した偽の占い結果。田村への疑いを誘導するためのもの。',
      examination_notes:
        '結果書に押された「水晶の印」を本物の占術水晶の印と比較すると、光の屈折跡のパターンが異なる。本物の水晶による印は内部の亀裂構造が独自のパターンを作るが、これは別の素材（おそらくガラス球）で模倣したものだ。また田村翔には深夜2時頃まで大堂芳子との同席が証言されており、犯行時刻の行動と矛盾する。',
    },
    {
      id: 'old_knife',
      name: '古い銀色のナイフ',
      category_id: 'weapon_blade',
      description:
        '田村翔の荷物から発見された折りたたみナイフ。刃が銀色に輝いており、一見すると人狼を傷つけるための銀製武器のように見える。持ち手には使用感がある。',
      is_fake: true,
      first_impression:
        '銀に輝く刃——人狼を狩るための専用武器を連想させる。田村の荷物にこのナイフがあったという事実は、彼が人狼の存在を知っていた（あるいは自分が人狼であることを自覚していた）ことを示唆するかもしれない。',
      relevance: '一見すると人狼狩りの凶器に見えるが、実際は一般的な登山用ナイフ。',
      examination_notes:
        '成分分析の結果、刃の素材は純銀ではなくステンレス鋼（SUS304）と判明した。銀含有量は0.01%以下で、人狼への効力はない。登山用品店で一般販売されているモデルと一致し、田村も「山歩き用の護身具」と説明した。人狼狩りとの関連は否定される。',
    },
    {
      id: 'dried_herbs',
      name: '乾燥した薬草束',
      category_id: 'medicine',
      description:
        '田村の荷物に入っていた数種の乾燥薬草を束ねたもの。一部には独特の香りがあり、民俗的な呪術用の材料に使われる薬草と外見が似ている。',
      is_fake: true,
      first_impression:
        '人狼に関連する儀式用の薬草に外見が似ている。呪術的な目的で人狼を操る、あるいは自分の変身を制御するために持参した可能性がある。田村が人狼と何らかの接点を持つことを示唆するかもしれない。',
      relevance: '一見すると呪術用の薬草に見えるが、実際は市販の民間薬材料。',
      examination_notes:
        '植物分類の専門家に確認したところ、これはドクダミ・ヨモギ・カキドオシの混合で、傷の消毒と止血に使われる一般的な民間薬の材料と判明した。田村は「山歩きで怪我をした時用に自分で作った傷薬」と説明し、製法が書かれたメモも発見された。人狼や呪術との関連は完全に否定される。',
    },
  ],
  evidence_combinations: [
    {
      id: 'combo_wolf_proof',
      evidence_ids: ['claw_marks', 'wolf_fur'],
      name: '爪痕と獣毛が同一生物由来と判明した',
      description:
        '爪痕の形状と灰色の獣毛の分析が一致した。根元が人毛、先端が獣毛という混成構造は変身中の人狼でなければ説明できない。被害者の傷も同じ生物によるものと確定。今夜の儀式に本物の人狼が紛れ込んでいたことが物証として確定した。',
      is_critical: true,
      refutation_text:
        '爪痕の形状と採取された灰色の獣毛が同一の生物由来と分析された。根元が人毛、先端が獣毛という混成構造は、変身という説明以外に存在しない。被害者の傷を残した者が、昨夜この場にいたことが物証によって確定する。',
    },
    {
      id: 'combo_real_oracle',
      evidence_ids: ['oracle_result', 'divination_crystal'],
      name: '白石星奈が本物の占い師であることが確定した',
      description:
        '白石の水晶には昨夜の使用痕（熱変性跡）が確認された。黒田の水晶には使用痕が全くない——昨夜は一度も使っていない証拠だ。本物の水晶による判定「伊沢慧：黒（人狼）」は偽造不可能であり、これが占い師対決の決着となる。',
      is_critical: true,
      refutation_text:
        '白石の水晶には昨夜の使用痕が確認され、判定「伊沢慧：黒（人狼）」は本物の占い師による偽造不可能な結果だ。一方、黒田の水晶には使用痕がなく、昨夜は一度も使われていない——偽の占い結果が村人を誘導するために仕込まれた証拠だ。',
    },
    {
      id: 'combo_killer_at_scene',
      evidence_ids: ['bloody_footprint', 'lost_pendant'],
      name: '伊沢慧が犯行現場にいたことが物証で確定した',
      description:
        '犯行現場から伊沢の客室方向へ続く足跡のサイズと、現場に落ちていたペンダントのイニシャルが伊沢と一致した。「自室で朝まで眠っていた」というアリバイは崩れる——伊沢慧は確かに昨夜の深夜に裏の林にいた。',
      is_critical: true,
      refutation_text:
        '犯行現場から一方向へ続く血の足跡のサイズと、現場に落ちていたペンダントのイニシャルが一致した。「自室で朝まで眠っていた」というアリバイは、二点の物証によって崩れ落ちる。昨夜の深夜、この人物は確かに裏の林にいた。',
    },
    {
      id: 'combo_fake_oracle_exposed',
      evidence_ids: ['fake_oracle_result', 'oracle_result'],
      name: '二つの占い結果が矛盾している——どちらかが嘘だ',
      description:
        '「田村翔：黒」と「伊沢慧：黒」という二つの占い結果書が存在する。どちらかを出した者が本物の占い師で、もう一方は嘘をついている。水晶の使用痕と田村のアリバイを確認すれば、どちらが偽物かが明らかになる。',
      is_critical: false,
      refutation_text:
        '二枚の占い結果書が存在する——一方は本物の占い師による正確な判定、もう一方は村人を混乱させるために作られた偽物だ。水晶の使用痕が本物を特定し、矛盾は解消された。人狼の正体が、論理の輪の中に浮かび上がる。',
    },
  ],
  accusation_data: FIXED_ACCUSATION_DATA_3,
}
