# WhoDuNiT SD画像生成プロンプト集 v3

> **改善ポイント（反映済み）**
>
> - ゲーム内で7色ゴシックパレット（黒/暗灰/灰/オレンジ/金/クリーム/ベージュ）に減色される前提で色指定を最適化
> - ドット絵化（縮小→拡大）後もシルエットで識別できるよう形状を明確化
> - 減色後に消える細かいテクスチャ記述を削除
> - Animagine XL向けにDanbooruタグ形式を徹底
> - キャラクターの目の色を `orange eyes` で統一（→ パレットの #b45309 にマッピング）
> - ミステリーの緊張感を出すため `serious expression, nervous, uneasy` を共通追加
> - 背景はシンプルな `simple gray background` / `solid black background` に統一

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
very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges
```

### 目の色について（重要）

オレンジの目はゲーム内で `#b45309` にマッピングされる重要なアクセントカラーです。

- `orange eyes` だけでなく `deep orange eyes, vivid orange eyes, solid orange iris` を使用
- 薄いオレンジは減色後にベージュになるため、**濃いオレンジ**を指定
- ネガティブで `eye highlight, eye reflection` を除外してベタ塗りに

### 共通クオリティタグ（プロンプト最末尾に追加）

```
masterpiece, high score, great score, absurdres
```

### 共通ネガティブ

```
lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry, complex background, detailed background, scenery, blush, blushing, red cheeks, flushed face, rosy cheeks, smoke, mist, fog, haze, splash, water splash, liquid, fluid, particles, floating particles, energy, aura, magical effects, abstract background, dynamic background, swirl, motion blur, paint splash, ink splash, brush stroke, white aura, white effects, glow effects, flowing effect, wave effect, thin lines, sketch, detailed shading, soft shading, gradient, gradient hair, gradient clothes, watercolor, pastel colors, faded colors, low contrast, eye highlight, eye reflection, eye shine, eye sparkle, shiny eyes, glowing eyes, light eyes, pale eyes, yellow eyes, amber eyes, light orange eyes
```

---

### male_teen.png — 男性・10代

```
1boy, safe, solo, teenager, short black hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark school uniform, high collar jacket, slim build, hunched shoulders, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_teen_alt.png — 男性・10代（別ver）

```
1boy, safe, solo, teenager, messy brown hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, defiant, guarded, hoodie, casual clothes, hands in pockets, slouching, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_young.png — 男性・20〜30代

```
1boy, safe, solo, young man, adult, neat short black hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark formal suit, white dress shirt, slim build, straight posture, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_young_alt.png — 男性・20〜30代（別ver）

```
1boy, safe, solo, young man, adult, slicked back blonde hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, confident smirk, white dress shirt, open collar, disheveled, relaxed pose, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_young_alt2.png — 男性・20〜30代（別ver2）

```
1boy, safe, solo, young man, adult, wavy dark brown hair, glasses, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, intellectual, anxious, cardigan, sweater vest, scholarly appearance, thoughtful pose, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_young_alt3.png — 男性・20〜30代（別ver3）

```
1boy, safe, solo, young man, adult, short spiky black hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, tense, alert, dark hoodie, casual streetwear, hands visible, athletic build, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_middle.png — 男性・中年

```
1boy, safe, solo, middle-aged man, mature male, short grey hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark business suit, broad shoulders, stern expression, imposing, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_middle_alt.png — 男性・中年（別ver）

```
1boy, safe, solo, middle-aged man, mature male, mustache, short dark hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark turtleneck sweater, arms crossed, narrow eyes, skeptical expression, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_middle_alt2.png — 男性・中年（別ver2）

```
1boy, safe, solo, middle-aged man, mature male, bald, goatee, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, intimidating, stern, dark leather jacket, muscular build, arms crossed, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_middle_alt3.png — 男性・中年（別ver3）

```
1boy, safe, solo, middle-aged man, mature male, receding hairline, dark hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, tired, worn out, loose necktie, wrinkled suit, disheveled appearance, slouched posture, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_elderly.png — 男性・老年

```
1boy, safe, solo, old man, elderly, white hair, wrinkles, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark formal suit, dignified, wise expression, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### male_elderly_alt.png — 男性・老年（別ver）

```
1boy, safe, solo, old man, elderly, long white beard, balding, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, weary, contemplative, dark robe, hunched posture, weathered face, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_teen.png — 女性・10代

```
1girl, safe, solo, teenager, long straight black hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark school uniform, sailor collar, slim build, cautious expression, reserved, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_teen_alt.png — 女性・10代（別ver）

```
1girl, safe, solo, teenager, twin tails, dark brown hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, shy, withdrawn, oversized sweater, looking down slightly, fidgeting, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_young.png — 女性・20〜30代

```
1girl, safe, solo, young woman, adult, elegant updo hair, black hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark formal dress, composed expression, graceful, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_young_alt.png — 女性・20〜30代（別ver）

```
1girl, safe, solo, young woman, adult, short bob blonde hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, uneasy smile, nervous, tense, dark turtleneck, simple coat, subdued colors, observant eyes, suspicious gaze, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_young_alt2.png — 女性・20〜30代（別ver2）

```
1girl, safe, solo, young woman, adult, ponytail, dark hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, determined, focused, white blouse, dark vest, professional appearance, confident posture, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_young_alt3.png — 女性・20〜30代（別ver3）

```
1girl, safe, solo, young woman, adult, long wavy brown hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, melancholic, distant gaze, simple sweater, casual clothes, arms folded, guarded posture, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_middle.png — 女性・中年

```
1girl, safe, solo, middle-aged woman, mature female, wavy shoulder-length dark hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, conservative dark blouse, sharp eyes, intelligent expression, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_middle_alt.png — 女性・中年（別ver）

```
1girl, safe, solo, middle-aged woman, mature female, hair bun, tightly tied hair, dark hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, dark dress, cold expression, refined, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_middle_alt2.png — 女性・中年（別ver2）

```
1girl, safe, solo, middle-aged woman, mature female, short curly grey hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, stern, authoritative, dark blazer, pearl necklace, elegant but intimidating, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_middle_alt3.png — 女性・中年（別ver3）

```
1girl, safe, solo, middle-aged woman, mature female, shoulder-length straight black hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, weary, concerned, simple cardigan, modest clothing, worried look, tense shoulders, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_elderly.png — 女性・老年

```
1girl, safe, solo, old woman, elderly, silver hair, hair pinned up, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, nervous, uneasy, black dress, piercing eyes, dignified, sorrowful expression, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### female_elderly_alt.png — 女性・老年（別ver）

```
1girl, safe, solo, old woman, elderly, long grey hair, braided hair, deep orange eyes, vivid orange eyes, solid orange iris, serious expression, gentle but tired, dark shawl, wrinkled hands clasped, maternal appearance, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

---

### default.png — デフォルト（中性的）

```
1other, safe, solo, androgynous, short neat dark hair, deep orange eyes, vivid orange eyes, solid orange iris, dark turtleneck, slender, neutral expression, calm, upper body, looking at viewer, simple gray background, very thick outlines, heavy lineart, bold black lines, high contrast, flat color, cel shading, no shading, solid fill, hard edges, masterpiece, high score, great score, absurdres
```

**default.png専用ネガティブ:**

```
lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry, complex background, detailed background, scenery, smoke, mist, fog, haze, splash, water splash, liquid, fluid, particles, floating particles, energy, aura, magical effects, abstract background, dynamic background, swirl, motion blur, paint splash, ink splash, brush stroke, white aura, white effects, glow effects, flowing effect, wave effect, tight clothing, skin-tight, latex, bodysuit, shiny clothes, glossy, wet look, form-fitting, large breasts, big breasts, huge breasts, cleavage, breast focus, curvy, voluptuous, hourglass figure, sexy body, mature female body, feminine body, masculine, thin lines, sketch, detailed shading, soft shading, gradient, eye highlight, eye reflection, eye shine, eye sparkle, shiny eyes, glowing eyes, light eyes, pale eyes, yellow eyes, amber eyes, light orange eyes
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
gothic manor garden at night, overgrown hedges silhouette, stone path, a stone fountain in the garden, aged fountain, subtle water flow, reflective water surface, thick fog, moonlit atmosphere, dark roses, exterior photograph, wide angle, no people, dark moody atmosphere, deep shadows, high contrast, gothic manor aesthetic, muted desaturated colors, bold shapes, strong silhouettes, simple composition
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
- **純黒背景**で高コントラスト（アイコン感を出す）
- 単一オブジェクトを大きく配置
- **汎用的な形状**で複数シナリオに使い回し可能に

### 背景を確実に黒にするコツ

- `pure black background, #000000 background, vantablack` を使用
- ネガティブに `shadow, drop shadow, cast shadow, ambient occlusion, ground shadow, reflected light` を追加
- `studio lighting, rim light only` で影を最小化

### 共通プロンプト（末尾に追加）

```
single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

### 共通ネガティブ

```
(worst quality, low quality:1.4), people, multiple objects, gradient background, textured background, gray background, floor, table, surface, ground, reflection, shadow, drop shadow, cast shadow, ground shadow, ambient occlusion, reflected light, soft lighting, environmental lighting, complex background, pattern, fine details, intricate design, ornate, decorative, fancy, realistic photo
```

---

### weapon_blade.png — 刃物

**プロンプト:**

```
kitchen knife, silver blade, black handle, side view, flat lay, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### weapon_blunt.png — 鈍器

**プロンプト:**

```
red brick, rectangular block, simple clay brick, building brick, solid rectangular shape, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### weapon_firearm.png — 銃器

**プロンプト:**

```
black revolver pistol, side profile view, simple gun silhouette, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### poison.png — 毒物

**プロンプト:**

```
small glass bottle with skull label, cork stopper, round bottle, green liquid inside, poison bottle, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### document_letter.png — 手紙・メモ

**プロンプト:**

```
opened envelope with letter inside, white paper with handwritten text lines, cursive writing visible, folded letter partially pulled out, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette
```

**専用ネガティブ:**

```
(worst quality, low quality:1.4), people, multiple objects, gradient background, floor, table, surface, shadow, drop shadow, cast shadow, ground shadow, empty envelope, closed envelope, blank paper, no text, clean paper
```

---

### document_diary.png — 日記

**プロンプト:**

```
leather bound journal, closed diary book, brown leather cover, visible bookmark ribbon, thick book with many pages, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette
```

---

### document_contract.png — 契約書・遺言書

**プロンプト:**

```
official document paper, formal contract with printed text lines, signature at bottom, legal document, rolled scroll with visible text, wax seal stamp, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette
```

**専用ネガティブ:**

```
(worst quality, low quality:1.4), people, multiple objects, gradient background, floor, table, surface, shadow, drop shadow, cast shadow, ground shadow, blank paper, no text, clean paper, empty document
```

---

### clothing.png — 衣類・靴

**プロンプト:**

```
folded dark jacket with shoes beneath, clothing pile, leather shoes visible under folded coat, neatly stacked clothes, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette
```

**専用ネガティブ:**

```
(worst quality, low quality:1.4), people, gradient background, floor, table, surface, shadow, drop shadow, cast shadow, ground shadow, shoes only, just shoes, no clothes, single shoe
```

---

### jewelry.png — 装飾品

**プロンプト:**

```
gold ring with gemstone, simple band ring, circular jewelry, shiny metal ring, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### key.png — 鍵

**プロンプト:**

```
old fashioned metal key, simple key shape, oval bow handle, straight shaft, brass key, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### container.png — 容器・グラス

**プロンプト:**

```
wine glass with red liquid, stemmed glass, transparent glass, simple goblet shape, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### photograph.png — 写真・画像

**プロンプト:**

```
old polaroid photograph, rectangular photo with white border, sepia toned image, vintage photo, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### medicine.png — 薬品

**プロンプト:**

```
orange pill bottle with white cap, prescription medicine bottle, cylindrical container, pharmacy bottle, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### food_drink.png — 食物・飲料

**プロンプト:**

```
white coffee mug with handle, simple ceramic cup, steaming hot drink, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### tool.png — 道具

**プロンプト:**

```
metal wrench, silver spanner tool, simple hand tool, adjustable wrench, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### fabric.png — 布・ハンカチ

**プロンプト:**

```
white folded handkerchief, square cloth napkin, simple fabric, neatly folded, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
```

---

### fingerprint.png — 指紋

**プロンプト:**

```
glowing fingerprint, orange fingerprint pattern, swirl pattern, biometric scan, forensic fingerprint, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette
```

**専用ネガティブ:**

```
(worst quality, low quality:1.4), people, hand, finger, realistic finger, multiple fingerprints, gradient background, floor, surface, shadow, drop shadow
```

---

### blood_stain.png — 血痕

**プロンプト:**

```
dark red blood splatter, blood stain, irregular splatter shape, dried blood drop, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette
```

**専用ネガティブ:**

```
(worst quality, low quality:1.4), people, body parts, wound, injury, gradient background, floor, surface, shadow, drop shadow, pool of blood, crime scene
```

---

### default.png — デフォルト証拠品

**プロンプト:**

```
magnifying glass, detective magnifier, round glass lens, simple handle, investigation tool, single object, centered, isolated, pure black background, #000000 background, vantablack, studio lighting, rim light only, floating object, no surface, no floor, icon style, high contrast, bold silhouette, simple shape
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
