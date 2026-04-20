import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { PlayerScoreBlock } from './PlayerScoreBlock'
import './ScoringScreen.css'

interface Props {
  onPlayerTap: (playerId: string) => void
  onNewGame: () => void
  onGameFinished: () => void
}

export function ScoringScreen({ onPlayerTap, onNewGame, onGameFinished }: Props) {
  const { game, renamePlayer, clearScores } = useGameStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)

  if (!game) return null

  const { players, rounds, currentPlayerIndex } = game

  function handleClearConfirm() {
    clearScores()
    setShowClearConfirm(false)
  }

  return (
    <div className="scoring-screen">
      <header className="scoring-header">
        <h1 className="scoring-title">
          <span className="b">B</span>
          <span className="l">L</span>
          <span className="o1">O</span>
          <span className="x">X</span>
          <span className="o2">O</span>
        </h1>
        <div className="scoring-actions">
          <button className="clear-btn" onClick={() => setShowClearConfirm(true)}>
            Clear
          </button>
          <button className="new-game-btn" onClick={onNewGame}>
            New
          </button>
        </div>
        
      </header>

      <h2 className="scoring-subtitle">Select a player to add a score</h2>

      <div className="player-blocks scoring-scrollable">
        {players.map((player, index) => (
          <PlayerScoreBlock
            key={player.id}
            player={player}
            playerIndex={index}
            rounds={rounds}
            isCurrent={index === currentPlayerIndex}
            onClick={() => onPlayerTap(player.id)}
            onRename={renamePlayer}
          />
        ))}
      </div>

      <button className="game-finished-btn" onClick={() => setShowFinishConfirm(true)}>
        Game finished
      </button>

      {showFinishConfirm && (
        <div className="confirm-overlay" onClick={() => setShowFinishConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Have you finished the game?</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowFinishConfirm(false)} aria-label="Cancel">
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
                  <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="confirm-proceed" onClick={onGameFinished}>
                Yes, finish
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="confirm-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>This will clear all scores and reset the game back to round 1. Players will stay the same.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowClearConfirm(false)} aria-label="Cancel">
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
                  <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="confirm-proceed" onClick={handleClearConfirm}>
                Clear Scores
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
