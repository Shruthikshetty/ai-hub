import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import AppModelSelector from '@renderer/components/model-selector'
import { useGenerateImage } from '@renderer/services/image-gen'
import { useState } from 'react'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import GeneratedImageDisplay from '@renderer/components/generated-image-display'
import { useFetchMedia } from '@renderer/services/media'

const ImagePage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // get selected model from global store
  const getModel = useSelectedModel((state) => state.getModel)
  const model = getModel('image')
  // fetch all the list of generated media
  const { data: mediaList, refetch } = useFetchMedia({ type: 'image' })

  // hook to generate image
  const { mutate: generateImage, isPending } = useGenerateImage()

  // handler to handle submit
  const handleSubmit = () => {
    if (!model) return
    generateImage(
      { prompt, model },
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
      {/* images grid */}
      <div className="grow overflow-auto min-h-0 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {isPending && <GeneratedImageDisplay image={undefined} loading={true} />}
          {mediaList?.data?.map((image) => (
            <GeneratedImageDisplay key={image?.id} image={image} loading={false} />
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
            placeholder="Explain your image in detail"
          />
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
