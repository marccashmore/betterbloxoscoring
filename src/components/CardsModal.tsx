import { useState, useRef } from 'react'
import type { Player } from '../types'
import './CardsModal.css'

const QUICK_OPTIONS = [
  { value: 5, color: 'var(--green)' },
  { value: 6, color: 'var(--yellow)', textColor: '#000' },
  { value: 7, color: 'var(--blue)' },
]

interface Props {
  players: Player[]
  onConfirm: (cardsDealt: number) => void
  onBack: () => void
}

export function CardsModal({ onConfirm, onBack }: Props) {
  const [customValue, setCustomValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleQuick(n: number) {
    onConfirm(n)
  }

  function handleCustomOk() {
    const n = parseInt(customValue, 10)
    if (!n || n < 1) return
    onConfirm(n)
  }

  return (
    <div className="cards-overlay">
      <div className="cards-dialog">
        <h2 className="cards-title">How many cards each?</h2>

        <div className="quick-options">
          {QUICK_OPTIONS.map(({ value, color, textColor }) => (
            <button
              key={value}
              className="quick-btn"
              style={{ background: color, color: textColor ?? '#fff' }}
              onClick={() => handleQuick(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <p className="cards-or">or enter a number</p>

        <div className="custom-row">
          <input
            ref={inputRef}
            className="cards-input"
            type="number"
            min={1}
            placeholder="e.g. 8"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCustomOk() }}
          />
          <button
            className="ok-btn"
            onClick={handleCustomOk}
            disabled={!customValue || parseInt(customValue, 10) < 1}
          >
            OK
          </button>
        </div>

        <button className="cards-back" onClick={onBack}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Back
        </button>
      </div>
    </div>
  )
}
