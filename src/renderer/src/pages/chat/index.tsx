import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import { useState, useEffect, useRef, useMemo } from 'react'
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
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useFetchModels } from '@renderer/services/model'
import ChatOptionsPanel from './options-panal'

//@TODO conversation metadata like system prompt, tools, reasoning etc. still need to be restored on switch
// stable transport instance
const chatTransport = createIPCStreamTransport('/api/chat')

// this is the chat page contains all the chat interface
const ChatPage = () => {
  const [text, setText] = useState('')
  const { getModel, setModel: setSelectedModel } = useSelectedModel()
  const selectedModel = getModel('chat')
  // this is the conversation panel state shows all chat history
  const [conversationPanelOpen, setConversationPanelOpen] = useState(true)
  // this is the options panel state to show the model options
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  // fetch all my models list
  const { data: modelData } = useFetchModels({ output: 'text' })
  // get the selected conversation
  const selectedConversation = useSelectedConversation((state) => state.conversation)
  // get the query client
  const queryClient = useQueryClient()
  // hook to get the messages of the selected conversation
  const { data: defaultMessages, isError: isDefaultMessagesError } = useFetchConversationsMessages(
    selectedConversation?.id
  )
  // hook to manage chat
  const chatId = selectedConversation?.id?.toString()
  // Keep track of the last loaded conversation ID to prevent React Query background refetch from overwriting active UI messages
  const loadedChatId = useRef<string | null>(null)
  // Track the last conversation ID for which the model was restored
  const modelRestoredForChatId = useRef<string | null>(null)
  // hook to manage chat
  const { messages, sendMessage, error, status, setMessages } = useChat<AppUIMessage>({
    id: chatId,
    transport: chatTransport,
    onFinish: () => {
      // invalidate the query on 2'nd user message so that the generated title is reflected in the conversation list
      if (messages.length === 4) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversationsFetch] })
      }
    }
  })

  // Load messages when switching conversations
  useEffect(() => {
    // if there is no chat id then clear the messages
    if (!chatId) {
      setMessages([])
      loadedChatId.current = null
      return
    }
    // if the chat id is different from the loaded chat id then clear the messages
    if (loadedChatId.current !== chatId) {
      setMessages([])
    }
    // if the loaded chat id is same as the chat id then return
    if (loadedChatId.current === chatId) return
    // if the default messages are not available then return
    if (isDefaultMessagesError) return
    // if the default messages are undefined then return
    if (defaultMessages === undefined) return
    // local chat state already won the race, don't let the initial fetch overwrite it
    if (messages.length > 0) {
      loadedChatId.current = chatId
      return
    }
    // set the messages
    if (defaultMessages?.data?.messages) {
      setMessages(defaultMessages.data.messages)
      loadedChatId.current = chatId
    } else {
      setMessages([])
      loadedChatId.current = chatId
    }
  }, [chatId, defaultMessages, isDefaultMessagesError, setMessages, messages.length])

  //Restore the model when switching conversations (independent of message loading)
  useEffect(() => {
    if (!chatId || !modelData?.data?.length) return
    if (modelRestoredForChatId.current === chatId) return

    // get the model set in conversation
    const model = modelData.data.find((m) => m.id === selectedConversation?.modelId)
    // set the selected model (fallback to first available model)
    const modelToSet = model ?? modelData.data[0]
    if (modelToSet) {
      setSelectedModel('chat', modelToSet)
      modelRestoredForChatId.current = chatId
    }
  }, [chatId, modelData, selectedConversation?.modelId, setSelectedModel])

  // function to handle submit of the prompt input
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() || !selectedModel?.id || !selectedConversation?.id) return
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

  // memoize total tokens used only update when messages are added an not streaming
  const totalTokensUsed = useMemo(() => {
    // in case metadata is not available return  don't perform any calculation
    if (!defaultMessages?.data.metadata) return 0
    // calculate total tokens used
    return messages.reduce((acc, message) => {
      return acc + Number(message?.metadata?.tokensPerMessage ?? 0)
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, defaultMessages?.data?.metadata, status])

  return (
    <ResizablePanelGroup className="h-full w-full" orientation="horizontal">
      {/* left side conversations tray */}
      <ChatConversationsHistory
        isOpen={conversationPanelOpen}
        setIsOpen={setConversationPanelOpen}
      />
      <ResizableHandle withHandle />
      {/*  main chat interface */}
      <ResizablePanel className="flex flex-col grow">
        <div className="flex flex-row items-center justify-between pt-2">
          <PanelTrigger
            value={conversationPanelOpen}
            toggle={setConversationPanelOpen}
            title="HISTORY"
          />
          <PanelTrigger
            value={optionsPanelOpen}
            toggle={setOptionsPanelOpen}
            invert
            title="OPTIONS"
          />
        </div>
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
                </Message>
              ))}
              <ConversationScrollButton />
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
                <AppModelSelector output="text" disableDefaultSelection />
              </PromptInputTools>
              {/* submit button */}
              <PromptInputSubmit
                disabled={
                  !text.trim() ||
                  status === 'submitted' ||
                  !selectedModel?.id ||
                  !selectedConversation?.id
                }
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </ResizablePanel>
      {/* right side options panel */}
      <ResizableHandle withHandle />
      <ChatOptionsPanel
        isOpen={optionsPanelOpen}
        setIsOpen={setOptionsPanelOpen}
        conversation={defaultMessages?.data}
        totalTokens={totalTokensUsed}
      />
    </ResizablePanelGroup>
  )
}

export default ChatPage
