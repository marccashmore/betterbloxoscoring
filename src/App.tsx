import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import { PlayerSetup } from './components/PlayerSetup'
import { CardsModal } from './components/CardsModal'
import { ScoringScreen } from './components/ScoringScreen'
import { ScoreInput } from './components/ScoreInput'
import { WinnerScreen } from './components/WinnerScreen'
import type { Game, Player } from './types'
import './App.css'

type Screen = 'setup' | 'cards' | 'scoring' | 'score-entry' | 'winner'

function isGameComplete(game: Game): boolean {
  return game.players.every((player) => {
    const played = game.rounds.filter((r) =>
      r.scores.some((s) => s.playerId === player.id)
    ).length
    return played >= game.cardsDealt
  })
}

export default function App() {
  const { game, startGame, clearScores } = useGameStore()
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

  function handleScoreDone() {
    const currentGame = useGameStore.getState().game
    if (currentGame && isGameComplete(currentGame)) {
      setScreen('winner')
    } else {
      setScreen('scoring')
    }
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
          onDone={handleScoreDone}
        />
      )}
      {screen === 'winner' && (
        <WinnerScreen
          onNewGame={() => setScreen('setup')}
          onClearScores={() => { clearScores(); setScreen('scoring') }}
        />
      )}
    </div>
  )
}
