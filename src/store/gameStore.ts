import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Game, Player, Round } from '../types'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

interface GameStore {
  game: Game | null
  knownNames: string[]
  startGame: (players: Player[], cardsDealt: number) => void
  abandonGame: () => void
  addRound: (round: Round) => void
  advanceTurn: () => void
  removeName: (name: string) => void
  renamePlayer: (playerId: string, name: string) => void
  clearScores: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      game: null,
      knownNames: [],

      startGame: (players, cardsDealt) =>
        set((state) => ({
          game: {
            id: generateId(),
            players,
            rounds: [],
            currentPlayerIndex: 0,
            cardsDealt,
            createdAt: Date.now(),
          },
          knownNames: Array.from(
            new Set([...state.knownNames, ...players.map((p) => p.name)])
          ),
        })),

      abandonGame: () => set({ game: null }),

      addRound: (round) =>
        set((state) => {
          if (!state.game) return state
          return {
            game: {
              ...state.game,
              rounds: [...state.game.rounds, round],
            },
          }
        }),

      advanceTurn: () =>
        set((state) => {
          if (!state.game) return state
          return {
            game: {
              ...state.game,
              currentPlayerIndex:
                (state.game.currentPlayerIndex + 1) % state.game.players.length,
            },
          }
        }),

      removeName: (name) =>
        set((state) => ({
          knownNames: state.knownNames.filter((n) => n !== name),
        })),

      clearScores: () =>
        set((state) => {
          if (!state.game) return state
          return {
            game: {
              ...state.game,
              rounds: [],
              currentPlayerIndex: 0,
            },
          }
        }),

      renamePlayer: (playerId, name) =>
        set((state) => {
          if (!state.game) return state
          return {
            game: {
              ...state.game,
              players: state.game.players.map((p) =>
                p.id === playerId ? { ...p, name } : p
              ),
            },
            knownNames: Array.from(new Set([...state.knownNames, name])),
          }
        }),
    }),
    { name: 'bloxo-game' }
  )
)
