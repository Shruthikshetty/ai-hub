import { ResizablePanel } from '@renderer/components/ui/resizable'

/**
 * This component contain the history of all the conversations
 */
const ChatConversationsHistory = ({ isOpen }: { isOpen: boolean }) => {
  if (!isOpen) return
  return (
    <ResizablePanel
      className="bg-sidebar border-r border-white/10"
      defaultSize={150}
      minSize={0}
      maxSize={300}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-4 text-[10px] font-bold text-gray-500">
          HISTORY
        </div>
        {/* Chat History List */}
      </div>
    </ResizablePanel>
  )
}

export default ChatConversationsHistory
