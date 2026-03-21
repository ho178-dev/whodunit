// Canvas を使って画像をドット風に変換して表示するコンポーネント
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { PIXEL_ART_CONFIG, mapToGothicPalette } from '../../constants/pixelArtConfig'

interface PixelImageProps {
  src: string
  alt: string
  pixelSize?: number
  canvasWidth?: number
  canvasHeight?: number
  className?: string
  onError?: () => void
}

// 画像を pixelSize ピクセル単位のドット絵風に縮小→拡大描画するコンポーネント
export function PixelImage({
  src,
  alt,
  pixelSize = PIXEL_ART_CONFIG.pixelSize.character,
  canvasWidth = PIXEL_ART_CONFIG.canvasSize.character.width,
  canvasHeight = PIXEL_ART_CONFIG.canvasSize.character.height,
  className,
  onError,
}: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // onError を ref で保持して useEffect の依存から外す（親の再レンダリングで不要な再描画を防ぐ）
  const onErrorRef = useRef(onError)
  useLayoutEffect(() => {
    onErrorRef.current = onError
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const w = canvas.width
      const h = canvas.height
      // pixelSize 単位で縮小してから拡大することでドット感を出す
      const smallW = Math.ceil(w / pixelSize)
      const smallH = Math.ceil(h / pixelSize)

      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, smallW, smallH)
      const small = ctx.getImageData(0, 0, smallW, smallH)
      const output = ctx.createImageData(w, h)

      // TypedArray 直書き + putImageData で一括転送。各ピクセルをゴシックパレットに変換する
      for (let y = 0; y < smallH; y++) {
        for (let x = 0; x < smallW; x++) {
          const si = (y * smallW + x) * 4
          const a = small.data[si + 3]
          const [pr, pg, pb] = mapToGothicPalette(
            small.data[si],
            small.data[si + 1],
            small.data[si + 2]
          )
          for (let dy = 0; dy < pixelSize; dy++) {
            const py = y * pixelSize + dy
            if (py >= h) break
            for (let dx = 0; dx < pixelSize; dx++) {
              const px = x * pixelSize + dx
              if (px >= w) break
              const di = (py * w + px) * 4
              output.data[di] = pr
              output.data[di + 1] = pg
              output.data[di + 2] = pb
              output.data[di + 3] = a
            }
          }
        }
      }
      ctx.putImageData(output, 0, 0)
    }

    img.onerror = () => onErrorRef.current?.()
    img.src = src
  }, [src, pixelSize, canvasWidth, canvasHeight])

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      aria-label={alt}
      className={cn('w-full h-full', className)}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

interface PixelImageWithFallbackProps {
  src: string
  alt: string
  pixelSize: number
  canvasWidth?: number
  canvasHeight?: number
  fallbackSrc: string
  className?: string
}

// フォールバック付き PixelImage ラッパー。src が変わったときも追従する
export function PixelImageWithFallback({
  src,
  alt,
  pixelSize,
  canvasWidth,
  canvasHeight,
  fallbackSrc,
  className,
}: PixelImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <PixelImage
      src={imgSrc}
      alt={alt}
      pixelSize={pixelSize}
      canvasWidth={canvasWidth}
      canvasHeight={canvasHeight}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc)
      }}
    />
  )
}
