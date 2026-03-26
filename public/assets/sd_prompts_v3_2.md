# WhoDuNiT SD画像生成プロンプト集 v3

---

## モデル設定

| カテゴリ         | モデル               |
| ---------------- | -------------------- |
| 部屋・館・証拠品 | SDXL 1.0             |
| キャラクター     | Animagine XL 4.0 Opt |

---

## ゴシックパレット（参考）

ゲーム内で全画像がこの7色に減色されます。生成時はこれらに近い色味を意識してください。

| 色名          | HEX       | 用途                           |
| ------------- | --------- | ------------------------------ |
| gothic-bg     | `#0c0a09` | 背景・最暗部                   |
| gothic-panel  | `#1c1917` | パネル・暗部                   |
| gothic-border | `#44403c` | 境界・中間調                   |
| gothic-accent | `#b45309` | アクセント（オレンジ）← 目の色 |
| gothic-gold   | `#d97706` | 強調（金）                     |
| gothic-text   | `#fef3c7` | テキスト・明部（クリーム）     |
| gothic-muted  | `#a8a29e` | 淡色（ベージュグレー）         |

---

## キャラクター画像 — Animagine XL 4.0 Opt

### 推奨生成設定

| 項目      | 値                         |
| --------- | -------------------------- |
| サイズ    | 832×1216px（公式推奨縦長） |
| Sampler   | Euler a                    |
| CFG Scale | 5                          |
| Steps     | 28                         |

### タグ順序（重要）

Animagine XL 4.0は**タグの順序が重要**です。以下の順序を守ってください:

```
1girl/1boy → rating → 外見・服装・ポーズ → 背景 → スタイルタグ → クオリティタグ（末尾）
```

### ピクセル化対応スタイルタグ（プロンプト末尾、クオリティタグの前に追加）

```
thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows
```

### 共通クオリティタグ（プロンプト最末尾に追加）

```
masterpiece, high score, great score, absurdres
```

### 共通ネガティブ

```
lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry, complex background, detailed background, scenery, blush, blushing, red cheeks, flushed face, rosy cheeks, smoke, mist, fog, haze, splash, water splash, liquid, fluid, particles, floating particles, energy, aura, magical effects, abstract background, dynamic background, swirl, motion blur, paint splash, ink splash, brush stroke, white aura, white effects, glow effects, flowing effect, wave effect, thin lines, sketch, detailed shading, soft shading, gradient, gradient hair, gradient clothes, watercolor, pastel colors, faded colors, low contrast
```

---

### male_teen.png — 男性・10代

```
1boy, safe, solo, teenager, very short black hair, orange eyes, serious expression, nervous, uneasy, dark school uniform, high collar jacket, slim build, hunched shoulders, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_teen_alt.png — 男性・10代（別ver）

```
1boy, safe, solo, teenager, messy brown hair, orange eyes, serious expression, defiant, guarded, hoodie, casual clothes, hands in pockets, slouching, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_young.png — 男性・20〜30代

```
1boy, safe, solo, young man, adult, neat short black hair, orange eyes, serious expression, nervous, uneasy, dark formal suit, white dress shirt, slim build, straight posture, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_young_alt.png — 男性・20〜30代（別ver）

```
1boy, safe, solo, young man, adult, slicked back blonde hair, orange eyes, serious expression, confident smirk, white dress shirt, open collar, disheveled, relaxed pose, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_young_alt2.png — 男性・20〜30代（別ver2）

```
1boy, safe, solo, young man, adult, wavy dark brown hair, glasses, orange eyes, serious expression, intellectual, anxious, cardigan, sweater vest, scholarly appearance, thoughtful pose, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_middle.png — 男性・中年

```
1boy, safe, solo, middle-aged man, mature male, short grey hair, orange eyes, serious expression, nervous, uneasy, dark business suit, broad shoulders, stern expression, imposing, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_middle_alt.png — 男性・中年（別ver）

```
1boy, safe, solo, middle-aged man, mature male, mustache, short dark hair, orange eyes, serious expression, nervous, uneasy, dark turtleneck sweater, arms crossed, narrow eyes, skeptical expression, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_middle_alt2.png — 男性・中年（別ver2）

```
1boy, safe, solo, middle-aged man, mature male, bald, goatee, orange eyes, serious expression, intimidating, stern, dark leather jacket, muscular build, arms crossed, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_elderly.png — 男性・老年

```
1boy, safe, solo, old man, elderly, white hair, wrinkles, orange eyes, serious expression, nervous, uneasy, dark formal suit, dignified, wise expression, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### male_elderly_alt.png — 男性・老年（別ver）

```
1boy, safe, solo, old man, elderly, long white beard, balding, orange eyes, serious expression, weary, contemplative, dark robe, hunched posture, weathered face, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_teen.png — 女性・10代

```
1girl, safe, solo, teenager, long straight black hair, orange eyes, serious expression, nervous, uneasy, dark school uniform, sailor collar, slim build, cautious expression, reserved, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_teen_alt.png — 女性・10代（別ver）

```
1girl, safe, solo, teenager, twin tails, dark brown hair, orange eyes, serious expression, shy, withdrawn, oversized sweater, looking down slightly, fidgeting, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_young.png — 女性・20〜30代

```
1girl, safe, solo, young woman, adult, elegant updo hair, black hair, orange eyes, serious expression, nervous, uneasy, dark formal dress, composed expression, graceful, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_young_alt.png — 女性・20〜30代（別ver）

```
1girl, safe, solo, young woman, adult, short bob blonde hair, orange eyes, serious expression, uneasy smile, nervous, tense, dark turtleneck, simple coat, subdued colors, observant eyes, suspicious gaze, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_young_alt2.png — 女性・20〜30代（別ver2）

```
1girl, safe, solo, young woman, adult, ponytail, dark hair, orange eyes, serious expression, determined, focused, white blouse, dark vest, professional appearance, confident posture, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_middle.png — 女性・中年

```
1girl, safe, solo, middle-aged woman, mature female, wavy shoulder-length dark hair, orange eyes, serious expression, nervous, uneasy, conservative dark blouse, sharp eyes, intelligent expression, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_middle_alt.png — 女性・中年（別ver）

```
1girl, safe, solo, middle-aged woman, mature female, hair bun, tightly tied hair, dark hair, orange eyes, serious expression, nervous, uneasy, dark dress, cold expression, refined, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_middle_alt2.png — 女性・中年（別ver2）

```
1girl, safe, solo, middle-aged woman, mature female, short curly grey hair, orange eyes, serious expression, stern, authoritative, dark blazer, pearl necklace, elegant but intimidating, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_elderly.png — 女性・老年

```
1girl, safe, solo, old woman, elderly, silver hair, hair pinned up, orange eyes, serious expression, nervous, uneasy, black dress, piercing eyes, dignified, sorrowful expression, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### female_elderly_alt.png — 女性・老年（別ver）

```
1girl, safe, solo, old woman, elderly, long grey hair, braided hair, orange eyes, serious expression, gentle but tired, dark shawl, wrinkled hands clasped, maternal appearance, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

---

### default.png — デフォルト（中性的）

```
1other, safe, solo, androgynous, short neat dark hair, orange eyes, dark turtleneck, slender, neutral expression, calm, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, high contrast, flat color, cel shading, simple shading, solid shadows, masterpiece, high score, great score, absurdres
```

**default.png専用ネガティブ:**

```
lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry, complex background, detailed background, scenery, smoke, mist, fog, haze, splash, water splash, liquid, fluid, particles, floating particles, energy, aura, magical effects, abstract background, dynamic background, swirl, motion blur, paint splash, ink splash, brush stroke, white aura, white effects, glow effects, flowing effect, wave effect, tight clothing, skin-tight, latex, bodysuit, shiny clothes, glossy, wet look, form-fitting, large breasts, big breasts, huge breasts, cleavage, breast focus, curvy, voluptuous, hourglass figure, sexy body, mature female body, feminine body, masculine, thin lines, sketch, detailed shading, soft shading, gradient
```

---

### default_shadow.png — 影デフォルト（顔が見えないバージョン）

**プロンプト:**

```
1other, safe, solo, androgynous, slender, short neat dark hair, dark turtleneck, silhouette, face in shadow, obscured face, hidden facial features, backlighting, rim light, high contrast, no visible facial details, faceless, featureless face, ambiguous gender, ambiguous age, neutral expression, calm, upper body, looking at viewer, simple gray background, thick outlines, bold lineart, flat color, cel shading, solid shadows, masterpiece, high score, great score, absurdres
```

**専用ネガティブ:**

```
detailed face, visible eyes, clear facial features, smile, expressive face, feminine, masculine, child, old, lowres, bad anatomy, worst quality, low quality, blurry, thin lines, sketch, detailed shading, soft shading, gradient
```

---

## 部屋画像 — SDXL 1.0

### 推奨生成設定

| 項目      | 値                     |
| --------- | ---------------------- |
| サイズ    | 1216×684px（16:9横長） |
| Sampler   | DPM++ 2M Karras        |
| CFG Scale | 7                      |
| Steps     | 30                     |

### ピクセル化対応について

部屋画像はゲーム内でドット絵化されるため、以下を意識:

- 家具の**シルエット**を明確に
- **高コントラスト**で明暗差をはっきり
- 細かいテクスチャより**大きな形状**を優先

### 共通プロンプト（末尾に追加）

```
interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

### 共通ネガティブ

```
(worst quality, low quality:1.4), people, characters, modern furniture, bright daylight, colorful, saturated colors, cartoon, anime, watermark, blurry, text, fine details, intricate patterns, detailed textures, subtle gradients, soft lighting, low contrast
```

---

### study.png — 書斎

```
gothic manor study room, large dark wooden desk, leather armchair, tall bookshelves, scattered papers, heavy curtains, single candle light source, dark wood paneling, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### kitchen.png — キッチン

```
gothic manor kitchen, stone walls, dark wooden counters, hanging copper pots silhouette, cast iron stove, single overhead lamp, cold atmosphere, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### bedroom.png — 寝室

```
gothic manor bedroom, four-poster bed with dark canopy, heavy velvet curtains, ornate wardrobe silhouette, faint moonlight through window, dusty atmosphere, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### dining_room.png — ダイニング

```
gothic manor dining room, long dark oak table, high-backed chairs silhouette, candelabra centerpiece, oil portraits on walls, dim chandelier overhead, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### library.png — 図書室

```
gothic manor library, floor to ceiling bookshelves, rolling ladder silhouette, leather armchair, fireplace glow, stacks of old books, warm amber light, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### garden.png — 庭園

```
gothic manor garden at night, overgrown hedges silhouette, stone path, iron gate, thick fog, moonlit atmosphere, dark roses, exterior photograph, wide angle, no people, dark moody atmosphere, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### hallway.png — 廊下

```
gothic manor hallway, long dark corridor, wooden floor, wall sconces with candles, portrait gallery, deep shadows, ornate wallpaper, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### basement.png — 地下室

```
gothic manor basement, stone walls and floor, single hanging light bulb, wine rack silhouette, old crates, cobwebs, cold damp darkness, interior photograph, wide angle, no people, dark moody atmosphere, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### attic.png — 屋根裏

```
gothic manor attic, wooden beam silhouettes, dusty trunks, covered mirror, dim light from small window, cobwebs, forgotten atmosphere, interior photograph, wide angle, no people, dark moody atmosphere, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### bathroom.png — 浴室

```
gothic manor bathroom, clawfoot bathtub silhouette, dark tile floor, tarnished mirror, dim wall lamp, cold stone walls, interior photograph, wide angle, no people, dark moody atmosphere, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

### default.png — デフォルト部屋

```
gothic manor interior, dark stone walls, candlelight, mysterious shadows, old wooden floor, heavy atmosphere, unspecified room, interior photograph, wide angle, no people, dark moody atmosphere, amber candlelight, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
```

---

## 証拠品アイコン — SDXL 1.0

### 推奨生成設定

| 項目      | 値                                |
| --------- | --------------------------------- |
| サイズ    | 1024×1024px → 128×128pxにリサイズ |
| Sampler   | DPM++ 2M Karras                   |
| CFG Scale | 7                                 |
| Steps     | 30                                |

### ピクセル化対応について

証拠品は128×128pxまで縮小されるため、**シンプルで認識しやすい形状**が重要:

- 複雑な装飾より**明確なシルエット**
- **黒背景**で高コントラスト
- 単一オブジェクトを大きく配置

### 共通プロンプト（末尾に追加）

```
single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

### 共通ネガティブ

```
(worst quality, low quality:1.4), people, multiple objects, complex background, bright colors, cluttered, watermark, blurry, text, gradient background, textured background, floor, table, surface, reflection, pattern, fine details, intricate design, subtle textures, low contrast, soft lighting
```

---

### weapon_blade.png — 刃物

```
ornate dagger, curved blade, decorative handle, gothic style weapon, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### weapon_blunt.png — 鈍器

```
heavy brass candlestick, tall silhouette, blunt weapon, victorian style, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### weapon_firearm.png — 銃器

```
antique revolver, victorian era pistol, side view, metal barrel silhouette, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### poison.png — 毒物

```
small dark glass vial, cork stopper, round bottle silhouette, mysterious liquid, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### document_letter.png — 手紙・メモ

```
aged folded letter, broken wax seal, yellowed paper, handwritten document, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### document_diary.png — 日記

```
old leather-bound diary, thick book silhouette, metal clasp, worn cover, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### document_contract.png — 契約書・遺言書

```
rolled parchment with ribbon, official document, wax seal, legal paper, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### clothing.png — 衣類・靴

```
muddy leather shoes with dark coat, folded clothing pile, evidence items, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### jewelry.png — 装飾品

```
antique brooch, oval shape, ornate metalwork frame, gothic jewelry, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### key.png — 鍵

```
ornate skeleton key, large bow handle, long shaft, gothic iron key, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### container.png — 容器・グラス

```
crystal wine glass, dark liquid residue, stemmed glass silhouette, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### photograph.png — 写真・画像

```
old photograph with white border, sepia tone, rectangular frame, vintage photo, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### medicine.png — 薬品

```
dark medicine bottle, dropper cap, apothecary style, handwritten label, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### food_drink.png — 食物・飲料

```
teacup with saucer, dark liquid inside, porcelain cup silhouette, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### tool.png — 道具

```
metal lockpick set, small tools arranged, thin metal instruments, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### fabric.png — 布・ハンカチ

```
white handkerchief, embroidered corner, folded fabric, dropped cloth, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### fingerprint.png — 指紋

```
glowing fingerprint pattern, swirl lines, forensic evidence, amber glow, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### blood_stain.png — 血痕

```
dark stain splatter, irregular shape, dried blood pattern, evidence marker, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

### default.png — デフォルト証拠品

```
magnifying glass, full view, brass handle, round lens, detective tool, complete object centered, single object, centered, isolated on solid black background, simple lighting, strong silhouette, product photography, high contrast, simple composition, no shadows on background, bold shape, clear outline, minimal details
```

---

## 館背景画像 — SDXL 1.0

### 推奨生成設定

| 項目      | 値                 |
| --------- | ------------------ |
| サイズ    | 1216×684px（横長） |
| Sampler   | DPM++ 2M Karras    |
| CFG Scale | 7                  |
| Steps     | 30                 |

### ピクセル化対応について

館背景はゲーム内でドット絵化されるため:

- 建物の**シルエット**を明確に
- **高コントラスト**で建物と空を分離
- 細部より**全体の形状**を優先

### 共通プロンプト（末尾に追加）

```
exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

### 共通ネガティブ

```
(worst quality, low quality:1.4), people, characters, modern buildings, bright daylight, colorful, saturated, cartoon, anime, watermark, blurry, text, fine details, intricate patterns, subtle gradients, soft lighting, low contrast
```

---

### mansion_gothic.png — ゴシック様式の洋館

```
gothic victorian manor exterior, full building silhouette, stone facade, tall spire towers, ivy covered walls, amber lit windows, iron gate, moonlit cloudy sky, fog on ground, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### mansion_japanese.png — 日本家屋・豪邸

```
traditional japanese mansion exterior at night, large dark wooden architecture, tiled roof silhouette, stone lanterns, moonlight, quiet mysterious atmosphere, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### mansion_seaside.png — 孤島・海辺の館

```
isolated gothic manor on rocky cliff, stormy night, crashing waves below, lightning silhouette, rain, lone building against dark sky, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### mansion_forest.png — 深森の中の屋敷

```
gothic manor deep in dark forest, tall tree silhouettes surrounding, thick fog, faint amber light from windows, overgrown path, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### mansion_snowy.png — 雪景色の館

```
gothic manor in winter, heavy snow covering roof and grounds, bare tree branches, dim candlelight in windows, pale gray sky, cold silent atmosphere, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### mansion_night.png — 月夜の館

```
gothic manor exterior under full moon, moonlight casting sharp shadows, building silhouette against dark sky, ornate facade, overgrown garden, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### mansion_ruins.png — 廃墟・古城風

```
ruined gothic castle manor exterior, crumbling walls silhouette, collapsed towers, overgrown vegetation, moonlit sky, forsaken cursed atmosphere, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

### default.png — デフォルト館背景

```
gothic manor exterior at dusk, full building silhouette, stone architecture, tall windows, iron fence, dark cloudy sky, mysterious atmosphere, exterior wide shot, no people, night scene, dark moody atmosphere, high contrast, gothic architecture, muted desaturated colors, establishing shot, bold silhouette, simple composition, clear building outline
```

---

## 生成Tips

### ピクセル化対応のコツ

ゲーム内で7色パレットに減色＋ドット絵化されるため、以下を意識:

1. **太い線・高コントラスト** — `thick outlines, bold lineart, high contrast` で線が消えにくくなる
2. **フラットな塗り** — `flat color, cel shading, solid shadows` でグラデーションを避ける
3. **シルエット重視** — `strong silhouette, bold shape` で形状を明確に
4. **細部を省略** — `minimal details, simple composition` で縮小後も認識しやすく

### パレット対応のコツ

1. **色指定を避ける** — 「green」「blue」「red」などの具体的な色は減色後に意図しない色になる
2. **明暗で表現する** — 「dark」「dim」「amber light」「shadow」で明暗コントラストを作る
3. **目の色は orange** — パレットの `#b45309` にマッピングされる

### 減色後の識別性

- キャラクター: 髪型・服のシルエット・姿勢で区別
- 部屋: 特徴的な家具のシルエット（四柱ベッド、暖炉、テーブル形状など）で区別
- 証拠品: 単純な形状、黒背景で高コントラスト

### モデル別注意点

**Animagine XL 4.0 Opt（キャラクター）**

- Danbooruタグ形式が効果的
- タグ順序: `1girl/1boy → safe → 外見 → 背景 → スタイルタグ → クオリティタグ`
- ピクセル化対応: `thick outlines, bold lineart, high contrast, flat color, cel shading`
- クオリティタグは必ず末尾に配置
- Sampler: Euler a, CFG: 5, Steps: 28

**SDXL 1.0（部屋・館・証拠品）**

- 自然言語の説明文が効果的
- ピクセル化対応: `bold shapes, strong silhouettes, simple composition, high contrast`
- 背景は必ず「solid black background」または「dark background」
- Sampler: DPM++ 2M Karras, CFG: 7, Steps: 30

---

_最終更新: 2026-03-26 | v3.1 ピクセル化対応版_
