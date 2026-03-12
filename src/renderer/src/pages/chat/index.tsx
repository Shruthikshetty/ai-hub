import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { createIPCStreamTransport } from '@renderer/lib/custom-transports'
import { Message, MessageContent } from '@renderer/components/ai-elements/message'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@renderer/components/ai-elements/conversation'
import { AppUIMessage } from '@common/schemas/messages.schema'
import MessageParts from '@renderer/components/message-parts'
import ChatStarter from './chat-starter'
import AppModelSelector from '@renderer/components/model-selector'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import ChatConversationsHistory from './conversation-panel'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
import PanelTrigger from '@renderer/components/panel-trigger'
import useSelectedConversation from '@renderer/state-management/selected-conversation.store'
import { useFetchConversationsMessages } from '@renderer/services/conversation'

//@TODO still in progress the conversation meta data also to be updated will be done later like restore selected model etc
// stable transport instance
const chatTransport = createIPCStreamTransport('/api/chat')

// this is the chat page contains all the chat interface
const ChatPage = () => {
  const [text, setText] = useState('')
  const selectedModel = useSelectedModel((state) => state.model)
  // this is the conversation panel state shows all chat history
  const [conversationPanelOpen, setConversationPanelOpen] = useState(true)
  // get the selected conversation
  const selectedConversation = useSelectedConversation((state) => state.conversation)
  // hook to get the messages of the selected conversation
  const { data: defaultMessages } = useFetchConversationsMessages(selectedConversation?.id)
  // hook to manage chat
  const chatId = selectedConversation?.id?.toString()
  const { messages, sendMessage, error, status, setMessages } = useChat<AppUIMessage>({
    id: chatId,
    transport: chatTransport
  })

  // Keep track of the last loaded conversation ID to prevent React Query background refetch from overwriting active UI messages
  const loadedChatId = useRef<string | null>(null)

  useEffect(() => {
    if (chatId && loadedChatId.current !== chatId && defaultMessages?.data?.messages) {
      setMessages(defaultMessages.data.messages)
      loadedChatId.current = chatId
    }
  }, [chatId, defaultMessages?.data?.messages, setMessages])

  // function to handle submit of the prompt input
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() || !selectedModel?.id) return
    sendMessage(
      {
        text: message.text
      },
      {
        body: {
          model: selectedModel,
          conversationId: selectedConversation?.id
        }
      }
    )
    // clear our input
    setText('')
  }

  return (
    <ResizablePanelGroup className="flex flex-row h-full w-full" orientation="horizontal">
      {/* left side conversations tray */}
      <ChatConversationsHistory
        isOpen={conversationPanelOpen}
        setIsOpen={setConversationPanelOpen}
      />
      <ResizableHandle withHandle />
      {/*  main chat interface */}
      <ResizablePanel className="flex flex-col h-full w-full">
        <PanelTrigger value={conversationPanelOpen} toggle={setConversationPanelOpen} />
        <div className="flex flex-col p-5 md:p-10 flex-1 overflow-hidden">
          {/* starter prompts */}
          {messages.length === 0 ? (
            <ChatStarter
              onSelect={(prompt) => {
                setText(prompt)
              }}
            />
          ) : null}
          {/* All the conversations go here */}
          <Conversation>
            <ConversationContent>
              {messages.map((message, index) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageParts
                      message={message}
                      status={status}
                      isLastMessage={index === messages.length - 1}
                    />
                  </MessageContent>
                  <ConversationScrollButton />
                </Message>
              ))}
            </ConversationContent>
          </Conversation>
          {error && error.message && <p className="text-red-500 text-center">{error.message}</p>}
          {/* Prompt inputs go here */}
          <PromptInput onSubmit={handleSubmit} className="mt-4">
            {/* BODY  */}
            <PromptInputBody>
              <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
            </PromptInputBody>
            {/* FOOTER */}
            <PromptInputFooter>
              {/* All tools go here */}
              <PromptInputTools>
                <AppModelSelector output="text" />
              </PromptInputTools>
              {/* submit button */}
              <PromptInputSubmit
                disabled={!text.trim() || status === 'submitted' || !selectedModel?.id}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ChatPage
