import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { createIPCStreamTransport } from '@renderer/lib/custom-transports'
import { Message, MessageContent } from '@renderer/components/ai-elements/message'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@renderer/components/ai-elements/conversation'
import { AppUIMessage } from '@common/schemas/messages'
import MessageParts from '@renderer/components/message-parts'
import ChatStarter from './chat-starter'
import AppModelSelector from '@renderer/components/model-selector'
import useSelectedModel from '@renderer/state-management/use-selected-model'
import ChatConversationsHistory from './conversation-panel'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
import PanelTrigger from '@renderer/components/panel-tigger'

// stable transport instance
const chatTransport = createIPCStreamTransport('/api/chat')

// this is the chat page contains all the chat interface
const ChatPage = () => {
  const [text, setText] = useState('')
  const selectedModel = useSelectedModel((state) => state.model)
  const { messages, sendMessage, error, status } = useChat<AppUIMessage>({
    transport: chatTransport
  })
  // this is the conversation panel state shows all chat history
  const [conversationPanelOpen, setConversationPanelOpen] = useState(true)

  // function to handle submit of the prompt input
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() || !selectedModel?.id) return
    sendMessage(
      {
        text: message.text
      },
      {
        body: {
          model: selectedModel
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
