import { MediaGetSchema } from '@common/db-schemas/media.schema'
import { Download, Expand, Play, Square, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { generateTailwindGradient } from '@renderer/lib/colors'
import { Spinner } from './ui/spinner'
import Waveform from './waveform'
import AudioDetailsDialog from './audio-details-dialog'
import { useDeleteGeneratedTTSAudio } from '@renderer/services/tts'

/**
 * Card component to display a single generated audio item.
 * Shows waveform visualization, prompt preview, voice label,
 * play/stop controls and delete / expand / download actions.
 */
const GeneratedAudioDisplay = ({
  media,
  loading = false
}: {
  media?: MediaGetSchema
  loading: boolean
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  // custom hook to delete the generated audio
  const { mutate: deleteAudio } = useDeleteGeneratedTTSAudio()

  // generate random gradient for the image
  const gradientStyles = useMemo(() => generateTailwindGradient(), [])

  // Pause, reset, and release the audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }
  }, [])

  // function to play the audio file
  const handlePlay = () => {
    if (!audioRef.current) return
    audioRef.current.play()
    setPlaying(true)
  }

  // function to stop the audio file
  const handleStop = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
  }

  // download audio file
  const handleDownload = async () => {
    if (!media?.relativePath) return
    await window.api.downloadFile(media.relativePath)
  }

  // delete audio file
  const handleDelete = () => {
    if (!media?.id) return
    deleteAudio(media.id)
  }

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* hidden audio element */}
      {media?.mediaUrl && (
        <audio
          ref={audioRef}
          src={media.mediaUrl}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      )}

      {/* waveform area */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-muted/60 px-3 py-2 overflow-hidden min-h-14"
        style={loading ? gradientStyles : undefined}
      >
        {loading ? (
          <Spinner className="size-5 text-white drop-shadow-sm" />
        ) : (
          <Waveform playing={playing} />
        )}
      </div>

      {/* prompt preview */}
      <p className="text-sm font-medium leading-snug text-foreground line-clamp-2">
        {media?.prompt || '—'}
      </p>

      {/* footer row: voice label + actions */}
      <div className="flex items-center justify-between gap-2">
        {/* voice / model label */}
        <span className="text-xs text-muted-foreground truncate max-w-[50%]">
          {media?.modelId ?? '—'}
        </span>

        {/* action buttons */}
        <div className="flex items-center gap-1">
          {/* play */}
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="play audio"
            disabled={loading || !media?.mediaUrl || playing}
            onClick={handlePlay}
          >
            <Play className="size-4" />
          </Button>

          {/* stop */}
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="stop audio"
            disabled={loading || !playing}
            onClick={handleStop}
          >
            <Square className="size-4" />
          </Button>

          {/* divider */}
          <span className="mx-1 h-4 w-px bg-border" />

          {/* expand — opens audio details dialog */}
          <AudioDetailsDialog audio={media} onDownload={handleDownload} onDelete={handleDelete}>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="expand audio details"
              disabled={loading || !media}
            >
              <Expand className="size-4" />
            </Button>
          </AudioDetailsDialog>

          {/* download */}
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="download audio"
            disabled={loading || !media}
            onClick={handleDownload}
          >
            <Download className="size-4" />
          </Button>

          {/* delete */}
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="delete audio"
            className="text-destructive hover:bg-destructive/10"
            disabled={loading || !media}
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GeneratedAudioDisplay
