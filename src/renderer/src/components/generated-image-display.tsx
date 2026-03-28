import { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'
import { Spinner } from './ui/spinner'
import { generateTailwindGradient } from '@renderer/lib/colors'
import { MediaGetSchema } from '@common/db-schemas/media.schema'
import { Download, Expand, Trash } from 'lucide-react'
import { Button } from './ui/button'
import ImageDetailsDialog from './image-details-dialog'
import { useDeleteGeneratedImage } from '@renderer/services/image-gen'

/**
 * Component to display generated images
 * with loading and pop up open modal
 */
const GeneratedImageDisplay = ({
  image,
  loading
}: {
  image?: MediaGetSchema
  loading: boolean
}) => {
  // state to check if image is loaded
  const [loaded, setLoaded] = useState(false)
  // hook to delete image
  const { mutate } = useDeleteGeneratedImage()
  // reset loaded state when image url changes
  useEffect(() => {
    if (image?.imageUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(false)
    }
  }, [image?.imageUrl])

  const handleDelete = async (): Promise<void> => {
    if (!image?.id) return
    mutate(image.id)
  }

  /**
   * Handles the download of the image
   */
  const handleDownload = async (): Promise<void> => {
    if (!image?.relativePath) return
    await window.api.downloadFile(image.relativePath)
  }

  // generate random gradient for the image
  const gradientStyles = useMemo(() => generateTailwindGradient(), [])
  return (
    <div
      className={cn(
        'group relative aspect-square overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl border-border border'
      )}
      style={gradientStyles}
    >
      {/* display image */}
      {!loading && image?.imageUrl ? (
        <img
          src={image.imageUrl}
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
      {!loading && image ? (
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between">
          <div className="p-2 w-full flex justify-between gap-2">
            {/* left side buttons */}
            <div className="flex gap-2">
              <ImageDetailsDialog image={image} onDownload={handleDownload}>
                <Button size="icon" variant="secondary">
                  <Expand />
                </Button>
              </ImageDetailsDialog>
            </div>
            {/* right side buttons */}
            <div className="flex gap-2">
              <Button size="icon" variant="secondary" onClick={handleDownload}>
                <Download />
              </Button>
              <Button
                size="icon"
                variant="default"
                onClick={handleDelete}
                className="bg-destructive/80 text-foreground"
              >
                <Trash />
              </Button>
            </div>
          </div>
          <p className="p-2 text-foreground/90">{image?.modelId}</p>
        </div>
      ) : null}
    </div>
  )
}

export default GeneratedImageDisplay
