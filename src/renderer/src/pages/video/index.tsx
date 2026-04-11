import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import AppModelSelector from '@renderer/components/model-selector'
import { useState } from 'react'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import { useFetchMedia } from '@renderer/services/media'
import { useGenerateVideo } from '@renderer/services/video-gen'

/**
 * This is the main tab of video generation
 * contains the list of generated videos and input area to generate new videos
 */
const VideoPage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // get selected model from global store
  const getModel = useSelectedModel((state) => state.getModel)
  const model = getModel('video')

  // fetch all the list of generated media
  const { data: mediaList, refetch } = useFetchMedia({ type: 'video' })

  // hook to generate video
  const { mutate: generateVideo, isPending } = useGenerateVideo()

  // handler to handle submit
  const handleSubmit = () => {
    if (!model) return
    generateVideo(
      { prompt, model },
      {
        onSuccess: () => {
          refetch()
          setPrompt('')
        }
      }
    )
  }

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 overflow-hidden w-full mx-auto">
      {isPending && (
        <div className="flex items-center justify-center h-full">
          <p>Generating video...</p>
        </div>
      )}
      {/* video grid */}
      <div className="grow overflow-auto min-h-0 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {/* Video player will go here */}
          {mediaList?.data?.map(
            (video) => video?.mediaUrl && <video key={video?.id} src={video?.mediaUrl} controls />
          )}
        </div>
      </div>
      {/* input area */}
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        {/* BODY  */}
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Explain your video in detail"
          />
        </PromptInputBody>
        {/* FOOTER */}
        <PromptInputFooter>
          {/* All tools go here */}
          <PromptInputTools>
            <AppModelSelector modelType="video" output="video" />
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

export default VideoPage
