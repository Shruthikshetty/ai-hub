import { getMessageText } from '@renderer/lib/conversation.utils'
import { MessageAction } from './ai-elements/message'
import { AppUIMessage } from '@common/schemas/messages.schema'
import { cn } from '@renderer/lib/utils'
import { Loader2, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useGenerateSpeech } from '@renderer/services/tts'
import { useGetMediaByMessageId } from '@renderer/services/media'
import { ModelSchemaType } from '@common/schemas/model.schema'

/**
 * Component to handle voice message action.
 * this component is supposed to be used in a message actions
 * so it will be passing chat id and message and
 * will generate and link the tts file to the chat message
 */
const VoiceMessageAction = ({
  message,
  chatId,
  model
}: {
  message: AppUIMessage
  chatId?: number
  model: ModelSchemaType | null
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cachedUrlRef = useRef<string | null>(null)

  const { mutate: generateSpeech, isPending } = useGenerateSpeech()

  // hook to get the media by message currently voice file only
  const { data: existingMedia, isLoading: isFetchingExisting } = useGetMediaByMessageId(message.id)

  // derive loading state
  const isLoading = isPending || isFetchingExisting

  // store the media url in ref for catching
  useEffect(() => {
    const mediaUrl = existingMedia?.data?.mediaUrl
    if (mediaUrl && !cachedUrlRef.current) {
      cachedUrlRef.current = mediaUrl
    }
  }, [existingMedia])

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
    if (!chatId || !model) return

    // If already speaking, stop playback
    if (isSpeaking) {
      stopAudio()
      return
    }

    // use the cached url if it already exists
    if (cachedUrlRef.current) {
      playAudio(cachedUrlRef.current)
      return
    }

    // generate speech
    generateSpeech(
      { text, chatId: chatId.toString(), messageId: message.id, model }, //@TODO voice is temporary hardcoded
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
      disabled={isLoading}
      onClick={() => handleReadAloud(getMessageText(message))}
    >
      {isLoading ? (
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
