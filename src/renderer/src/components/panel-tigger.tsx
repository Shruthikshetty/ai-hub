import { cn } from '@renderer/lib/utils'
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

/**
 * This renders a Chevron icon toggler for panels or sheets
 */
const PanelTrigger = ({
  value,
  toggle,
  className
}: {
  value: boolean
  toggle: Dispatch<SetStateAction<boolean>>
  className?: string
}) => {
  return (
    <button
      type="button"
      aria-label="toggle panel"
      onClick={() => {
        toggle((s) => !s)
      }}
      className={cn('px-2 py-4', className)}
    >
      {value ? (
        <SquareChevronLeft className="size-5 text-muted-foreground group-hover:text-foreground" />
      ) : (
        <SquareChevronRight className="size-5 text-muted-foreground group-hover:text-foreground" />
      )}
    </button>
  )
}

export default PanelTrigger
