import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Player } from '../types'
import { colorAt, textColorFor } from '../lib/playerColors'
import './SortablePlayerRow.css'

interface Props {
  player: Player
  onRemove: (id: string) => void
  onColorChange: (id: string) => void
}

export function SortablePlayerRow({ player, onRemove, onColorChange }: Props) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: player.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const bg = player.color ?? colorAt(0)
  const letter = player.name.charAt(0).toUpperCase()

  return (
    <div ref={setNodeRef} style={style} className="player-row">
      <button
        ref={setActivatorNodeRef}
        className="player-avatar"
        style={{ background: bg, color: textColorFor(bg) }}
        {...attributes}
        {...listeners}
        onClick={() => onColorChange(player.id)}
        aria-label="Drag to reorder or tap to change colour"
      >
        {letter}
      </button>
      <span className="player-name">{player.name}</span>
      <button className="remove-btn" onClick={() => onRemove(player.id)} aria-label={`Remove ${player.name}`}>
        ✕
      </button>
    </div>
  )
}
