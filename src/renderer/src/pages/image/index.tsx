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
import { Ref, useRef, useState } from 'react'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import GeneratedImageDisplay from '@renderer/components/generated-image-display'
import { useFetchInfiniteMedia } from '@renderer/services/media'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
import ImageOptionsPanel from './image-options-panal'
import PanelTrigger from '@renderer/components/panel-trigger'
import ImageGenStarter from './image-gen-starter'
import { useImagOptions } from '@renderer/state-management/image-options.store'
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso'
import { LOADING_IMAGE_MEDIA_ITEM } from '@renderer/constants/screen.constants'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'

const ImagePage = () => {
  // state to store prompt
  const [prompt, setPrompt] = useState('')
  // this is the options panel state to show the options panel
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  // get quality , size , aspect ratio , seed from the store
  const size = useImagOptions((s) => s.size)
  const quality = useImagOptions((s) => s.quality)
  const seed = useImagOptions((s) => s.seed)
  const aspectRatio = useImagOptions((s) => s.aspectRatio)

  // query client
  const queryClient = useQueryClient()
  // hold out virtual list ref
  const virtuosoRef = useRef<VirtuosoGridHandle>(null)
  // get selected model from global store
  const model = useSelectedModel((state) => state.models['image'] ?? null)
  // fetch all the list of generated media
  const {
    data: mediaList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchInfiniteMedia({ type: 'image' })
  // flatten the array
  const mediaItems = mediaList?.pages.flatMap((page) => page.data.media) ?? []
  // hook to generate image
  const { mutate: generateImage, isPending } = useGenerateImage()

  // handler to handle submit
  const handleSubmit = () => {
    if (!model) return
    // scroll to top
    virtuosoRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    generateImage(
      {
        prompt,
        model,
        size: size as `${number}x${number}` | undefined,
        quality,
        seed,
        aspectRatio: aspectRatio as `${number}:${number}` | undefined
      },
      {
        onSuccess: () => {
          // reset the query
          queryClient.resetQueries({ queryKey: [QUERY_KEYS.mediaFetchInfinite, 'image'] })
          setPrompt('')
        }
      }
    )
  }

  // fetch more images if they exist
  const fetchMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <ResizablePanelGroup className="h-full w-full" orientation="horizontal">
      {/*  main image gen interface  */}
      <ResizablePanel className="flex flex-col grow">
        <div className="relative flex flex-row items-center justify-between pt-2 w-full px-4">
          {/* left side placeholder */}
          <div />
          <h2 className="absolute left-1/2 -translate-x-1/2 text-md md:text-lg font-medium">
            Image Generation
          </h2>
          {/* right side options panel trigger */}
          <PanelTrigger
            value={optionsPanelOpen}
            toggle={setOptionsPanelOpen}
            invert
            title="OPTIONS"
          />
        </div>
        <div className="flex flex-col items-center justify-between h-full p-4 overflow-hidden w-full mx-auto">
          {/* in case of no images  */}
          {!isPending && mediaItems?.length === 0 ? (
            <ImageGenStarter onSelect={(p) => setPrompt(p)} />
          ) : (
            /* images grid */
            <div className="grow overflow-auto min-h-0 w-full">
              <VirtuosoGrid
                ref={virtuosoRef}
                className="h-full w-full"
                overscan={1200}
                listClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
                endReached={fetchMore}
                data={isPending ? [LOADING_IMAGE_MEDIA_ITEM, ...mediaItems] : mediaItems}
                itemContent={(_index, image) => {
                  const isLoading = image.id === -1
                  return (
                    <GeneratedImageDisplay
                      image={isLoading ? undefined : image}
                      loading={isLoading}
                      key={image.id}
                    />
                  )
                }}
              />
            </div>
          )}
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
      </ResizablePanel>
      {/* right side options panel */}
      <ResizableHandle withHandle />
      <ImageOptionsPanel model={model} isOpen={optionsPanelOpen} setIsOpen={setOptionsPanelOpen} />
    </ResizablePanelGroup>
  )
}

export default ImagePage
