/**
 * Generates a random seed
 * @returns {number} Random seed
 */
export const getRandomSeed = (numberOfDigits: number = 6) => {
  const min = 10 ** (numberOfDigits - 1)
  const max = 10 ** numberOfDigits - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Builds a URL query string from a record of parameters.
 * Automatically filters out null, undefined, or empty string values.
 * Handles arrays by repeating the parameter name (e.g. ?tag=a&tag=b).
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      // in case value is array
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val !== undefined && val !== null && val !== '') {
            searchParams.append(key, String(val))
          }
        })
      } else {
        searchParams.append(key, String(value))
      }
    }
  }
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
