import { SPINNER_COLORS } from '@renderer/constants/screen.constants'
import { cn } from '../lib/utils'

/**
 * creates a gradient loader animation
 */
export default function GradientLoader({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 100 100"
      className={cn('size-15 animate-spin', className)}
      {...props}
    >
      {Array.from({ length: 12 }).map((_, i) => {
        // Start from top (-90 degrees) and go clockwise
        const angle = (-90 + i * 30) * (Math.PI / 180)
        const x = 50 + 35 * Math.cos(angle)
        const y = 50 + 35 * Math.sin(angle)

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            // Slightly decrease radius and opacity to create a tail effect
            r={6 - i * 0.15}
            fill={SPINNER_COLORS[i]}
            opacity={1 - i * 0.05}
          />
        )
      })}
    </svg>
  )
}
