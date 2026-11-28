/**
 * Checks whether all space/separator-delimited search tokens match
 * the provided text fields (case-insensitive, separator-tolerant).
 */
export function matchesSearchTokens(
  query: string,
  fields: Array<string | null | undefined>
): boolean {
  // normalize the query
  const normalizedQuery = query
    .trim()
    .toLowerCase()
    .replace(/[-_/.]+/g, ' ') // replace separator by space

  // in case the query is empty, return true
  if (!normalizedQuery) return true

  // split by space
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)

  // post split if still empty, return true
  if (tokens.length === 0) return true

  // prepare fields for searching
  const haystack = fields
    .filter((field): field is string => Boolean(field))
    .join(' ')
    .toLowerCase()
    .replace(/[-_/.]+/g, ' ')

  // non separated text for fuzzy matching
  const compactHaystack = haystack.replace(/\s+/g, '')

  return tokens.every((token) => haystack.includes(token) || compactHaystack.includes(token))
}
