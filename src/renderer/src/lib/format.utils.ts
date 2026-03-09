/**
 * Formats a string to be partially hidden (e.g., "sk-a...5f21")
 */
export const hiddenText = (str: string, maxVisibleLength: number = 8) => {
  if (!str) return ''
  if (str.length <= maxVisibleLength) return '********' // Too short to safely show parts

  const start = str.slice(0, 4)
  const end = str.slice(-4)

  return `${start}••••••••${end}`
}
