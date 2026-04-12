import { useEffect, useMemo, useState, useRef } from 'react'
import { MediaGetSchema } from '@common/db-schemas/media.schema'
import { generateTailwindGradient } from '@renderer/lib/colors'
import { Spinner } from './ui/spinner'
import { cn } from '../lib/utils'
import { Download, Expand, Trash } from 'lucide-react'
import { Button } from './ui/button'
import VideoDetailsDialog from './video-details-dialog'
import { useDeleteVideo } from '@renderer/services/video-gen'

/**
 * Component to display generated videos
 * with loading and pop up open modal @TODO
 */
const GeneratedVideoDisplay = ({
  video,
  loading
}: {
  video?: MediaGetSchema
  loading: boolean
}) => {
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  // hook to delete video
  const { mutate } = useDeleteVideo()

  //generate random gradient for the placeholder
  const gradientStyles = useMemo(() => generateTailwindGradient(), [])

  //video is loading in ui
  useEffect(() => {
    if (video?.mediaUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(false)
    }
  }, [video?.mediaUrl])

  // function to delete video
  const handleDelete = async (): Promise<void> => {
    if (!video?.id) return
    mutate(video.id)
  }

  // function to download video
  const handleDownload = async (): Promise<void> => {
    if (!video?.relativePath) return
    await window.api.downloadFile(video.relativePath)
  }

  return (
    <div
      className="aspect-video w-full overflow-hidden flex items-center justify-center relative group rounded-xl shadow-md border-border border"
      style={gradientStyles}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      {/* display video */}
      {!loading && video?.mediaUrl ? (
        <video
          ref={videoRef}
          muted
          loop
          className={cn(
            'w-full h-full bg-black/80 object-contain transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoadedData={() => setLoaded(true)}
          key={video.mediaUrl}
        >
          <source src={video.mediaUrl} type="video/mp4" />
          App does not support the video tag.
        </video>
      ) : null}

      {/* show spinner during loading or when video hasn't loaded yet */}
      {(!loaded || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <Spinner className="size-10 text-white drop-shadow-lg" />
        </div>
      )}

      {/* Dark overlay on hover */}
      {!loading && video ? (
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between group pointer-events-none group-hover:pointer-events-auto">
          <div className="p-2 w-full flex justify-between gap-2">
            {/* left side buttons */}
            <div className="flex gap-2">
              <VideoDetailsDialog video={video} onDownload={handleDownload} onDelete={handleDelete}>
                <Button size="icon" variant="secondary" aria-label="view video details">
                  <Expand />
                </Button>
              </VideoDetailsDialog>
            </div>
            {/* right side buttons */}
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={handleDownload}
                aria-label="download video"
              >
                <Download />
              </Button>
              <Button
                size="icon"
                variant="default"
                onClick={handleDelete}
                className="bg-destructive/80 text-foreground"
                aria-label="delete video"
              >
                <Trash />
              </Button>
            </div>
          </div>
          <p className="p-2 text-foreground/90">{video?.modelId}</p>
        </div>
      ) : null}
    </div>
  )
}

export default GeneratedVideoDisplay
