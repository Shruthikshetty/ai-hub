/**
 * Formats a string to be partially hidden (e.g., "sk-a...5f21")
 */
export const hiddenText = (
  str: string,
  maxVisibleLength: number = 8,
  minHiddenLength: number = 4
) => {
  if (!str) return ''

  // handle smaller text
  const visiblePerSide = Math.floor(maxVisibleLength / 2)
  if (str.length <= maxVisibleLength + minHiddenLength) return '********'

  const start = str.slice(0, visiblePerSide)
  const end = str.slice(-visiblePerSide)

  return `${start}••••••••${end}`
}

/**
 * completely mask the string
 */
export const maskedText = (strOrLength: string | number = 16, char: string = '•') => {
  const len = typeof strOrLength === 'number' ? strOrLength : strOrLength?.length || 16
  return char.repeat(len)
}
