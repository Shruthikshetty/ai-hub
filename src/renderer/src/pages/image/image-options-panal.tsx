import {
  DEFAULT_IMAGE_ASPECT_RATIO,
  DEFAULT_IMAGE_SIZE_OPTION,
  IMAGE_GEN_OPTIONS,
  IMAGE_GEN_SEED_LIMITS
} from '@common/constants/image-gen.constants'
import { ModelSchemaType } from '@common/schemas/model.schema'
import ResizableSidePanel from '@renderer/components/resizable-side-panel'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { handlePositiveIntNoDecimal } from '@renderer/lib/form.utils'
import { getRandomSeed } from '@renderer/lib/generation.utild'
import { useImagOptions } from '@renderer/state-management/image-options.store'
import { CircleAlert, Shuffle } from 'lucide-react'
import { useEffect, useRef } from 'react'

/**
 * This panel contains additional options that can be used with image generation
 */
const ImageOptionsPanel = ({
  model,
  ...rest
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  model: ModelSchemaType | null
}) => {
  // get the state from the store for image options
  const { setSize, setQuality, size, quality, setSeed, seed, setAspectRatio, aspectRatio } =
    useImagOptions()
  // Get active options based on the selected model's provider
  const provider = model?.provider
  const options = provider ? IMAGE_GEN_OPTIONS?.[provider] : undefined

  // keep track of the provider during the current component mount cycle
  const lastProviderRef = useRef<string | undefined>(provider)

  // reset options only when the model provider actually changes
  useEffect(() => {
    if (provider && provider !== lastProviderRef.current) {
      setSize(undefined)
      setQuality(undefined)
      setSeed(undefined)
      setAspectRatio(undefined)
    }
    lastProviderRef.current = provider
  }, [provider, setSize, setQuality, setSeed, setAspectRatio])

  return (
    <ResizableSidePanel {...rest}>
      <div className="h-full w-full flex flex-col justify-between overflow-hidden">
        {/* heading */}
        <div>
          <h1 className="text-foreground/80 font-semibold p-4">IMAGE OPTIONS</h1>
          <Separator />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!provider || !options ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Model is not selected or the selected model doesn&apos;t have any options.
            </p>
          ) : (
            <>
              {/* Size Select */}
              {options?.size && options.size.length > 0 && (
                <div className="space-y-2">
                  <Label
                    htmlFor="size-select"
                    className="text-muted-foreground text-sm font-semibold"
                  >
                    Image Size
                  </Label>
                  <Select
                    value={size || DEFAULT_IMAGE_SIZE_OPTION}
                    onValueChange={(value) =>
                      setSize(value === DEFAULT_IMAGE_SIZE_OPTION ? undefined : value)
                    }
                  >
                    <SelectTrigger id="size-select" className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.size.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* aspect ratio */}
              {options?.aspectRatio && options.aspectRatio.length > 0 && (
                <div className="space-y-2">
                  <Label
                    htmlFor="aspect-ratio-select"
                    className="text-muted-foreground text-sm font-semibold"
                  >
                    Aspect Ratio
                  </Label>
                  <Select
                    value={aspectRatio || DEFAULT_IMAGE_ASPECT_RATIO}
                    onValueChange={(value) =>
                      setAspectRatio(value === DEFAULT_IMAGE_ASPECT_RATIO ? undefined : value)
                    }
                  >
                    <SelectTrigger id="aspect-ratio-select" className="w-full">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.aspectRatio.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/*  show error if both size and aspect ratio are set */}
              {size && aspectRatio ? (
                <p className="text-sm font-normal text-destructive ">
                  size and aspect ratio cannot be selected together. Note if both options are
                  visible then please select either size or aspect ratio which ever works as per the
                  provider .
                </p>
              ) : null}

              {/* Quality Select */}
              {options?.quality && options.quality.length > 0 && (
                <div className="space-y-2">
                  <Label
                    htmlFor="quality-select"
                    className="text-muted-foreground text-sm font-semibold"
                  >
                    Image Quality
                  </Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger id="quality-select" className="w-full">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.quality.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Seed */}
              {options?.seed && (
                <div className="space-y-2">
                  <div className="flex flex-row gap-2 items-center justify-between pr-3">
                    <Label
                      htmlFor="seed-input"
                      className="text-muted-foreground text-sm font-semibold"
                    >
                      Seed
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            setSeed(getRandomSeed(6))
                          }}
                          className="px-2"
                        >
                          <Shuffle className="text-muted-foreground size-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate random seed</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="seed-input"
                    type="number"
                    min={IMAGE_GEN_SEED_LIMITS.min}
                    max={IMAGE_GEN_SEED_LIMITS.max}
                    value={seed ?? ''}
                    onChange={(e) => handlePositiveIntNoDecimal(e, setSeed)}
                    placeholder="Random seed"
                  />
                </div>
              )}

              {/* Note */}
              <p className="text-xs text-muted-foreground">
                ❗Note : if some options doesn&apos;t seem to work then set it back to auto or try
                another model
              </p>
            </>
          )}
        </div>
      </div>
    </ResizableSidePanel>
  )
}

export default ImageOptionsPanel
