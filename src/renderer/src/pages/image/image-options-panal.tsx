import ResizableSidePanel from '@renderer/components/resizable-side-panel'

/**
 * This panel contains additional options that can be used with image generation
 */
const ImageOptionsPanel = ({
  ...rest
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {
  return (
    <ResizableSidePanel {...rest}>
      <p>options tab</p>
    </ResizableSidePanel>
  )
}
export default ImageOptionsPanel
