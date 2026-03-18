import { useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import { Spinner } from './ui/spinner'
import { generateTailwindGradient } from '@renderer/lib/colors'

/**
 * Component to display generated images
 * with loading and pop up open modal
 */
const GeneratedImageDisplay = ({ imageUrl, loading }: { imageUrl: string; loading: boolean }) => {
  // state to check if image is loaded
  const [loaded, setLoaded] = useState(false)

  // generate random gradient for the image
  const gradientStyles = useMemo(() => generateTailwindGradient(), [])
  console.log(gradientStyles)
  return (
    <div
      className={cn(
        'group relative aspect-square overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl border-border border'
      )}
      style={gradientStyles}
    >
      {/* display image */}
      {!loading && imageUrl ? (
        <img
          src={imageUrl}
          alt="generated image"
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setLoaded(true)}
        />
      ) : null}

      {/* show spinner during loading or when image hasn't loaded yet */}
      {(!loaded || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <Spinner className="size-10 text-white drop-shadow-lg" />
        </div>
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  )
}

export default GeneratedImageDisplay
