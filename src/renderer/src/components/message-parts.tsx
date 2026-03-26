/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppUIMessage, ProfileToolOutputSchemaType } from '@common/schemas/messages.schema'
import { MessageResponse } from './ai-elements/message'
import { Reasoning, ReasoningContent, ReasoningTrigger } from './ai-elements/reasoning'
import BotIcon from './bot-icon'
import { ChatStatus } from 'ai'
import { Badge } from './ui/badge'
import { formatDateTime } from '@renderer/lib/date.utils'
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentData
} from './ai-elements/attachments'
import { Task, TaskContent, TaskItem, TaskTrigger } from './ai-elements/task'
import { Shimmer } from './ai-elements/shimmer'
import { ProfileCard } from './profile-card'

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

  // check if there are any file parts
  const hasFileParts = message.parts.some((part) => part.type === 'file')
  // check if there are any tool parts
  const toolCalls = message.parts.filter((part) => part.type.startsWith('tool-'))
  const hasToolCalls = toolCalls.length > 0
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

      {/* tool calls */}
      {hasToolCalls ? (
        <Task className="w-full" defaultOpen={false}>
          <TaskTrigger title="tools called" />
          <TaskContent>
            {toolCalls.map((part, index) => {
              switch (part.type) {
                case 'tool-search':
                  return (
                    <TaskItem key={`${message.id}-${index}`}>
                      searched the web{' '}
                      {JSON.stringify((part as any)?.output?.action) ??
                        'search completed details unavailable'}
                    </TaskItem>
                  )
                case 'tool-profile':
                  if (part.state === 'output-available') {
                    // in case the part.output is string in case of error
                    if (typeof part.output === 'string') {
                      return (
                        <TaskItem key={`${message.id}-${index}`}>
                          profile data access failed
                        </TaskItem>
                      )
                    }
                    return (
                      <TaskItem
                        key={`${message.id}-${index}`}
                        className="flex flex-col gap-1 text-muted-foreground"
                      >
                        <p>accessed profile data</p>
                        <ProfileCard profile={part.output as ProfileToolOutputSchemaType} />
                      </TaskItem>
                    )
                  } else {
                    return <Shimmer key={`${message.id}-${index}`}>accessing profile ...</Shimmer>
                  }
                case 'tool-img_gen':
                  if (part.state === 'output-available') {
                    // in case the part.output is string in case of error
                    if (typeof part.output === 'string') {
                      return (
                        <TaskItem key={`${message.id}-${index}`}>image generation failed</TaskItem>
                      )
                    }
                    return (
                      <TaskItem
                        key={`${message.id}-${index}`}
                        className="flex flex-col gap-1 text-muted-foreground"
                      >
                        <p>generated image :</p>
                        <p>{JSON.stringify(part?.input)}</p>
                      </TaskItem>
                    )
                  } else {
                    return null
                  }
                default:
                  return null
              }
            })}
          </TaskContent>
        </Task>
      ) : null}

      {/* render file parts */}
      {hasFileParts ? (
        <Attachments variant="grid" className="my-2">
          {message.parts
            .filter((part) => part.type === 'file')
            .map((part, index) => {
              const attachmentData = {
                ...part,
                id: `${message.id}-${index}`
              } as unknown as AttachmentData

              return (
                <Attachment key={`${message.id}-${index}`} data={attachmentData}>
                  <AttachmentPreview />
                </Attachment>
              )
            })}
        </Attachments>
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
          case 'tool-search':
            // some times inc case of some providers the past . state dose not update properly hence adding this case to clear out the searching text
            if (part.providerExecuted) {
              return null
            }
            switch (part.state) {
              case 'input-available':
              case 'input-streaming':
                return <Shimmer key={`${message.id}-${index}`}>searching the web ...</Shimmer>
              default:
                return null
            }
          case 'tool-profile':
            switch (part.state) {
              case 'input-available':
              case 'input-streaming':
                return <Shimmer key={`${message.id}-${index}`}>accessing profile ...</Shimmer>
              default:
                return null
            }
          case 'tool-img_gen':
            switch (part.state) {
              case 'input-available':
              case 'input-streaming':
                return <Shimmer key={`${message.id}-${index}`}>generating image ...</Shimmer>
              case 'output-available':
                // in case the part.output is string in case of error
                if (typeof part.output === 'string') return
                return (
                  <img
                    src={(part?.output as { mediaUrl: string })?.mediaUrl}
                    alt="generated image"
                    className="aspect-square w-32 object-cover rounded-sm"
                  />
                )
              default:
                return null
            }
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
