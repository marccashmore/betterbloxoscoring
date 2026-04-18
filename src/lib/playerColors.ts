export const PLAYER_COLORS = ['#39b54a', '#29abe2', '#e5007e', '#f7d117']

export function textColorFor(bg: string): string {
  return bg === '#f7d117' ? '#111' : '#fff'
}

export function colorAt(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

export function nextColor(current: string): string {
  const i = PLAYER_COLORS.indexOf(current)
  return PLAYER_COLORS[(i < 0 ? 1 : (i + 1)) % PLAYER_COLORS.length]
}
