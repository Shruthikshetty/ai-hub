import { AppUIMessage } from '@common/schemas/messages.schema'
import { MessageResponse } from './ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from './ai-elements/reasoning'
import BotIcon from './bot-icon'
import { ChatStatus } from 'ai'
import { Badge } from './ui/badge'
import { formatDateTime } from '@renderer/lib/date.utils'

/**
 *
 * @returns This contains the logic for all the message parts to be rendered input
 */
function MessageParts({
  message,
  isLastMessage,
  status
}: {
  message: AppUIMessage
  isLastMessage: boolean
  status: ChatStatus
}) {
  // consolidate all the reasoning
  const reasoning = message.parts.filter((part) => part.type === 'reasoning')
  // get the reasoning text
  const reasoningText = reasoning.map((part) => part.text).join('\n\n')
  const hasReasoning = reasoningText.trim()?.length > 0
  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1)
  const isReasoningStreaming =
    isLastMessage && status === 'streaming' && lastPart?.type === 'reasoning'

  return (
    <>
      {/* role based icon */}
      {message.role === 'assistant' ? (
        <BotIcon
          size={20}
          className="h-8 w-8"
          loading={isLastMessage && (status === 'streaming' || status === 'submitted')}
        />
      ) : null}

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
                isAnimating={isLastMessage && status === 'streaming'}
              >
                {part.text}
              </MessageResponse>
            )
          default:
            return null
        }
      })}
      {/* meta data info */}
      {message.metadata?.tokensPerMessage ? (
        <div className="flex flex-row justify-start items-center gap-2 mt-1">
          <Badge variant="outline" className="hover:bg-secondary transition-colors duration-200">
            Tokens used: {message.metadata.tokensPerMessage}
          </Badge>
          <Badge variant="outline" className="hover:bg-secondary transition-colors duration-200">
            Time:{' '}
            {message?.metadata?.timeStamp ? formatDateTime(message?.metadata?.timeStamp) : 'N/A'}
          </Badge>
        </div>
      ) : null}
    </>
  )
}

export default MessageParts
