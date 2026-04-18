import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Player } from '../types'
import './ScoreInput.css'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

const QUICK = [10, 20, 30]
const NUMS = [7, 8, 9, 4, 5, 6, 1, 2, 3]

interface Props {
  player: Player
  onDone: () => void
}

export function ScoreInput({ player, onDone }: Props) {
  const { game, addRound, advanceTurn } = useGameStore()
  const [score, setScore] = useState(0)

  const playerRounds = game?.rounds.filter((r) =>
    r.scores.some((s) => s.playerId === player.id)
  ) ?? []
  const currentTotal = playerRounds.reduce((sum, r) => {
    const s = r.scores.find((s) => s.playerId === player.id)
    return sum + (s?.score ?? 0)
  }, 0)

  function handleEnter() {
    addRound({
      id: generateId(),
      scores: [{ playerId: player.id, score }],
    })
    advanceTurn()
    onDone()
  }

  return (
    <div className="score-input">
      <div className="si-header">
        <button className="si-back" onClick={onDone}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="si-player-name">{player.name}</div>
      </div>

      <div className="si-display">
        <span className="si-display__value">{score}</span>
        <span className="si-display__new-total">Total: {currentTotal + score}</span>
      </div>

      <div className="si-quick-row">
        {QUICK.map((n) => (
          <button key={n} className="si-quick-btn" onClick={() => setScore((s) => s + n)}>
            +{n}
          </button>
        ))}
      </div>

      <div className="si-pad">
        {NUMS.map((n) => (
          <button key={n} className="si-key" onClick={() => setScore((s) => s + n)}>
            +{n}
          </button>
        ))}
        <button className="si-clear" onClick={() => setScore(0)}>Clear</button>
      </div>

      <button className="si-enter" onClick={handleEnter}>
        Enter
      </button>
    </div>
  )
}
