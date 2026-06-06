import { DEFAULT_IMAGE_SIZE_OPTION, IMAGE_GEN_OPTIONS } from '@common/constants/image-gen.constants'
import { ModelSchemaType } from '@common/schemas/model.schema'
import ResizableSidePanel from '@renderer/components/resizable-side-panel'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { useImagOptions } from '@renderer/state-management/image-options.store'
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
  const { setSize, setQuality, size, quality } = useImagOptions()
  console.log(size, quality)
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
    }
    lastProviderRef.current = provider
  }, [provider, setSize, setQuality])

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
          {!provider ? (
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
            </>
          )}
          <p className="text-xs text-muted-foreground">
            ❗Note : if some options doesn&apos;t seem to work then set it back to auto or try
            another model
          </p>
        </div>
      </div>
    </ResizableSidePanel>
  )
}

export default ImageOptionsPanel
