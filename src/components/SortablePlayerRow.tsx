import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Player } from '../types'
import './SortablePlayerRow.css'

interface Props {
  player: Player
  onRemove: (id: string) => void
}

export function SortablePlayerRow({ player, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: player.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="player-row">
      <button className="drag-handle" {...attributes} {...listeners} aria-label="Drag to reorder">
        <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="3" r="1.5"/><circle cx="3" cy="9" r="1.5"/><circle cx="3" cy="15" r="1.5"/>
          <circle cx="9" cy="3" r="1.5"/><circle cx="9" cy="9" r="1.5"/><circle cx="9" cy="15" r="1.5"/>
        </svg>
      </button>
      <span className="player-name">{player.name}</span>
      <button className="remove-btn" onClick={() => onRemove(player.id)} aria-label={`Remove ${player.name}`}>
        ✕
      </button>
    </div>
  )
}
