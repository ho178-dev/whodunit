// デバッグページ用アセット定義

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

// キャラクター画像
export const CHARACTER_ASSETS: ImageAsset[] = [
  {
    path: '/assets/characters/default_character.png',
    label: 'デフォルト（中性的）',
    isDefault: true,
  },
  { path: '/assets/characters/male_teen.png', label: '男性・10代' },
  { path: '/assets/characters/male_teen_alt.png', label: '男性・10代（別）' },
  { path: '/assets/characters/male_young.png', label: '男性・20〜30代' },
  { path: '/assets/characters/male_young_alt.png', label: '男性・20〜30代（別）' },
  { path: '/assets/characters/male_young_alt2.png', label: '男性・20〜30代（メガネ）' },
  { path: '/assets/characters/male_young_alt3.png', label: '男性・20〜30代（ストリート）' },
  { path: '/assets/characters/male_middle.png', label: '男性・中年' },
  { path: '/assets/characters/male_middle_alt.png', label: '男性・中年（別）' },
  { path: '/assets/characters/male_middle_alt2.png', label: '男性・中年（強面）' },
  { path: '/assets/characters/male_middle_alt3.png', label: '男性・中年（疲弊）' },
  { path: '/assets/characters/male_elderly.png', label: '男性・老年' },
  { path: '/assets/characters/male_elderly_alt.png', label: '男性・老年（白髭）' },
  { path: '/assets/characters/female_teen.png', label: '女性・10代' },
  { path: '/assets/characters/female_teen_alt.png', label: '女性・10代（ツインテール）' },
  { path: '/assets/characters/female_young.png', label: '女性・20〜30代' },
  { path: '/assets/characters/female_young_alt.png', label: '女性・20〜30代（別）' },
  { path: '/assets/characters/female_young_alt2.png', label: '女性・20〜30代（ポニーテール）' },
  { path: '/assets/characters/female_young_alt3.png', label: '女性・20〜30代（ウェーブ）' },
  { path: '/assets/characters/female_middle.png', label: '女性・中年' },
  { path: '/assets/characters/female_middle_alt.png', label: '女性・中年（髷）' },
  { path: '/assets/characters/female_middle_alt2.png', label: '女性・中年（巻き髪）' },
  { path: '/assets/characters/female_middle_alt3.png', label: '女性・中年（カーディガン）' },
  { path: '/assets/characters/female_elderly.png', label: '女性・老年' },
  { path: '/assets/characters/female_elderly_alt.png', label: '女性・老年（三つ編み）' },
]

// 部屋画像
export const ROOM_ASSETS: ImageAsset[] = [
  { path: '/assets/rooms/default_room.png', label: 'デフォルト', isDefault: true },
  { path: '/assets/rooms/study.png', label: '書斎' },
  { path: '/assets/rooms/kitchen.png', label: 'キッチン' },
  { path: '/assets/rooms/bedroom.png', label: '寝室' },
  { path: '/assets/rooms/dining_room.png', label: 'ダイニング' },
  { path: '/assets/rooms/library.png', label: '図書室' },
  { path: '/assets/rooms/garden.png', label: '庭園' },
  { path: '/assets/rooms/hallway.png', label: '廊下' },
  { path: '/assets/rooms/basement.png', label: '地下室' },
  { path: '/assets/rooms/attic.png', label: '屋根裏' },
  { path: '/assets/rooms/bathroom.png', label: '浴室' },
]

// 館背景画像
export const MANSION_ASSETS: ImageAsset[] = [
  { path: '/assets/mansion/default_mansion.png', label: 'デフォルト', isDefault: true },
  { path: '/assets/mansion/mansion_gothic.png', label: 'ゴシック洋館' },
  { path: '/assets/mansion/mansion_japanese.png', label: '日本家屋' },
  { path: '/assets/mansion/mansion_seaside.png', label: '孤島・海辺' },
  { path: '/assets/mansion/mansion_forest.png', label: '深森の屋敷' },
  { path: '/assets/mansion/mansion_snowy.png', label: '雪景色の館' },
  { path: '/assets/mansion/mansion_night.png', label: '月夜の館' },
  { path: '/assets/mansion/mansion_ruins.png', label: '廃墟・古城' },
]

// 証拠品アイコン
export const EVIDENCE_ASSETS: ImageAsset[] = [
  { path: '/assets/evidence/default_evidence.png', label: 'デフォルト（虫眼鏡）', isDefault: true },
  { path: '/assets/evidence/weapon_blade.png', label: '刃物' },
  { path: '/assets/evidence/weapon_blunt.png', label: '鈍器' },
  { path: '/assets/evidence/weapon_firearm.png', label: '銃器' },
  { path: '/assets/evidence/poison.png', label: '毒物' },
  { path: '/assets/evidence/document_letter.png', label: '手紙・メモ' },
  { path: '/assets/evidence/document_diary.png', label: '日記' },
  { path: '/assets/evidence/document_contract.png', label: '契約書・遺言書' },
  { path: '/assets/evidence/clothing.png', label: '衣類・靴' },
  { path: '/assets/evidence/jewelry.png', label: '装飾品' },
  { path: '/assets/evidence/key.png', label: '鍵' },
  { path: '/assets/evidence/container.png', label: '容器・グラス' },
  // 以下は画像未配置（フォールバック表示で確認可）
  { path: '/assets/evidence/photograph.png', label: '写真・画像' },
  { path: '/assets/evidence/medicine.png', label: '薬品' },
  { path: '/assets/evidence/food_drink.png', label: '食物・飲料' },
  { path: '/assets/evidence/tool.png', label: '道具' },
  { path: '/assets/evidence/fabric.png', label: '布・ハンカチ' },
  { path: '/assets/evidence/fingerprint.png', label: '指紋' },
  { path: '/assets/evidence/blood_stain.png', label: '血痕' },
]

// BGM（将来追加予定）
// ファイルを public/assets/bgm/ に配置し、以下に追加する
export const BGM_ASSETS: BgmAsset[] = [
  // 例:
  {
    path: '/assets/bgm/The Manor Awaits.ogg',
    label: 'The Manor Awaits',
    category: 'タイトル / シナリオ選択',
  },
  {
    path: '/assets/bgm/A Death in the Parlour.ogg',
    label: 'A Death in the Parlour',
    category: 'ブリーフィング（事件概要）',
  },
  {
    path: '/assets/bgm/Candlelit Clues.ogg',
    label: 'Candlelit Clues',
    category: '捜査フェーズ ★ 最重要',
  },
  {
    path: '/assets/bgm/Cross-Examination.ogg',
    label: 'Cross-Examination',
    category: '議論フェーズ',
  },
  { path: '/assets/bgm/The Verdict.ogg', label: 'The Verdict', category: '投票フェーズ' },
  {
    path: '/assets/bgm/Unmasked.ogg',
    label: 'Unmasked',
    category: '告発フェーズ（正解ルート）★クライマックス',
  },
  {
    path: '/assets/bgm/Wrong Accusation.ogg',
    label: 'Wrong Accusation',
    category: '告発フェーズ（不正解ルート）',
  },
  {
    path: '/assets/bgm/Truth Revealed.ogg',
    label: 'Truth Revealed',
    category: 'エンディング（正解・真相解明）★カタルシス',
  },
  {
    path: '/assets/bgm/The One That Got Away.ogg',
    label: 'The One That Got Away',
    category: 'エンディング（不正解・真犯人逃走）',
  },
]
