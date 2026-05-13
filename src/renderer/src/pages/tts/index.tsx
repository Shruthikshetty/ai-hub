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
import { useFetchMedia } from '@renderer/services/media'
import { useGenerateSpeech } from '@renderer/services/tts'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import { useState } from 'react'
import { VOICE_OPTIONS } from '@common/constants/voices.constants'
import GeneratedAudioDisplay from '@renderer/components/generated-audio-display'
import { Volume2 } from 'lucide-react'

// landing page for tts - text to speech conversion tab
const TTSPage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // state to manage voice
  const [voice, setVoice] = useState('')

  // get selected model from global store
  const model = useSelectedModel((state) => state.models['audio'])

  // derive the voice options for the selected model
  const voiceOptions = VOICE_OPTIONS?.[model?.provider as keyof typeof VOICE_OPTIONS] ?? []

  // fetch all the list of generated media
  const { data: mediaList, refetch } = useFetchMedia({ type: 'tts' })

  // hook to generate speech
  const { mutateAsync: generateSpeech, isPending } = useGenerateSpeech()

  // handle submit function
  const handleSubmit = () => {
    if (!model || !voice) return
    generateSpeech(
      {
        model: model,
        text: prompt,
        voice: voice
      },
      {
        onSuccess: () => {
          // refetch the media list
          refetch()
          setPrompt('')
        }
      }
    )
  }

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 overflow-hidden w-full mx-auto">
      <h2 className="text-md md:text-lg font-medium text-center w-full">TTS - (Text To Speech)</h2>
      {/* audio grid */}
      <div className="grow overflow-auto min-h-0 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
          {isPending && <GeneratedAudioDisplay media={undefined} loading={true} />}
          {mediaList?.data?.map((media) => (
            <GeneratedAudioDisplay key={media.id} media={media} loading={false} />
          ))}
        </div>
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
