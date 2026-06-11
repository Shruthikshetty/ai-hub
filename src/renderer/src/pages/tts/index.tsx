import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import AppModelSelector from '@renderer/components/model-selector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { useFetchInfiniteMedia } from '@renderer/services/media'
import { useGenerateSpeech } from '@renderer/services/tts'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import { useRef, useState } from 'react'
import { VOICE_OPTIONS } from '@common/constants/voices.constants'
import GeneratedAudioDisplay from '@renderer/components/generated-audio-display'
import { Volume2 } from 'lucide-react'
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso'
import { LOADING_TTS_MEDIA_ITEM } from '@renderer/constants/screen.constants'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { MEDIA_FETCH_PAGE_LIMIT_BY_TYPE } from '@renderer/constants/config.constants'

// landing page for tts - text to speech conversion tab
const TTSPage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // state to manage voice
  const [voice, setVoice] = useState('')
  // query client
  const queryClient = useQueryClient()
  // hold our virtual list ref
  const virtuosoRef = useRef<VirtuosoGridHandle>(null)

  // get selected model from global store
  const model = useSelectedModel((state) => state.models['audio'])

  // derive the voice options for the selected model
  const voiceOptions = VOICE_OPTIONS?.[model?.provider as keyof typeof VOICE_OPTIONS] ?? []

  // fetch all the list of generated media
  const {
    data: mediaList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchInfiniteMedia({ type: 'tts', limit: MEDIA_FETCH_PAGE_LIMIT_BY_TYPE.tts })
  // flatten the array
  const mediaItems = mediaList?.pages.flatMap((page) => page.data.media) ?? []

  // hook to generate speech
  const { mutateAsync: generateSpeech, isPending } = useGenerateSpeech()

  // handle submit function
  const handleSubmit = () => {
    if (!model || !voice) return
    // scroll to top
    virtuosoRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    generateSpeech(
      {
        model: model,
        text: prompt,
        voice: voice
      },
      {
        onSuccess: () => {
          // reset the query
          queryClient.resetQueries({ queryKey: [QUERY_KEYS.mediaFetchInfinite, 'tts'] })
          setPrompt('')
        }
      }
    )
  }

  // fetch more audio if they exist
  const fetchMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 overflow-hidden w-full mx-auto">
      <h2 className="text-md md:text-lg font-medium text-center w-full">TTS - (Text To Speech)</h2>
      {/* audio grid */}
      <div className="grow overflow-auto min-h-0 w-full">
        <VirtuosoGrid
          ref={virtuosoRef}
          className="h-full w-full"
          overscan={900}
          listClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2"
          endReached={fetchMore}
          data={isPending ? [LOADING_TTS_MEDIA_ITEM, ...mediaItems] : mediaItems}
          itemContent={(_index, media) => {
            const isLoading = media.id === -1
            return (
              <GeneratedAudioDisplay
                media={isLoading ? undefined : media}
                loading={isLoading}
                key={media.id}
              />
            )
          }}
        />
      </div>

      {/* input area */}
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        {/* BODY  */}
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Enter text you want to convert to speech"
          />
        </PromptInputBody>
        {/* FOOTER */}
        <PromptInputFooter>
          {/* All tools go here */}
          <PromptInputTools>
            {/* model selector */}
            <AppModelSelector modelType="audio" output="audio" />
            {/* voice selector */}
            <Select value={voice} onValueChange={(value) => setVoice(value)}>
              <SelectTrigger
                hideIcon
                customIcon={<Volume2 />}
                className="border-0 hover:bg-input/50! bg-transparent!"
              >
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PromptInputTools>
          {/* submit button */}
          <PromptInputSubmit
            disabled={isPending || !model || !prompt.trim() || !voice}
            status={isPending ? 'submitted' : 'ready'}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

export default TTSPage
