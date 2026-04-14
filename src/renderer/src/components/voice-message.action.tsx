import { getMessageText } from '@renderer/lib/conversation.utils'
import { MessageAction } from './ai-elements/message'
import { AppUIMessage } from '@common/schemas/messages.schema'
import { cn } from '@renderer/lib/utils'
import { Loader2, Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useGenerateSpeech } from '@renderer/services/tts'

/**
 * Component to handle voice message action
 * @param message - message to play
 * @returns Voice message action component
 */
const VoiceMessageAction = ({ message, chatId }: { message: AppUIMessage; chatId?: number }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cachedUrlRef = useRef<string | null>(null)
  const { mutate: generateSpeech, isPending } = useGenerateSpeech()

  /** Stop and clean up the current audio instance */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setIsSpeaking(false)
  }

  /** Play audio from a media URL and wire up end/error cleanup */
  const playAudio = (mediaUrl: string) => {
    // stop audio if already playing
    stopAudio()
    // create new audio instance
    const audio = new Audio(mediaUrl)
    audioRef.current = audio
    audio.addEventListener('ended', stopAudio)
    audio.addEventListener('error', stopAudio)
    // play audio
    audio.play()
    setIsSpeaking(true)
  }

  // handler to read aloud
  const handleReadAloud = (text: string) => {
    // return in case no chatId
    if (!chatId) return

    // If already speaking, stop playback
    if (isSpeaking) {
      stopAudio()
      return
    }

    // use the cached url if already exist
    if (cachedUrlRef.current) {
      playAudio(cachedUrlRef.current)
      return
    }

    // generate speech
    generateSpeech(
      { text, chatId: chatId.toString() },
      {
        onSuccess: (result) => {
          const mediaUrl = result?.data?.mediaUrl
          if (mediaUrl) {
            cachedUrlRef.current = mediaUrl
            playAudio(mediaUrl)
          }
        }
      }
    )
  }

  return (
    <MessageAction
      className="active:scale-95 transition-all"
      label={isSpeaking ? 'Stop' : 'Read Aloud'}
      tooltip={isSpeaking ? 'Stop speaking' : 'Read aloud'}
      disabled={isPending}
      onClick={() => handleReadAloud(getMessageText(message))}
    >
      {isPending ? (
        <Loader2 className="animate-spin size-4" />
      ) : (
        <Volume2
          className={cn('size-4 transition-colors duration-300', isSpeaking ? 'text-blue-500' : '')}
        />
      )}
    </MessageAction>
  )
}

export default VoiceMessageAction
