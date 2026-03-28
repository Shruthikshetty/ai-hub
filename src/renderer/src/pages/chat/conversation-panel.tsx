import { useEffect } from 'react'
import { Separator } from '@renderer/components/ui/separator'
import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import {
  useAddConversation,
  useDeleteAllConversations,
  useDeleteConversationById,
  useFetchConversations
} from '@renderer/services/conversation'
import { formatRelativeDateLabel } from '@renderer/lib/date.utils'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import useSelectedConversation from '@renderer/state-management/selected-conversation.store'
import { Virtuoso } from 'react-virtuoso'
import { cn } from '@renderer/lib/utils'
import ResizableSidePanel from '@renderer/components/resizable-side-panel'
import ConversationOptions from './conversation-options'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { useScreenLoader } from '@renderer/state-management/screen-loader.store'
import { errorToast } from '@renderer/lib/toast-wrapper'

/**
 * This component contain the history of all the conversations
 */
const ChatConversationsHistory = (props: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {
  // fetch all the conversations
  const { data: conversations, isPending, isSuccess } = useFetchConversations()
  // hook to create a new conversations
  const { mutate: newConversation } = useAddConversation()
  // hook to delete a conversation
  const { mutate: deleteConversation } = useDeleteConversationById()
  // hook to delete all conversations
  const { mutate: deleteAllConversations } = useDeleteAllConversations()
  // global loading state
  const setLoader = useScreenLoader((state) => state.setLoader)
  // get selected model
  const { getModel } = useSelectedModel()
  const selectedModel = getModel('chat')
  // get selected conversation
  const { conversation: selectedConversation, setConversation: setSelectedConversation } =
    useSelectedConversation()

  //in case there are no conversations then create a new one
  useEffect(() => {
    if (!conversations?.data?.length && isSuccess && selectedModel?.id) {
      handleNewChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, selectedModel?.id])

  // by default select the first conversation
  useEffect(() => {
    if (!selectedConversation && conversations?.data?.length) {
      setSelectedConversation(conversations?.data[0])
    }
  }, [conversations?.data, selectedConversation, setSelectedConversation])

  // handle new conversation
  const handleNewChat = () => {
    // in case model is not selected
    if (!selectedModel?.id || !selectedModel?.provider) {
      errorToast('Please select a model')
      return
    }
    // create new conversation
    newConversation(
      {
        title: 'New chat',
        modelId: selectedModel?.id,
        provider: selectedModel?.provider
      },
      {
        onSuccess: () => {
          // set the selected conversation to null so that it displays the new chat
          setSelectedConversation(null)
        }
      }
    )
  }

  // handle conversation delete
  const handleDelete = (id?: number) => {
    if (!id) return
    deleteConversation(
      { id },
      {
        onSuccess: () => {
          // if all conversations are append a new chat
          if (conversations?.data?.length === 1) {
            handleNewChat()
          } else if (selectedConversation?.id === id) {
            // if the deleted conversation was selected then set it to null
            setSelectedConversation(null)
          }
        }
      }
    )
  }
  // handle delete all conversations
  const handleDeleteAll = () => {
    // ser loading true
    setLoader(true)
    deleteAllConversations(undefined, {
      onSuccess: () => {
        // create a new chat
        handleNewChat()
      },
      onSettled: () => {
        // ser loading false
        setLoader(false)
      }
    })
  }

  return (
    <ResizableSidePanel {...props}>
      {/* Header */}
      <div className="overflow-hidden">
        <h1 className="text-foreground/80 font-semibold p-4">HISTORY</h1>
        <Separator />
      </div>
      {/* Message list */}
      <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
        {/* New chat button */}
        <div className="p-3">
          <Button
            className="w-full bg-foreground/20 text-foreground transition-all active:scale-95 overflow-hidden"
            type="button"
            aria-label="New chat"
            onClick={handleNewChat}
          >
            <Plus />
            New chat
          </Button>
        </div>
        <Separator />
        {/* All the conversations go here */}
        <Virtuoso
          className="flex-1"
          data={conversations?.data}
          itemContent={(_index, conversation) => (
            <div
              key={conversation.id}
              className={cn(
                'relative group w-full',
                selectedConversation?.id === conversation.id && 'bg-accent-foreground/10'
              )}
            >
              <button
                className="w-full items-start flex flex-col hover:bg-accent-foreground/10 transition-all pr-8"
                aria-label={`select chat ${conversation.title}`}
                onClick={() => {
                  //@TODO the time to be updated as well so that it appears on top ??
                  setSelectedConversation(conversation)
                }}
              >
                <div className="px-3 pb-1 flex flex-col gap-0.5">
                  <p className="text-foreground text-sm font-medium line-clamp-2 overflow-hidden text-start">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-muted-foreground text-start">
                    {conversation?.createdAt
                      ? formatRelativeDateLabel(conversation?.createdAt)
                      : 'Unknown'}
                  </p>
                </div>
              </button>
              {/* conversation options */}
              <ConversationOptions
                conversation={conversation}
                onDelete={handleDelete.bind(null, conversation.id)}
              />
            </div>
          )}
        />
      </div>
      {/* Footer */}
      <div className="overflow-hidden">
        <Separator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={'ghost'}
              className="text-muted-foreground hover:bg-transparent! text-xs p-4 text-center w-full"
            >
              Clear all history
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your conversations.
                and stored attachments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  className="bg-destructive! text-foreground hover:bg-destructive/70!"
                >
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ResizableSidePanel>
  )
}

export default ChatConversationsHistory
