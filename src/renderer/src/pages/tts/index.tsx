import { ModelIOType } from '@common/schemas/model.schema'
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

// landing page for tts - text to speech conversion tab
const TTSPage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // state to manage voice
  const [voice, setVoice] = useState('')

  // get selected model from global store
  const getModel = useSelectedModel((state) => state.getModel)
  const model = getModel('audio' as ModelIOType)

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
        {isPending ? <p>Generating Audio...</p> : null}
        {mediaList?.data?.map((media) => (
          <div key={media.id} className="relative">
            <audio controls className="w-full">
              <source src={media.mediaUrl} type="audio/mp3" />
            </audio>
          </div>
        ))}
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
            <AppModelSelector modelType="audio" output="audio" />
            <Select value={voice} onValueChange={(value) => setVoice(value)}>
              <SelectTrigger className="border border-input bg-input/30">
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
