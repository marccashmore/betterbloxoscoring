import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import { PlayerSetup } from './components/PlayerSetup'
import { CardsModal } from './components/CardsModal'
import { ScoringScreen } from './components/ScoringScreen'
import { ScoreInput } from './components/ScoreInput'
import type { Player } from './types'
import './App.css'

type Screen = 'setup' | 'cards' | 'scoring' | 'score-entry'

export default function App() {
  const { game, startGame } = useGameStore()
  const [screen, setScreen] = useState<Screen>(game ? 'scoring' : 'setup')
  const [pendingPlayers, setPendingPlayers] = useState<Player[]>([])
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null)

  function handlePlayersReady(players: Player[]) {
    setPendingPlayers(players)
    setScreen('cards')
  }

  function handleCardsConfirmed(cardsDealt: number) {
    startGame(pendingPlayers, cardsDealt)
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
      {screen === 'cards' && (
        <CardsModal
          players={pendingPlayers}
          onConfirm={handleCardsConfirmed}
          onBack={() => setScreen('setup')}
        />
      )}
      {screen === 'scoring' && (
        <ScoringScreen
          onPlayerTap={handlePlayerTap}
          onNewGame={() => setScreen('setup')}
        />
      )}
      {screen === 'score-entry' && activePlayer && (
        <ScoreInput
          player={activePlayer}
          onDone={() => setScreen('scoring')}
        />
      )}
    </div>
  )
}
