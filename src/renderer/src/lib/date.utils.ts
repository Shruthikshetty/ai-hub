/**
 * Formats a date string into a human-readable relative label.
 *
 * Returns "Today", "Yesterday", "This week", "Last week", "This month",
 * or a formatted "Mon YYYY" string for older dates.
 *
 * @param dateString - An ISO 8601 or otherwise parseable date string.
 * @returns A relative date label.
 */
export function formatRelativeDateLabel(dateString: string | Date): string {
  const now = new Date()
  const target = new Date(dateString)
  // check if valid date
  if (isNaN(target.getTime())) {
    return 'Unknown date'
  }

  // Zero-out time for day-level comparison without mutating originals
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime()

  const diffInDays = Math.floor((todayStart - targetStart) / 86_400_000)

  if (diffInDays === 0) return 'TODAY'
  if (diffInDays === 1) return 'YESTERDAY'
  if (diffInDays < 7) return 'THIS WEEK'
  if (diffInDays < 14) return 'LAST WEEK'
  if (diffInDays < 30) return 'THIS MONTH'

  return target.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * take date | date string and return in dd/mm/yy hh:mm format
 */
export function formatDateTime(dateString: string | Date): string {
  const target = new Date(dateString)
  // check if valid date
  if (isNaN(target.getTime())) {
    return 'Unknown date'
  }
  return target.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
