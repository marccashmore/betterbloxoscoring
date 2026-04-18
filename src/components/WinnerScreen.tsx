import { useGameStore } from '../store/gameStore'
import './WinnerScreen.css'

interface Props {
  onNewGame: () => void
  onClearScores: () => void
  onBack: () => void
}

function medalFor(position: number): string | null {
  if (position === 1) return '🏆'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return null
}

export function WinnerScreen({ onNewGame, onClearScores, onBack }: Props) {
  const { game } = useGameStore()
  if (!game) return null

  const scored = game.players.map((player) => {
    const total = game.rounds
      .filter((r) => r.scores.some((s) => s.playerId === player.id))
      .reduce((sum, r) => {
        const s = r.scores.find((s) => s.playerId === player.id)
        return sum + (s?.score ?? 0)
      }, 0)
    return { player, total }
  })

  scored.sort((a, b) => b.total - a.total)

  // Assign positions — players with equal score share a position
  const withPositions = scored.map((item) => ({
    ...item,
    position: scored.filter((other) => other.total > item.total).length + 1,
  }))

  const winners = withPositions.filter((p) => p.position === 1)
  const rest = withPositions.filter((p) => p.position > 1)

  return (
    <div className="winner-screen">
      <div className="winner-top">
        <div className="winner-trophy">🏆</div>
        <div className="winner-names">
          {winners.map(({ player, total }) => (
            <div key={player.id} className="winner-entry">
              <span className="winner-name">{player.name}</span>
              <span className="winner-score">{total} pts</span>
            </div>
          ))}
        </div>
      </div>

      {rest.length > 0 && (
        <div className="standings">
          {rest.map(({ player, total, position }) => {
            const medal = medalFor(position)
            return (
              <div key={player.id} className="standings__row">
                {medal ? (
                  <span className="standings__medal">{medal}</span>
                ) : (
                  <span className="standings__position">{position}</span>
                )}
                <span className="standings__name">{player.name}</span>
                <span className="standings__score">{total}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="winner-actions">
        <button className="winner-back-btn" onClick={onBack} aria-label="Back to scores">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button className="winner-new-btn" onClick={onNewGame}>
          New
        </button>
        <button className="winner-clear-btn" onClick={onClearScores}>
          Clear
        </button>
      </div>
    </div>
  )
}
