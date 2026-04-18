import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import { PlayerSetup } from './components/PlayerSetup'
import { ScoringScreen } from './components/ScoringScreen'
import { ScoreInput } from './components/ScoreInput'
import { WinnerScreen } from './components/WinnerScreen'
import type { Player } from './types'
import './App.css'

type Screen = 'setup' | 'scoring' | 'score-entry' | 'winner'

export default function App() {
  const { game, startGame, clearScores } = useGameStore()
  const [screen, setScreen] = useState<Screen>(game ? 'scoring' : 'setup')
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null)

  function handlePlayersReady(players: Player[]) {
    startGame(players)
    setScreen('scoring')
  }

  function handlePlayerTap(playerId: string) {
    setActivePlayerId(playerId)
    setScreen('score-entry')
  }

  const activePlayer = game?.players.find((p) => p.id === activePlayerId) ?? null

  return (
    <div className="app">
      {screen === 'setup' && (
        <PlayerSetup
          onContinue={handlePlayersReady}
          onReturnToGame={game ? () => setScreen('scoring') : undefined}
        />
      )}
      {screen === 'scoring' && (
        <ScoringScreen
          onPlayerTap={handlePlayerTap}
          onNewGame={() => setScreen('setup')}
          onGameFinished={() => setScreen('winner')}
        />
      )}
      {screen === 'score-entry' && activePlayer && (
        <ScoreInput
          player={activePlayer}
          onDone={() => setScreen('scoring')}
        />
      )}
      {screen === 'winner' && (
        <WinnerScreen
          onNewGame={() => setScreen('setup')}
          onClearScores={() => { clearScores(); setScreen('scoring') }}
          onBack={() => setScreen('scoring')}
        />
      )}
    </div>
  )
}
