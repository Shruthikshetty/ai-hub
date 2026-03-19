import type { CSSProperties } from 'react'

// Curated palette of vivid gradient-friendly colors
const GRADIENT_COLORS: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e'
}

/**
 * Generates a random gradient style object using hardcoded hex colors.
 * @returns {CSSProperties} - Gradient style object
 */
export const generateTailwindGradient = (): CSSProperties => {
  const colorKeys = Object.keys(GRADIENT_COLORS)

  const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

  // list of directions for gradient
  const directions = [
    'to top',
    'to top right',
    'to right',
    'to bottom right',
    'to bottom',
    'to bottom left',
    'to left',
    'to top left'
  ]

  // pick random colors for gradient
  const fromKey = random(colorKeys)
  // if both colors are same, pick another color
  let toKey = random(colorKeys)
  while (fromKey === toKey) {
    toKey = random(colorKeys)
  }
  // pick random direction for gradient
  const direction = random(directions)
  const fromHex = GRADIENT_COLORS[fromKey]
  const toHex = GRADIENT_COLORS[toKey]

  return {
    backgroundImage: `linear-gradient(${direction}, ${fromHex}, ${toHex})`
  }
}
