// アプリアイコン生成スクリプト
// ソース画像を各サイズのPNGに変換して build/icon.ico を生成する
import { writeFileSync, mkdirSync } from 'fs'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

// ソース画像（icon.png に変更する場合はこの定数を差し替える）
const SOURCE_IMAGE = 'public/favicon.svg'
const OUTPUT_ICO = 'build/icon.ico'

async function main() {
  mkdirSync('build', { recursive: true })

  // 各ICOサイズのPNGバッファを生成
  const sizes = [16, 32, 48, 256]
  const pngBuffers = await Promise.all(
    sizes.map((s) =>
      sharp(SOURCE_IMAGE, { density: 300 })
        .resize(s, s)
        .png()
        .toBuffer()
    )
  )

  const icoBuffer = await pngToIco(pngBuffers)
  writeFileSync(OUTPUT_ICO, icoBuffer)

  console.log(`Generated: ${OUTPUT_ICO} (${sizes.join(', ')}px)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
