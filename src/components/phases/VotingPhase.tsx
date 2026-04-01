// 最終投票フェーズの画面。館背景にスライダー形式で容疑者を表示し、犯人を選んで告発する
// 右パネルの告発ボタンで二段階確認を行い、告発フェーズへ遷移する
import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { CharacterSlider } from '../shared/CharacterSlider'
import { MansionSceneBackground } from '../shared/MansionBackground'
import { RightPanel } from '../layout/RightPanel'
import { PanelButton } from '../layout/PanelButton'
import { resolveMansionAsset } from '../../services/assetResolver'

// 容疑者選択と告発確認を行い、告発フェーズへ遷移する最終投票コンポーネント
export function VotingPhase() {
  const { scenario, setVotedSuspectId, setPhase } = useGameStore()
  const [sliderIndex, setSliderIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

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

      {/* 右パネル（slot1はGameShellの右上ヘッダーに移管） */}
      <RightPanel
        slot3={
          confirming ? (
            <PanelButton variant="danger" onClick={handleVote}>
              告発確定
            </PanelButton>
          ) : (
            <PanelButton variant="primary" disabled={!selected} onClick={() => setConfirming(true)}>
              告発する
            </PanelButton>
          )
        }
        slot4={
          confirming ? (
            <PanelButton onClick={() => setConfirming(false)}>考え直す</PanelButton>
          ) : (
            <PanelButton onClick={() => setPhase('discussion')}>議論に戻る</PanelButton>
          )
        }
      />
    </div>
  )
}
