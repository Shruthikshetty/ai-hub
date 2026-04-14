/**
 * utils used in conversation component
 */
import { AppUIMessage } from '@common/schemas/messages.schema'
import { ConversationMessage } from '@renderer/components/ai-elements/conversation'

export const defaultFormatMessage = (message: ConversationMessage): string => {
  const roleLabel = message.role.charAt(0).toUpperCase() + message.role.slice(1)
  return `**${roleLabel}:** ${message.content}`
}

export const messagesToMarkdown = (
  messages: ConversationMessage[],
  formatMessage: (message: ConversationMessage, index: number) => string = defaultFormatMessage
): string => messages.map((msg, i) => formatMessage(msg, i)).join('\n\n')

// helper to get text from message parts for copying
export const getMessageText = (message: AppUIMessage): string => {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('\n')
}
