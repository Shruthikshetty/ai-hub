import ResizableSidePanel from '@renderer/components/resizable-side-panel'
import { Label } from '@renderer/components/ui/label'
import { Select } from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { Switch } from '@renderer/components/ui/switch'
import { Textarea } from '@renderer/components/ui/textarea'

//@TODO this logic to be handled by forms
/**
 * This panel contains additional options that can be passed to the model
 */
function ChatOptionsPanel(props: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  return (
    <ResizableSidePanel {...props}>
      {/* heading */}
      <h1 className="text-foreground/80 font-semibold p-4">OPTIONS</h1>
      <Separator />
      {/* OPTIONS */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-foreground/80 font-semibold text-sm">MODEL OPTIONS</h2>
        <Label className="text-foreground text-sm font-semibold" htmlFor="system-prompt">
          System Prompt
        </Label>
        <Textarea id="system-prompt" placeholder="Enter system instructions for the AI..." />
        <Label className="text-foreground text-sm font-semibold" htmlFor="reasoning">
          Reasoning
        </Label>
        <Select />
      </div>
      <Separator />
      {/* Tools */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-foreground/80 font-semibold text-sm">TOOLS</h2>
        <div className="flex items-center justify-between">
          <Label className="text-foreground text-sm font-semibold" htmlFor="search">
            Search
          </Label>
          <Switch id="search" />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-foreground text-sm font-semibold" htmlFor="image-generation">
            Image generation
          </Label>
          <Switch id="image-generation" />
        </div>
      </div>
      <Separator />
      {/* Metadata */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-foreground/80 font-semibold text-sm">META DATA</h2>
        <div className="flex items-center justify-between">
          <Label className="text-foreground text-sm font-semibold" htmlFor="token-used">
            Token used
          </Label>
          <Switch id="token-used" />
        </div>
      </div>
      <Separator />
    </ResizableSidePanel>
  )
}

export default ChatOptionsPanel
