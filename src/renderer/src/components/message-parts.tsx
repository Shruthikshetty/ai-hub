import { AppUIMessage } from '@common/schemas/messages'
import { MessageResponse } from './ai-elements/message'
import { Bot } from 'lucide-react'
import { Reasoning, ReasoningContent, ReasoningTrigger } from './ai-elements/reasoning'

/**
 *
 * @returns This contains the logic for all the message parts to be rendered input
 */
function MessageParts({
  message,
  isLastMessage,
  isStreaming
}: {
  message: AppUIMessage
  isLastMessage: boolean
  isStreaming: boolean
}) {
  // consolidate all the reasoning
  const reasoning = message.parts.filter((part) => part.type === 'reasoning')
  // get the reasoning text
  const reasoningText = reasoning.map((part) => part.text).join('\n\n')
  const hasReasoning = reasoningText.trim()?.length > 0
  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1)
  const isReasoningStreaming = isLastMessage && isStreaming && lastPart?.type === 'reasoning'

  return (
    <>
      {/* role based icon */}
      {message.role === 'assistant' ? <Bot className="text-foreground" /> : null}

      {/* reasoning */}
      {hasReasoning ? (
        <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      ) : null}

      {/* message parts */}
      {message.parts.map((part, index) => {
        switch (part.type) {
          case 'text':
            return (
              <MessageResponse
                key={`${message.id}-${index}`}
                controls={true}
                isAnimating={isStreaming}
              >
                {part.text}
              </MessageResponse>
            )
          default:
            return null
        }
      })}
    </>
  )
}

export default MessageParts
