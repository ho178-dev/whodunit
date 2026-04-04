// デバッグページ: 画像・BGMアセットおよびシナリオテキストの確認用（開発環境限定）
// URL: http://localhost:5173/?debug=true
// 画像はゲーム内と同じピクセル化・配色（ゴシックパレット）・解像度で表示する

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import {
  CHARACTER_ASSETS,
  ROOM_ASSETS,
  MANSION_ASSETS,
  EVIDENCE_ASSETS,
  BGM_ASSETS,
  type ImageAsset,
  type BgmAsset,
} from './assetList'
import { assetUrl } from '../../utils/assetUrl'
import { ScenarioDebug } from './ScenarioDebug'

type Tab = 'images' | 'bgm' | 'scenario'
type ImageCategory = 'characters' | 'rooms' | 'mansion' | 'evidence'

const IMAGE_CATEGORY_CONFIG: Record<
  ImageCategory,
  {
    title: string
    assets: ImageAsset[]
    pixelSize: number
    canvasWidth: number
    canvasHeight: number
    fallbackSrc: string
    cardWidthClass: string
    imgHeightClass: string
  }
> = {
  characters: {
    title: 'キャラクター',
    assets: CHARACTER_ASSETS,
    pixelSize: PIXEL_ART_CONFIG.pixelSize.character,
    canvasWidth: PIXEL_ART_CONFIG.canvasSize.character.width,
    canvasHeight: PIXEL_ART_CONFIG.canvasSize.character.height,
    fallbackSrc: assetUrl('/assets/characters/default_character.png'),
    cardWidthClass: 'w-28',
    imgHeightClass: 'h-40',
  },
  rooms: {
    title: '部屋',
    assets: ROOM_ASSETS,
    pixelSize: PIXEL_ART_CONFIG.pixelSize.room,
    canvasWidth: PIXEL_ART_CONFIG.canvasSize.room.width,
    canvasHeight: PIXEL_ART_CONFIG.canvasSize.room.height,
    fallbackSrc: assetUrl('/assets/rooms/default_room.png'),
    cardWidthClass: 'w-52',
    imgHeightClass: 'h-28',
  },
  mansion: {
    title: '館背景',
    assets: MANSION_ASSETS,
    pixelSize: PIXEL_ART_CONFIG.pixelSize.mansion,
    canvasWidth: PIXEL_ART_CONFIG.canvasSize.mansion.width,
    canvasHeight: PIXEL_ART_CONFIG.canvasSize.mansion.height,
    fallbackSrc: assetUrl('/assets/mansion/default_mansion.png'),
    cardWidthClass: 'w-52',
    imgHeightClass: 'h-28',
  },
  evidence: {
    title: '証拠品',
    assets: EVIDENCE_ASSETS,
    pixelSize: PIXEL_ART_CONFIG.pixelSize.evidence,
    canvasWidth: PIXEL_ART_CONFIG.canvasSize.evidence.width,
    canvasHeight: PIXEL_ART_CONFIG.canvasSize.evidence.height,
    fallbackSrc: assetUrl('/assets/evidence/default_evidence.png'),
    cardWidthClass: 'w-28',
    imgHeightClass: 'h-28',
  },
}

type CategoryConfig = (typeof IMAGE_CATEGORY_CONFIG)[ImageCategory]

function CharacterModalContent({ asset, config }: { asset: ImageAsset; config: CategoryConfig }) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-xs text-gray-500">
        ポートレートモード（調査・議論・告発フェーズ）: h-72 aspect-[832/1216]
      </p>
      <div className="relative border-2 border-stone-500 shadow-lg shadow-black/40">
        <div className="border border-stone-600/40 bg-stone-800">
          <div className="h-72 aspect-[832/1216] overflow-hidden">
            <PixelImageWithFallback
              src={asset.path}
              alt={asset.label}
              pixelSize={PIXEL_ART_CONFIG.pixelSize.character}
              canvasWidth={config.canvasWidth}
              canvasHeight={config.canvasHeight}
              fallbackSrc={config.fallbackSrc}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// RoomとMansionはどちらもaspect-videoで全面表示するが、グラデーション濃度が異なる
function WideImageModalContent({
  asset,
  config,
  variant,
}: {
  asset: ImageAsset
  config: CategoryConfig
  variant: 'room' | 'mansion'
}) {
  const isRoom = variant === 'room'
  return (
    <div className="flex flex-col items-center w-full">
      <p className="mb-3 text-xs text-gray-500">
        {isRoom
          ? '調査フェーズ: w-full aspect-video + グラデーションオーバーレイ'
          : 'ブリーフィング・議論・投票フェーズ: full-screen background + グラデーションオーバーレイ'}
      </p>
      <div
        className={`relative w-full aspect-video overflow-hidden ${isRoom ? 'border border-stone-600' : ''}`}
      >
        <PixelImageWithFallback
          src={asset.path}
          alt={asset.label}
          pixelSize={config.pixelSize}
          canvasWidth={config.canvasWidth}
          canvasHeight={config.canvasHeight}
          fallbackSrc={config.fallbackSrc}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isRoom
              ? 'from-black/60 via-transparent to-transparent'
              : 'from-black/80 via-black/40 to-black/20'
          }`}
        />
        {isRoom && (
          <div className="absolute top-0 left-0 p-3">
            <div className="inline-block bg-stone-900/85 border border-stone-600/60 px-4 py-2">
              <p className="text-amber-500 text-sm tracking-widest">{asset.label}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EvidenceModalContent({ asset, config }: { asset: ImageAsset; config: CategoryConfig }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-gray-500">コンパクトカード（調査・議論フェーズ）: h-10 w-10</p>
      <div className="border border-stone-600 bg-stone-900 p-2 flex items-center gap-2">
        <div className="h-10 w-10 bg-stone-800 overflow-hidden flex-shrink-0">
          <PixelImageWithFallback
            src={asset.path}
            alt={asset.label}
            pixelSize={PIXEL_ART_CONFIG.pixelSize.evidenceCompact}
            canvasWidth={config.canvasWidth}
            canvasHeight={config.canvasHeight}
            fallbackSrc={config.fallbackSrc}
          />
        </div>
        <span className="text-amber-100 text-sm">{asset.label}</span>
      </div>
    </div>
  )
}

function ImageModal({
  asset,
  category,
  onClose,
}: {
  asset: ImageAsset
  category: ImageCategory
  onClose: () => void
}) {
  const config = IMAGE_CATEGORY_CONFIG[category]

  // onClose の参照が毎render変わっても addEventListener の付け替えが起きないよう ref で安定化
  const onCloseRef = useRef(onClose)
  useLayoutEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 border border-gray-700 rounded p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-bold text-gray-100">{asset.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{asset.path}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              pixelSize={config.pixelSize} / canvas {config.canvasWidth}×{config.canvasHeight}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-300 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {category === 'characters' && <CharacterModalContent asset={asset} config={config} />}
        {category === 'rooms' && (
          <WideImageModalContent asset={asset} config={config} variant="room" />
        )}
        {category === 'mansion' && (
          <WideImageModalContent asset={asset} config={config} variant="mansion" />
        )}
        {category === 'evidence' && <EvidenceModalContent asset={asset} config={config} />}
      </div>
    </div>
  )
}

function ImageCard({
  asset,
  config,
  onSelect,
}: {
  asset: ImageAsset
  config: CategoryConfig
  onSelect: () => void
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 rounded border border-gray-700 bg-gray-900 p-2 ${config.cardWidthClass} shrink-0 text-left hover:border-gray-500 transition-colors cursor-pointer`}
      onClick={onSelect}
    >
      <div className={`${config.imgHeightClass} w-full`}>
        <PixelImageWithFallback
          src={asset.path}
          alt={asset.label}
          pixelSize={config.pixelSize}
          canvasWidth={config.canvasWidth}
          canvasHeight={config.canvasHeight}
          fallbackSrc={config.fallbackSrc}
          className="h-full w-full object-contain"
        />
      </div>
      <span className="w-full text-center text-xs text-gray-300 leading-tight">{asset.label}</span>
      {asset.isDefault && (
        <span className="rounded bg-gray-700 px-1 text-xs text-gray-400">default</span>
      )}
      <span className="w-full text-center text-xs text-gray-600 leading-tight break-all">
        {asset.path.split('/').pop()}
      </span>
    </button>
  )
}

function ImageSection({
  category,
  onSelect,
}: {
  category: ImageCategory
  onSelect: (asset: ImageAsset) => void
}) {
  const config = IMAGE_CATEGORY_CONFIG[category]

  return (
    <section>
      <h2 className="mb-3 border-b border-gray-700 pb-1 text-sm font-bold text-gray-200">
        {config.title}
        <span className="ml-2 font-normal text-gray-500">{config.assets.length}件</span>
        <span className="ml-3 font-normal text-gray-600 text-xs">
          pixelSize={config.pixelSize} / canvas {config.canvasWidth}×{config.canvasHeight}
        </span>
      </h2>
      <div className="flex flex-wrap gap-3">
        {config.assets.map((asset) => (
          <ImageCard
            key={asset.path}
            asset={asset}
            config={config}
            onSelect={() => onSelect(asset)}
          />
        ))}
      </div>
    </section>
  )
}

function BgmRow({ asset }: { asset: BgmAsset }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      audio.currentTime = 0
      setPlaying(false)
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  return (
    <div className="flex items-center gap-3 rounded border border-gray-700 bg-gray-900 px-3 py-2">
      <audio ref={audioRef} src={asset.path} onEnded={() => setPlaying(false)} />
      <button
        onClick={togglePlay}
        className="w-16 rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600"
      >
        {playing ? '■ 停止' : '▶ 再生'}
      </button>
      <div className="flex-1">
        <span className="text-sm text-gray-200">{asset.label}</span>
        <span className="ml-2 text-xs text-gray-500">{asset.category}</span>
      </div>
      <span className="text-xs text-gray-600">{asset.path.split('/').pop()}</span>
    </div>
  )
}

function BgmSection() {
  if (BGM_ASSETS.length === 0) {
    return (
      <div className="rounded border border-dashed border-gray-700 p-8 text-center text-sm text-gray-500">
        BGMファイルがまだ登録されていません。
        <br />
        <code className="mt-2 block text-xs text-gray-600">
          public/assets/bgm/ にファイルを配置し、assetList.ts の BGM_ASSETS に追加してください。
        </code>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {BGM_ASSETS.map((asset) => (
        <BgmRow key={asset.path} asset={asset} />
      ))}
    </div>
  )
}

export function DebugPage() {
  const [tab, setTab] = useState<Tab>('images')
  const [imageCategory, setImageCategory] = useState<ImageCategory>('characters')
  const [selectedAsset, setSelectedAsset] = useState<{
    asset: ImageAsset
    category: ImageCategory
  } | null>(null)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {selectedAsset && (
        <ImageModal
          asset={selectedAsset.asset}
          category={selectedAsset.category}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      <header className="border-b border-gray-800 bg-gray-900 px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="rounded bg-yellow-700 px-2 py-0.5 text-xs font-bold text-yellow-200">
            DEV
          </span>
          <h1 className="text-base font-bold text-gray-100">デバッグページ</h1>
          <span className="text-xs text-gray-500">WhoDuNit</span>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900 px-6">
        <nav className="flex gap-0">
          {(['images', 'bgm', 'scenario'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                tab === t
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'images' ? '画像' : t === 'bgm' ? 'BGM' : 'シナリオ'}
            </button>
          ))}
        </nav>
      </div>

      <main className="px-6 py-4">
        {tab === 'images' && (
          <>
            <div className="mb-4 flex gap-2">
              {(Object.keys(IMAGE_CATEGORY_CONFIG) as ImageCategory[]).map((cat) => {
                const c = IMAGE_CATEGORY_CONFIG[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setImageCategory(cat)}
                    className={`rounded px-3 py-1 text-sm transition-colors ${
                      imageCategory === cat
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {c.title}
                    <span className="ml-1 text-xs text-gray-500">({c.assets.length})</span>
                  </button>
                )
              })}
            </div>
            <ImageSection
              category={imageCategory}
              onSelect={(asset) => setSelectedAsset({ asset, category: imageCategory })}
            />
          </>
        )}

        {tab === 'bgm' && (
          <>
            <h2 className="mb-3 border-b border-gray-700 pb-1 text-sm font-bold text-gray-200">
              BGM
              <span className="ml-2 font-normal text-gray-500">{BGM_ASSETS.length}件</span>
            </h2>
            <BgmSection />
          </>
        )}

        {tab === 'scenario' && (
          <>
            <h2 className="mb-4 border-b border-gray-700 pb-1 text-sm font-bold text-gray-200">
              シナリオ
            </h2>
            <ScenarioDebug />
          </>
        )}
      </main>
    </div>
  )
}
