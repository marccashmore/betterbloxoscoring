import { useState, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Player, Round } from '../types'
import './PlayerScoreBlock.css'

const EDIT_WIDTH = 88
const SCORES_WIDTH = 88
const SNAP_THRESHOLD = 44

interface Props {
  player: Player
  rounds: Round[]
  cardsDealt: number
  isCurrent: boolean
  onClick: () => void
  onRename: (playerId: string, name: string) => void
}

export function PlayerScoreBlock({ player, rounds, cardsDealt, isCurrent, onClick, onRename }: Props) {
  const playerRounds = rounds.filter((r) =>
    r.scores.some((s) => s.playerId === player.id)
  )
  const totalScore = playerRounds.reduce((sum, r) => {
    const s = r.scores.find((s) => s.playerId === player.id)
    return sum + (s?.score ?? 0)
  }, 0)
  const turnsPlayed = playerRounds.length

  const [offset, setOffset] = useState(0)
  const [snapping, setSnapping] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(player.name)
  const [showScores, setShowScores] = useState(false)
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const { deleteRound, updateRoundScore } = useGameStore()
  const drag = useRef({ startX: 0, startOffset: 0, active: false, moved: false })

  function snapTo(target: number) {
    setSnapping(true)
    setOffset(target)
    setTimeout(() => setSnapping(false), 200)
  }

  function onPointerDown(e: React.PointerEvent) {
    drag.current = { startX: e.clientX, startOffset: offset, active: true, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active) return
    const delta = e.clientX - drag.current.startX
    if (Math.abs(delta) > 4) drag.current.moved = true
    const next = drag.current.startOffset + delta
    setOffset(Math.max(-EDIT_WIDTH, Math.min(SCORES_WIDTH, next)))
  }

  function onPointerUp() {
    drag.current.active = false
    if (offset < -SNAP_THRESHOLD) snapTo(-EDIT_WIDTH)
    else if (offset > SNAP_THRESHOLD) snapTo(SCORES_WIDTH)
    else snapTo(0)
  }

  function handleClick() {
    if (drag.current.moved) return
    if (offset !== 0) { snapTo(0); return }
    onClick()
  }

  function handleRename() {
    const trimmed = editName.trim()
    if (trimmed) onRename(player.id, trimmed)
    setEditing(false)
    snapTo(0)
  }

  return (
    <div className="swipeable-wrapper">
      <div className="scores-panel">
        <button className="scores-panel__btn" onClick={() => { setShowScores(true); snapTo(0) }}>
          Scores
        </button>
      </div>

      <div className="edit-panel">
        <button className="edit-panel__btn" onClick={() => setEditing(true)}>
          Edit
        </button>
      </div>

      <button
        className={`score-block ${isCurrent ? 'score-block--current' : ''}`}
        style={{
          transform: `translateX(${offset}px)`,
          transition: snapping ? 'transform 0.2s ease' : 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={handleClick}
      >
        <div className="score-block__name">{player.name}</div>
        <div className="score-block__score">{totalScore}</div>
        <div className="score-block__progress">
          {turnsPlayed} of {cardsDealt} cards laid
        </div>
      </button>

      {showScores && (
        <div className="scores-overlay" onClick={() => setShowScores(false)}>
          <div className="scores-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="scores-dialog__title">{player.name}</h2>
            {playerRounds.length === 0 ? (
              <p className="scores-dialog__empty">No rounds played yet.</p>
            ) : (
              <div className="scores-dialog__list">
                {playerRounds.map((r, i) => {
                  const s = r.scores.find((s) => s.playerId === player.id)
                  const score = s?.score ?? 0
                  const isEditing = editingRoundId === r.id
                  return (
                    <div key={r.id} className="scores-dialog__row">
                      <span className="scores-dialog__round">Round {i + 1}</span>
                      {isEditing ? (
                        <>
                          <input
                            className="scores-dialog__input"
                            type="number"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateRoundScore(r.id, player.id, parseInt(editingValue, 10) || 0)
                                setEditingRoundId(null)
                              }
                              if (e.key === 'Escape') setEditingRoundId(null)
                            }}
                            autoFocus
                          />
                          <button className="scores-dialog__action save" onClick={() => {
                            updateRoundScore(r.id, player.id, parseInt(editingValue, 10) || 0)
                            setEditingRoundId(null)
                          }}>✓</button>
                          <button className="scores-dialog__action cancel" onClick={() => setEditingRoundId(null)}>✕</button>
                        </>
                      ) : (
                        <>
                          <span className={`scores-dialog__score ${score < 0 ? 'neg' : ''}`}>{score}</span>
                          <button className="scores-dialog__action edit" onClick={() => {
                            setEditingRoundId(r.id)
                            setEditingValue(String(score))
                          }}>✏</button>
                          <button className="scores-dialog__action delete" onClick={() => deleteRound(r.id)}>🗑</button>
                        </>
                      )}
                    </div>
                  )
                })}
                <div className="scores-dialog__total">
                  <span>Total</span>
                  <span>{totalScore}</span>
                </div>
              </div>
            )}
            <button className="scores-dialog__close" onClick={() => setShowScores(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="edit-overlay" onClick={() => setEditing(false)}>
          <div className="edit-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="edit-dialog__label">Edit player name</p>
            <input
              className="edit-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename() }}
              autoFocus
            />
            <div className="edit-actions">
              <button className="edit-cancel" onClick={() => setEditing(false)} aria-label="Cancel">
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
                  <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="edit-save" onClick={handleRename}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
