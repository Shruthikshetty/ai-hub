import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import AppModelSelector from '@renderer/components/model-selector'
import { Spinner } from '@renderer/components/ui/spinner'
import { useGenerateImage } from '@renderer/services/image-gen'
import { useState } from 'react'
import useSelectedModel from '@renderer/state-management/selected-model.store'

const ImagePage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  const { getModel } = useSelectedModel()
  const model = getModel('image')

  // hook to generate image
  const { mutateAsync: generateImage, isPending, data } = useGenerateImage()

  // handler to handle submit
  const handleSubmit = () => {
    if (!model) return
    generateImage({ prompt, model })
  }

  return (
    <div className="flex flex-col items-center justify-between h-full p-5">
      {/* images grid */}
      <div className="grow">
        {/* @TODO in progress */}
        {isPending ? <Spinner className="size-10" /> : null}
        {data?.imageUrl ? <img src={data.imageUrl} alt="generated image" /> : null}
      </div>
      {/* input area */}
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        {/* BODY  */}
        <PromptInputBody>
          <PromptInputTextarea onChange={(e) => setPrompt(e.target.value)} value={prompt} />
        </PromptInputBody>
        {/* FOOTER */}
        <PromptInputFooter>
          {/* All tools go here */}
          <PromptInputTools>
            <AppModelSelector modelType="image" output="image" />
          </PromptInputTools>
          {/* submit button */}
          <PromptInputSubmit
            disabled={isPending || !model || !prompt.trim()}
            status={isPending ? 'submitted' : 'ready'}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

export default ImagePage
