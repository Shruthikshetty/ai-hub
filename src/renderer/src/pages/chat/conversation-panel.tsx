import { ResizablePanel } from '@renderer/components/ui/resizable'
import { PanelImperativeHandle } from 'react-resizable-panels'
import { useRef, useEffect } from 'react'
import { Separator } from '@renderer/components/ui/separator'
import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import { useFetchConversations } from '@renderer/services/conversation'
import { formatRelativeDateLabel } from '@renderer/lib/date.utils'

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
  // fetch all the conversations
  const { data: conversations } = useFetchConversations()

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
      className={`bg-sidebar border-white/10 transition-all`}
      defaultSize={'20%'}
      minSize={0}
      maxSize={'33%'}
    >
      <div
        className={`flex flex-col h-full transition-opacity duration-200 justify-between ${!isOpen ? 'opacity-0 overflow-hidden' : 'opacity-100'}`}
      >
        {/* Header */}
        <div className="overflow-hidden">
          <h1 className="text-foreground/80 font-semibold p-4">HISTORY</h1>
          <Separator />
        </div>
        {/* Message list */}
        <div className="flex-1 overflow-auto ">
          {/* New chat button */}
          <div className="p-3">
            <Button className="w-full bg-foreground/20 text-foreground transition-all active:scale-95 overflow-hidden">
              <Plus />
              New chat
            </Button>
          </div>
          <Separator />
          {/* All the conversations go here */}
          <div className="flex flex-col overflow-auto">
            {conversations?.data?.map((conversation) => (
              <button
                className="w-full items-start flex flex-col hover:bg-accent-foreground/10 transition-all"
                key={conversation.id}
              >
                <div className="px-3 pb-1  flex flex-col gap-0.5">
                  <p className="text-foreground text-sm font-medium line-clamp-2 overflow-hidden text-start">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-muted-foreground text-start">
                    {conversation?.createdAt
                      ? formatRelativeDateLabel(conversation?.createdAt?.toISOString())
                      : 'Unknown'}
                  </p>
                </div>
                <Separator />
              </button>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="overflow-hidden">
          <Separator />
          <Button
            variant={'ghost'}
            className="text-muted-foreground hover:bg-transparent! text-xs p-4 text-center w-full"
          >
            Clear all history
          </Button>
        </div>
      </div>
    </ResizablePanel>
  )
}

export default ChatConversationsHistory
