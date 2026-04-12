// デバッグページ用アセット定義
import { assetUrl } from '../../utils/assetUrl'

export interface ImageAsset {
  path: string
  label: string
  isDefault?: boolean
}

export interface BgmAsset {
  path: string
  label: string
  category: string
}

export interface SeAsset {
  path: string
  label: string
  key: string
}

// assetUrl を適用した ImageAsset / BgmAsset / SeAsset を生成するヘルパー
const img = (path: string, label: string, isDefault?: boolean): ImageAsset => ({
  path: assetUrl(path),
  label,
  isDefault,
})
const bgm = (path: string, label: string, category: string): BgmAsset => ({
  path: assetUrl(path),
  label,
  category,
})
const se = (path: string, label: string, key: string): SeAsset => ({
  path: assetUrl(path),
  label,
  key,
})

// キャラクター画像
export const CHARACTER_ASSETS: ImageAsset[] = [
  img('/assets/characters/default_character.png', 'デフォルト（中性的）', true),
  img('/assets/characters/male_teen.png', '男性・10代'),
  img('/assets/characters/male_teen_alt.png', '男性・10代（別）'),
  img('/assets/characters/male_young.png', '男性・20〜30代'),
  img('/assets/characters/male_young_alt.png', '男性・20〜30代（別）'),
  img('/assets/characters/male_young_alt2.png', '男性・20〜30代（メガネ）'),
  img('/assets/characters/male_young_alt3.png', '男性・20〜30代（ストリート）'),
  img('/assets/characters/male_middle.png', '男性・中年'),
  img('/assets/characters/male_middle_alt.png', '男性・中年（別）'),
  img('/assets/characters/male_middle_alt2.png', '男性・中年（強面）'),
  img('/assets/characters/male_middle_alt3.png', '男性・中年（疲弊）'),
  img('/assets/characters/male_elderly.png', '男性・老年'),
  img('/assets/characters/male_elderly_alt.png', '男性・老年（白髭）'),
  img('/assets/characters/female_teen.png', '女性・10代'),
  img('/assets/characters/female_teen_alt.png', '女性・10代（ツインテール）'),
  img('/assets/characters/female_young.png', '女性・20〜30代'),
  img('/assets/characters/female_young_alt.png', '女性・20〜30代（別）'),
  img('/assets/characters/female_young_alt2.png', '女性・20〜30代（ポニーテール）'),
  img('/assets/characters/female_young_alt3.png', '女性・20〜30代（ウェーブ）'),
  img('/assets/characters/female_middle.png', '女性・中年'),
  img('/assets/characters/female_middle_alt.png', '女性・中年（髷）'),
  img('/assets/characters/female_middle_alt2.png', '女性・中年（巻き髪）'),
  img('/assets/characters/female_middle_alt3.png', '女性・中年（カーディガン）'),
  img('/assets/characters/female_elderly.png', '女性・老年'),
  img('/assets/characters/female_elderly_alt.png', '女性・老年（三つ編み）'),
]

// 部屋画像
export const ROOM_ASSETS: ImageAsset[] = [
  img('/assets/rooms/default_room.png', 'デフォルト', true),
  img('/assets/rooms/study.png', '書斎'),
  img('/assets/rooms/kitchen.png', 'キッチン'),
  img('/assets/rooms/bedroom.png', '寝室'),
  img('/assets/rooms/dining_room.png', 'ダイニング'),
  img('/assets/rooms/library.png', '図書室'),
  img('/assets/rooms/garden.png', '庭園'),
  img('/assets/rooms/hallway.png', '廊下'),
  img('/assets/rooms/basement.png', '地下室'),
  img('/assets/rooms/attic.png', '屋根裏'),
  img('/assets/rooms/bathroom.png', '浴室'),
]

// 館背景画像
export const MANSION_ASSETS: ImageAsset[] = [
  img('/assets/mansion/default_mansion.png', 'デフォルト', true),
  img('/assets/mansion/mansion_gothic.png', 'ゴシック洋館'),
  img('/assets/mansion/mansion_japanese.png', '日本家屋'),
  img('/assets/mansion/mansion_seaside.png', '孤島・海辺'),
  img('/assets/mansion/mansion_forest.png', '深森の屋敷'),
  img('/assets/mansion/mansion_snowy.png', '雪景色の館'),
  img('/assets/mansion/mansion_night.png', '月夜の館'),
  img('/assets/mansion/mansion_ruins.png', '廃墟・古城'),
]

// 証拠品アイコン
export const EVIDENCE_ASSETS: ImageAsset[] = [
  img('/assets/evidence/default_evidence.png', 'デフォルト（虫眼鏡）', true),
  img('/assets/evidence/weapon_blade.png', '刃物'),
  img('/assets/evidence/weapon_blunt.png', '鈍器'),
  img('/assets/evidence/weapon_firearm.png', '銃器'),
  img('/assets/evidence/poison.png', '毒物'),
  img('/assets/evidence/document_letter.png', '手紙・メモ'),
  img('/assets/evidence/document_diary.png', '日記'),
  img('/assets/evidence/document_contract.png', '契約書・遺言書'),
  img('/assets/evidence/clothing.png', '衣類・靴'),
  img('/assets/evidence/jewelry.png', '装飾品'),
  img('/assets/evidence/key.png', '鍵'),
  img('/assets/evidence/container.png', '容器・グラス'),
  // 以下は画像未配置（フォールバック表示で確認可）
  img('/assets/evidence/photograph.png', '写真・画像'),
  img('/assets/evidence/medicine.png', '薬品'),
  img('/assets/evidence/food_drink.png', '食物・飲料'),
  img('/assets/evidence/tool.png', '道具'),
  img('/assets/evidence/fabric.png', '布・ハンカチ'),
  img('/assets/evidence/fingerprint.png', '指紋'),
  img('/assets/evidence/blood_stain.png', '血痕'),
]

export const SE_ASSETS: SeAsset[] = [
  se('/assets/se/click.mp3', 'クリック音', 'click'),
  se('/assets/se/move.mp3', '移動音', 'move'),
  se('/assets/se/combination_discovered.mp3', '組み合わせ発見', 'combination_discovered'),
  se('/assets/se/evidence_examine.mp3', '証拠調査', 'evidence_examine'),
  se('/assets/se/fake_revealed.mp3', '偽証暴露', 'fake_revealed'),
  se('/assets/se/confront.mp3', '証拠突きつけ', 'confront'),
]

// BGM（将来追加予定）
// ファイルを public/assets/bgm/ に配置し、以下に追加する
export const BGM_ASSETS: BgmAsset[] = [
  bgm('/assets/bgm/The Manor Awaits.ogg', 'The Manor Awaits', 'タイトル / シナリオ選択'),
  bgm(
    '/assets/bgm/A Death in the Parlour.ogg',
    'A Death in the Parlour',
    'ブリーフィング（事件概要）'
  ),
  bgm('/assets/bgm/Candlelit Clues.ogg', 'Candlelit Clues', '捜査フェーズ ★ 最重要'),
  bgm('/assets/bgm/Cross-Examination.ogg', 'Cross-Examination', '議論フェーズ'),
  bgm('/assets/bgm/The Verdict.ogg', 'The Verdict', '投票フェーズ'),
  bgm('/assets/bgm/Unmasked.ogg', 'Unmasked', '告発フェーズ（正解ルート）★クライマックス'),
  bgm('/assets/bgm/Wrong Accusation.ogg', 'Wrong Accusation', '告発フェーズ（不正解ルート）'),
  bgm(
    '/assets/bgm/Truth Revealed.ogg',
    'Truth Revealed',
    'エンディング（正解・真相解明）★カタルシス'
  ),
  bgm(
    '/assets/bgm/The One That Got Away.ogg',
    'The One That Got Away',
    'エンディング（不正解・真犯人逃走）'
  ),
]
