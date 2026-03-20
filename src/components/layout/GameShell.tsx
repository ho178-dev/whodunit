import { useGameStore } from '../../stores/gameStore'
import { FadeTransition } from '../shared/FadeTransition'
import { TitleScreen } from '../phases/TitleScreen'
import { ApiKeyInput } from '../phases/ApiKeyInput'
import { LoadingScreen } from '../phases/LoadingScreen'
import { ScenarioBriefing } from '../phases/ScenarioBriefing'
import { InvestigationPhase } from '../phases/InvestigationPhase'
import { DiscussionPhase } from '../phases/DiscussionPhase'
import { VotingPhase } from '../phases/VotingPhase'
import { EndingScreen } from '../phases/EndingScreen'

export function GameShell() {
  const phase = useGameStore((s) => s.phase)

  const renderPhase = () => {
    switch (phase) {
      case 'title': return <TitleScreen />
      case 'api_key_input': return <ApiKeyInput />
      case 'generating': return <LoadingScreen />
      case 'scenario_briefing': return <ScenarioBriefing />
      case 'investigation': return <InvestigationPhase />
      case 'discussion': return <DiscussionPhase />
      case 'voting': return <VotingPhase />
      case 'ending': return <EndingScreen />
      default: return <TitleScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gothic-bg">
      <FadeTransition triggerKey={phase}>
        {renderPhase()}
      </FadeTransition>
    </div>
  )
}
