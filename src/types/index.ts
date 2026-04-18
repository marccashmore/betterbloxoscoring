export interface Player {
  id: string
  name: string
  color?: string
}

export interface RoundScore {
  playerId: string
  score: number
}

export interface Round {
  id: string
  scores: RoundScore[]
}

export interface Game {
  id: string
  players: Player[]
  rounds: Round[]
  currentPlayerIndex: number
  createdAt: number
}
