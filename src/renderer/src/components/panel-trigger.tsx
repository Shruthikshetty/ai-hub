import { cn } from '@renderer/lib/utils'
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

/**
 * This renders a Chevron icon toggler for panels or sheets
 */
const PanelTrigger = ({
  value,
  toggle,
  className,
  title = '',
  invert = false
}: {
  value: boolean
  toggle: Dispatch<SetStateAction<boolean>>
  className?: string
  title?: string
  invert?: boolean
}) => {
  // this is used to invert the chevron direction
  const LeftIcon = invert ? SquareChevronRight : SquareChevronLeft
  const RightIcon = invert ? SquareChevronLeft : SquareChevronRight

  // render the title
  const renderTitle = () => {
    if (!title) return null
    return (
      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
        {title}
      </p>
    )
  }

  return (
    <button
      type="button"
      aria-label="toggle panel"
      onClick={() => {
        toggle((s) => !s)
      }}
      className={cn('px-2 group flex flex-row gap-2 items-center group', className)}
    >
      {invert ? renderTitle() : null}
      {value ? (
        <LeftIcon className="size-5 text-muted-foreground group-hover:text-foreground" />
      ) : (
        <RightIcon className="size-5 text-muted-foreground group-hover:text-foreground" />
      )}
      {!invert ? renderTitle() : null}
    </button>
  )
}

export default PanelTrigger
