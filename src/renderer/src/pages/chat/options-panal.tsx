import ResizableSidePanel from '@renderer/components/resizable-side-panel'

/**
 * This panel contains additional options that can be passed to the model
 */
function ChatOptionsPanel(props: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  return (
    <ResizableSidePanel {...props}>
      <h1>Chat Options Panel</h1>
    </ResizableSidePanel>
  )
}

export default ChatOptionsPanel
