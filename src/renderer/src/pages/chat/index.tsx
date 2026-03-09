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

// stable transport instance
const chatTransport = createIPCStreamTransport('/api/chat')

// this is the chat page contains all the chat interface
const ChatPage = () => {
  const [text, setText] = useState('')
  const selectedModel = useSelectedModel((state) => state.model)
  const { messages, sendMessage, error, status } = useChat<AppUIMessage>({
    transport: chatTransport
  })

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return
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
    <div className="flex flex-col h-full w-full p-5 md:p-10">
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
            <AppModelSelector />
          </PromptInputTools>
          {/* submit button */}
          <PromptInputSubmit disabled={!text.trim() || status === 'submitted'} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

export default ChatPage
