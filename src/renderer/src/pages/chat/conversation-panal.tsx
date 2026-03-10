import { ResizablePanel } from '@renderer/components/ui/resizable'
import { PanelImperativeHandle } from 'react-resizable-panels'
import { useRef, useEffect } from 'react'

/**
 * This component contain the history of all the conversations
 */
const ChatConversationsHistory = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {
  // store the panel ref
  const panelRef = useRef<PanelImperativeHandle>(null)

  // handel the toggle state
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.expand()
    } else {
      panelRef.current?.collapse()
    }
  }, [isOpen])

  return (
    <ResizablePanel
      panelRef={panelRef}
      collapsible={true}
      collapsedSize={0}
      onResize={() => {
        if (panelRef.current?.isCollapsed()) {
          setIsOpen(false)
        } else {
          setIsOpen(true)
        }
      }}
      className={`bg-sidebar border-white/10 transition-all ${isOpen ? 'border-r' : ''}`}
      defaultSize={150}
      minSize={0}
      maxSize={300}
    >
      <div
        className={`flex flex-col h-full p-4 transition-opacity duration-200 ${!isOpen ? 'opacity-0 overflow-hidden' : 'opacity-100'}`}
      >
        <div className="flex justify-between items-center mb-4 text-[10px] font-bold text-gray-500">
          HISTORY
        </div>
        {/* Chat History List */}
      </div>
    </ResizablePanel>
  )
}

export default ChatConversationsHistory
