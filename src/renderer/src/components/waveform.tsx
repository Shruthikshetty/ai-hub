import { cn } from '@renderer/lib/utils'

/**
 * Animated waveform bars
 * When playing, bars animate; when paused they freeze.
 */
const Waveform = ({ playing }: { playing: boolean }) => (
  <div className="flex items-center justify-center gap-[3px] h-14 w-full">
    {Array.from({ length: 28 }).map((_, i) => (
      <span
        key={i}
        className={cn(
          'inline-block w-[3px] rounded-full bg-foreground/30 origin-center',
          playing && 'animate-waveform'
        )}
        style={{
          height: `${20 + Math.sin(i * 0.8) * 14 + Math.cos(i * 1.3) * 10}px`,
          animationDelay: playing ? `${(i * 60) % 400}ms` : '0ms'
        }}
      />
    ))}
  </div>
)
export default Waveform
