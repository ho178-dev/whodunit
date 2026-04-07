// 最終投票フェーズの画面。館背景にスライダー形式で容疑者を表示し、犯人を選んで告発する
// 告発するボタンはキャラ画像とダイアログの間（CenterActionArea）に表示して目立たせる
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { CharacterSlider } from '../shared/CharacterSlider'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { RightPanel } from '../layout/RightPanel'
import { CenterActionArea } from '../layout/CenterActionArea'
import { PanelButton } from '../layout/PanelButton'
import { NotesIcon } from '../shared/Icons'
import { InvestigationNotes } from '../investigation/InvestigationNotes'
import { resolveMansionAsset } from '../../services/assetResolver'

// 容疑者選択と告発確認を行い、告発フェーズへ遷移する最終投票コンポーネント
export function VotingPhase() {
  const { scenario, setVotedSuspectId, setPhase } = useGameStore()
  const [sliderIndex, setSliderIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  if (!scenario) return null

  const selectedSuspect = selected ? scenario.suspects.find((s) => s.id === selected) : null

  const handleSuspectClick = (suspectId: string) => {
    const idx = scenario.suspects.findIndex((s) => s.id === suspectId)
    if (idx >= 0) setSliderIndex(idx)
    setSelected(suspectId)
    setConfirming(false)
  }

  const handleVote = () => {
    if (selected) {
      setVotedSuspectId(selected)
      setPhase('accusation')
    }
  }

  return (
    <div className="relative h-full overflow-hidden">
      {showNotes && <InvestigationNotes onClose={() => setShowNotes(false)} />}
      {/* シナリオの館背景IDを使用して背景画像を表示する */}
      <MansionSceneBackground
        phase="voting"
        mansionBackgroundSrc={resolveMansionAsset(scenario.mansion_background_id)}
      />

      {/* スライダー（フル幅） */}
      <CharacterSlider
        suspects={scenario.suspects}
        sliderIndex={sliderIndex}
        onSliderIndexChange={setSliderIndex}
        onSuspectClick={handleSuspectClick}
        selectedId={selected}
      />

      {/* 告発ボタン: キャラクターとダイアログの間・中央に配置 */}
      <CenterActionArea>
        {confirming ? (
          <div className="flex gap-2">
            <button
              onClick={handleVote}
              className="bg-red-900/80 border border-red-600 text-red-200 font-display tracking-widest text-xs px-6 py-2 hover:bg-red-800/80 transition-all"
            >
              告発確定
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="bg-gothic-panel/85 border border-gothic-border text-gothic-muted font-display tracking-widest text-xs px-4 py-2 hover:border-gothic-accent transition-all"
            >
              考え直す
            </button>
          </div>
        ) : selected ? (
          <button
            onClick={() => setConfirming(true)}
            className="bg-gothic-gold/10 border border-gothic-gold text-gothic-gold font-display tracking-widest text-xs px-6 py-2 hover:bg-gothic-gold/20 transition-all hover:shadow-[0_0_12px_rgba(217,119,6,0.4)]"
          >
            告発する
          </button>
        ) : null}
      </CenterActionArea>

      {/* 下部ダイアログ（フル幅） */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        {confirming && selectedSuspect ? (
          <div className="bg-gothic-panel/85 backdrop-blur-sm border-2 border-gothic-gold p-4 text-center">
            <p className="text-gothic-text font-serif text-sm">
              本当に
              <span className="text-gothic-gold font-semibold">{selectedSuspect.name}</span>
              を犯人として告発しますか？
            </p>
          </div>
        ) : selectedSuspect ? (
          <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-gold p-4 text-center">
            <p className="text-gothic-text font-serif text-sm">
              <span className="text-gothic-gold font-semibold">{selectedSuspect.name}</span>
              を犯人として告発しますか？
            </p>
          </div>
        ) : (
          <div className="bg-gothic-panel/85 backdrop-blur-sm border border-gothic-border p-4">
            <p className="text-gothic-muted font-serif text-sm text-center">
              犯人と思われる人物を選んでください
            </p>
          </div>
        )}
      </div>

      {/* 右パネル: 捜査メモボタン */}
      <RightPanel
        slot3={
          <PanelButton variant="secondary" onClick={() => setShowNotes(true)}>
            <span className="flex items-center justify-center gap-1.5">
              <NotesIcon size={13} />
              <span>捜査メモ</span>
            </span>
          </PanelButton>
        }
      />
    </div>
  )
}
