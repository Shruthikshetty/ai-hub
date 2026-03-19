import { cn } from '@renderer/lib/utils'
import { Bot } from 'lucide-react'
import { Spinner } from './ui/spinner'

/**
 * custom styled bot icon
 * @param size - size of the icon
 * @param className - className for the icon
 * @param loading - whether to show spinner or not
 */
function BotIcon({
  size = 32,
  className,
  loading = false
}: {
  size?: number
  className?: string
  loading?: boolean
}) {
  return (
    <div
      className={cn(
        'w-16 h-16 rounded-full bg-linear-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg',
        className
      )}
    >
      {loading ? <Spinner /> : <Bot size={size} className="text-white" />}
    </div>
  )
}

export default BotIcon
