/**
 * Generates a random seed
 * @returns {number} Random seed
 */
export const getRandomSeed = (numberOfDigits: number = 6) => {
  const min = 10 ** (numberOfDigits - 1)
  const max = 10 ** numberOfDigits - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}
