import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import AppModelSelector from '@renderer/components/model-selector'
import { useRef, useState } from 'react'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import { useFetchInfiniteMedia } from '@renderer/services/media'
import { useGenerateVideo } from '@renderer/services/video-gen'
import GeneratedVideoDisplay from '@renderer/components/generated-video-display'
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso'
import { LOADING_VIDEO_MEDIA_ITEM } from '@renderer/constants/screen.constants'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { MEDIA_FETCH_PAGE_LIMIT_BY_TYPE } from '@renderer/constants/config.constants'

/**
 * This is the main tab of video generation
 * contains the list of generated videos and input area to generate new videos
 */
const VideoPage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // get selected model from global store
  const model = useSelectedModel((state) => state.models['video'] ?? null)

  // query client
  const queryClient = useQueryClient()
  // hold our virtual list ref
  const virtuosoRef = useRef<VirtuosoGridHandle>(null)

  // fetch all the list of generated media
  const {
    data: mediaList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchInfiniteMedia({ type: 'video', limit: MEDIA_FETCH_PAGE_LIMIT_BY_TYPE.video })
  // flatten the array
  const mediaItems = mediaList?.pages.flatMap((page) => page.data.media) ?? []

  // hook to generate video
  const { mutate: generateVideo, isPending } = useGenerateVideo()

  // handler to handle submit
  const handleSubmit = () => {
    // make sanity check
    const trimmedPrompt = prompt.trim()
    if (!model || !trimmedPrompt) return
    // scroll to top
    virtuosoRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    // call the generate video api
    generateVideo(
      { prompt, model },
      {
        onSuccess: () => {
          // reset the query
          queryClient.resetQueries({ queryKey: [QUERY_KEYS.mediaFetchInfinite, 'video'] })
          setPrompt('')
        }
      }
    )
  }

  // fetch more videos if they exist
  const fetchMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 overflow-hidden w-full mx-auto">
      {/* video grid */}
      <div className="grow overflow-auto min-h-0 w-full">
        <VirtuosoGrid
          ref={virtuosoRef}
          className="h-full w-full"
          overscan={1200}
          listClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
          endReached={fetchMore}
          data={isPending ? [LOADING_VIDEO_MEDIA_ITEM, ...mediaItems] : mediaItems}
          itemContent={(_index, video) => {
            const isLoading = video.id === -1
            return (
              <GeneratedVideoDisplay
                video={isLoading ? undefined : video}
                loading={isLoading}
                key={video.id}
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
