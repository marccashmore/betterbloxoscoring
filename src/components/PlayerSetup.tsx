import { useState, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useGameStore } from '../store/gameStore'
import { SortablePlayerRow } from './SortablePlayerRow'
import type { Player } from '../types'
import './PlayerSetup.css'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

interface Props {
  onContinue: (players: Player[]) => void
  onReturnToGame?: () => void
}

export function PlayerSetup({ onContinue, onReturnToGame }: Props) {
  const { game, knownNames, abandonGame, removeName } = useGameStore()
  const [players, setPlayers] = useState<Player[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  )

  const suggestions = knownNames.filter(
    (name) =>
      name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !players.find((p) => p.name === name)
  )

  function addPlayer(name: string) {
    const trimmed = name.trim()
    if (!trimmed || players.find((p) => p.name === trimmed)) return
    setPlayers((prev) => [...prev, { id: generateId(), name: trimmed }])
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setPlayers((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id)
        const newIndex = prev.findIndex((p) => p.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function handleStartGame() {
    if (players.length < 2) return
    if (game) {
      setShowConfirm(true)
    } else {
      onContinue(players)
    }
  }

  function confirmNewGame() {
    abandonGame()
    setShowConfirm(false)
    onContinue(players)
  }

  return (
    <div className="player-setup">
      <h1 className="setup-title">
        <span className="b">B</span>
        <span className="l">L</span>
        <span className="o1">O</span>
        <span className="x">X</span>
        <span className="o2">O</span>
      </h1>
      <h2 className="setup-subtitle">New Game</h2>

      <div className="add-player-row">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            className="name-input"
            type="text"
            placeholder="Enter player name"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addPlayer(inputValue)
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((name) => (
                <li key={name} onMouseDown={() => addPlayer(name)}>
                  <span>{name}</span>
                  <button
                    className="suggestion-remove"
                    onMouseDown={(e) => { e.stopPropagation(); removeName(name) }}
                    aria-label={`Remove ${name} from saved names`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="add-btn"
          onClick={() => addPlayer(inputValue)}
          disabled={!inputValue.trim()}
        >
          Add
        </button>
      </div>

      {players.length > 0 && (
        <div className="player-list">
          <p className="list-hint">Drag to reorder — top player goes first</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={players.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {players.map((player) => (
                <SortablePlayerRow
                  key={player.id}
                  player={player}
                  onRemove={removePlayer}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <button
        className="start-btn"
        onClick={handleStartGame}
        disabled={players.length < 2}
      >
        Start Game
      </button>

      {game && onReturnToGame && (
        <button className="return-btn" onClick={onReturnToGame}>
          Return to Current Game
        </button>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>A game is already in progress. Starting a new game will lose all current scores.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowConfirm(false)} aria-label="Cancel">
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="confirm-proceed" onClick={confirmNewGame}>
                Start New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
