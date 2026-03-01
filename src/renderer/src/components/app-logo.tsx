import { cn } from '../lib/utils'

interface AppLogoProps {
  width?: number
  height?: number
  className?: string
}

function AppLogo({ width = 40, height = 40, className }: AppLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
    >
      <rect width="40" height="40" rx="8" className="fill-muted" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-foreground"
        fontWeight="700"
        fontSize="16"
        fontFamily="system-ui, sans-serif"
      >
        AI
      </text>
    </svg>
  )
}

export default AppLogo
