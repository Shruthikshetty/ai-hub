import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { createIPCStreamTransport } from '@renderer/lib/custom-transports'
import { Message, MessageContent, MessageResponse } from '@renderer/components/ai-elements/message'

// to be removed
const models = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o'
  },
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1'
  }
]

// this is the chat page contains all the chat interface
const ChatPage = () => {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gpt-4o-mini')

  const { messages, sendMessage, error, status } = useChat({
    transport: createIPCStreamTransport('/api/chat')
  })

  console.log(messages)

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return
    sendMessage({
      text: message.text
    })
    // clear our input
    setText('')
  }

  return (
    <div className="flex flex-col h-full w-full ">
      {messages.map((message) => (
        <Message key={message.id} from={message.role}>
          <MessageContent>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case 'text':
                  return (
                    <MessageResponse
                      key={`${message.id}-${index}`}
                      controls={true}
                      isAnimating={status === 'streaming'}
                    >
                      {part.text}
                    </MessageResponse>
                  )
                default:
                  return null
              }
            })}
          </MessageContent>
        </Message>
      ))}
      {error && error.message && <p className="text-red-500">{error.message}</p>}
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        {/* BODY  */}
        <PromptInputBody>
          <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
        </PromptInputBody>
        {/* FOOTER */}
        <PromptInputFooter>
          {/* All tools go here */}
          <PromptInputTools>
            {/*@TODO dummy selector for model later to be changed */}
            <PromptInputSelect
              onValueChange={(value) => {
                setModel(value)
              }}
              value={model}
            >
              <PromptInputSelectTrigger>
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {models.map((model) => (
                  <PromptInputSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          {/* submit button */}
          <PromptInputSubmit disabled={!text} status={'ready'} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

export default ChatPage
