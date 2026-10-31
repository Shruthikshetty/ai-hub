import { convertToModelMessages, generateText, ModelMessage } from 'ai'
import { getProviderInstanceModel } from './get-provider-instance'
import db from '../db'
import { connectors, conversations, messages } from '../db/schema'
import { asc, eq } from 'drizzle-orm'
import { generateTitleFromModelMessages } from './generate-title'
import { messages as messageSchema } from '../../common/db-schemas/message.schema'

//@TODO this logic is yet to be implemented
export function splitMessage(text: string, maxLength: number = 4000): string[] {
  if (text.length <= maxLength) return [text]
  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining)
      break
    }
    // Try to split on newline or space within limit
    let splitIndex = remaining.lastIndexOf('\n', maxLength)
    if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
      splitIndex = remaining.lastIndexOf(' ', maxLength)
    }
    if (splitIndex === -1 || splitIndex < maxLength * 0.5) {
      splitIndex = maxLength
    }

    chunks.push(remaining.slice(0, splitIndex).trim())
    remaining = remaining.slice(splitIndex).trim()
  }

  return chunks
}

/**
 *  fetches the messages of a conversation and converts into the model readable format
 *  if no conversations id passed creates new conversation and updates the connector
 */
export async function getConnectorChatContext({
  connectorName,
  newPrompt
}: {
  connectorName: string
  newPrompt: string
}) {
  // get the current connector data
  const connector = await db.query.connectors.findFirst({
    where: eq(connectors.name, connectorName)
  })

  if (!connector) {
    throw new Error(`Connector ${connectorName} not found`)
  }

  let conversationId = connector.activeConversationId
  // in case no conversation id
  if (!conversationId) {
    // create a conversation
    // add a new conversation to db
    const [newConversation] = await db
      .insert(conversations)
      .values({
        modelId: connector.modelId,
        provider: connector.provider,
        systemPrompt: connector.systemPrompt,
        title: `${connectorName} chat` // default title
      })
      .returning()

    conversationId = newConversation.id

    // update the connector db with the generated conversation id
    await db
      .update(connectors)
      .set({
        activeConversationId: conversationId
      })
      .where(eq(connectors.name, connectorName))
  }
  // Insert incoming user prompt into messages
  await db.insert(messages).values({
    role: 'user',
    conversationId: conversationId,
    parts: [{ type: 'text', text: newPrompt }]
  })

  //@TODO later make it configurable such that how many last messages are taken optionally
  // 3. Fetch conversation messages in chronological order by conversation id
  const dbMessages = await db.query.messages.findMany({
    where: eq(messages.conversationId, conversationId),
    orderBy: [asc(messages.createdAt)]
  })

  // Normalize messages to feed into model @TODO this is skipped for now any attachments have to be stored in locally or or it wont work in the ui here
  // convert to core messages
  const modelMessages = await convertToModelMessages(dbMessages)

  return {
    conversationId,
    modelMessages,
    modelId: connector.modelId,
    provider: connector.provider,
    systemPrompt: connector?.systemPrompt ?? undefined
  }
}

/**
 *this is used for generating text response from ai
 * used by connector chant bots
 */
export async function getAiResponseForBotNonStream({
  provider,
  modelId,
  systemPrompt,
  messages,
  conversationId
}: {
  modelId: string
  provider: string
  systemPrompt?: string
  messages: ModelMessage[]
  conversationId: number
}): Promise<string> {
  // const get the provider as per user model
  const modelProvider = await getProviderInstanceModel({
    provider
  })

  // generate response
  const { text: assistantMessage, usage } = await generateText({
    model: modelProvider(modelId),
    system: systemPrompt,
    messages: messages
  })

  // generate title if more than 4 messages not waiting for this
  if (messages.length == 4) {
    generateTitleFromModelMessages({
      modelId,
      provider,
      messages,
      conversationId
    })
  }

  // store assistant message no waiting here
  if (assistantMessage) {
    db.insert(messageSchema)
      .values({
        role: 'assistant',
        conversationId,
        parts: [{ type: 'text', text: assistantMessage }],
        metadata: {
          tokensPerMessage: usage?.totalTokens ?? 0,
          timeStamp: new Date()
        }
      })
      .then(() => {
        // generate title if more than 4 messages not waiting for this
        if (messages.length == 4) {
          generateTitleFromModelMessages({
            modelId,
            provider,
            messages,
            conversationId
          })
        }
      })
  }

  return assistantMessage
}
