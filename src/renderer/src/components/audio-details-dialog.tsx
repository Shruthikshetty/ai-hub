import { MediaGetSchema } from '@common/db-schemas/media.schema'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Download, Trash } from 'lucide-react'
import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange
} from './ai-elements/audio-player'

/**
 * Dialog to display audio details
 * with player and additional options to download and delete
 */
const AudioDetailsDialog = ({
  audio,
  children,
  onDownload,
  onDelete
}: {
  children: React.ReactNode
  audio?: MediaGetSchema
  onDownload: () => Promise<void>
  onDelete: () => void
}) => {
  // holds the model open close state
  const [open, setOpen] = useState(false)
  // audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 overflow-hidden sm:max-w-none w-[90vw] max-h-[90vh] pt-5"
        crossSize={'lg'}
      >
        {/* prompt in a nice max with scroll */}
        <div className="px-6 py-2 overflow-auto max-h-[60vh]">
          <p className="text-base text-foreground">{audio?.prompt}</p>
        </div>

        {/* Audio player */}
        {audio?.mediaUrl && (
          <div className="px-5 py-3 w-full">
            <AudioPlayer className="w-full [&_media-control-bar]:w-full [&_[role=group]]:w-full [&_media-time-range]:flex-1">
              <AudioPlayerElement src={audio.mediaUrl} ref={audioRef} preload="auto" />
              <AudioPlayerControlBar>
                <AudioPlayerSeekBackwardButton size="icon-lg" />
                <AudioPlayerPlayButton size="icon-lg" />
                <AudioPlayerSeekForwardButton size="icon-lg" />
                <AudioPlayerTimeDisplay />
                <AudioPlayerTimeRange />
                <AudioPlayerDurationDisplay />
                <AudioPlayerMuteButton />
                <AudioPlayerVolumeRange />
              </AudioPlayerControlBar>
            </AudioPlayer>
          </div>
        )}

        {/* Footer — model label + actions */}
        <div className="shrink-0 flex flex-row items-center justify-between px-4 py-2 border-t bg-muted rounded-b-xl">
          <p className="text-sm text-muted-foreground">{audio?.modelId}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onDownload}>
              Download
              <Download />
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete()
                setOpen(false)
              }}
            >
              Delete
              <Trash />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AudioDetailsDialog
