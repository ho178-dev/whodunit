// 最終投票フェーズの画面。館背景にスライダー形式で容疑者を表示し、犯人を選んで告発する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { GothicPanel } from '../layout/GothicPanel'
import { CharacterSlider } from '../shared/CharacterSlider'
import { PixelImageWithFallback } from '../shared/PixelImage'
import { PIXEL_ART_CONFIG } from '../../constants/pixelArtConfig'
import { MANSION_DEFAULT_ASSET } from '../../services/assetResolver'

// 容疑者選択と告発確認を行い、告発フェーズへ遷移する最終投票コンポーネント
export function VotingPhase() {
  const { scenario, setVotedSuspectId, setPhase } = useGameStore()
  const [sliderIndex, setSliderIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  if (!scenario) return null

  const selectedSuspect = selected ? scenario.suspects.find((s) => s.id === selected) : null

  // 容疑者をクリックして選択（スライダー位置も同期）
  const handleSuspectClick = (suspectId: string) => {
    const idx = scenario.suspects.findIndex((s) => s.id === suspectId)
    if (idx >= 0) setSliderIndex(idx)
    setSelected(suspectId)
    setConfirming(false)
  }

  // 選択した容疑者を犯人として確定し告発フェーズへ遷移する
  const handleVote = () => {
    if (selected) {
      setVotedSuspectId(selected)
      setPhase('accusation')
    }
  }

  return (
    <div className="min-h-screen px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h1 className="font-display text-xl text-gothic-gold tracking-widest">最終投票</h1>
          <button
            onClick={() => setPhase('discussion')}
            className="border border-gothic-border bg-gothic-panel hover:border-gothic-accent text-gothic-muted hover:text-gothic-text font-serif text-xs py-2 px-3 transition-all"
          >
            議論に戻る
          </button>
        </div>

        {/* メインビジュアル */}
        <div
          className="relative w-full border border-gothic-border overflow-hidden"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="absolute inset-0">
            <PixelImageWithFallback
              src={MANSION_DEFAULT_ASSET}
              alt="館"
              pixelSize={PIXEL_ART_CONFIG.pixelSize.mansion}
              canvasWidth={PIXEL_ART_CONFIG.canvasSize.mansion.width}
              canvasHeight={PIXEL_ART_CONFIG.canvasSize.mansion.height}
              fallbackSrc={MANSION_DEFAULT_ASSET}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <CharacterSlider
            suspects={scenario.suspects}
            sliderIndex={sliderIndex}
            onSliderIndexChange={setSliderIndex}
            onSuspectClick={handleSuspectClick}
            selectedId={selected}
          />

          {/* 下部ダイアログ */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            {selectedSuspect ? (
              <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-gold p-4 text-center">
                <p className="text-gothic-text font-serif text-sm mb-3">
                  <span className="text-gothic-gold font-semibold">{selectedSuspect.name}</span>
                  を犯人として告発しますか？
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setConfirming(true)}
                    className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-wider py-2 px-6 transition-all text-sm"
                  >
                    告発する
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="border border-gothic-border text-gothic-muted font-serif py-2 px-4 hover:border-gothic-accent transition-all text-sm"
                  >
                    選び直す
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border p-4">
                <p className="text-gothic-muted font-serif text-sm text-center">
                  犯人と思われる人物を選んでください
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 最終確認パネル */}
        {confirming && selectedSuspect && (
          <GothicPanel className="max-w-md mx-auto text-center mt-4">
            <p className="text-gothic-text font-serif mb-6">
              本当に
              <span className="text-gothic-gold font-semibold">{selectedSuspect.name}</span>
              を犯人として告発しますか？
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleVote}
                className="border border-gothic-gold bg-gothic-panel hover:bg-stone-800 text-gothic-gold font-display tracking-wider py-3 px-8 transition-all"
              >
                告発する
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="border border-gothic-border text-gothic-muted font-serif py-3 px-8 hover:border-gothic-accent transition-all"
              >
                考え直す
              </button>
            </div>
          </GothicPanel>
        )}
      </div>
    </div>
  )
}
