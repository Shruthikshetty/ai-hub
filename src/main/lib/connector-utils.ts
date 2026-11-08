import { convertToModelMessages, generateText, ModelMessage } from 'ai'
import { getProviderInstanceModel } from './get-provider-instance'
import db from '../db'
import { connectors, conversations, messages } from '../db/schema'
import { asc, count, desc, eq } from 'drizzle-orm'
import { generateTitleFromModelMessages } from './generate-title'
import { messages as messageSchema } from '../../common/db-schemas/message.schema'
import { mcpService } from '../services/mcp/mcp.service'
export { autoStartConnectors } from './startup'

/**
 * split message into chunks my provided maxLength
 */
export function splitMessage(text: string, maxLength: number = 4000): string[] {
  // check length of the text  if less direct return
  if (text.length <= maxLength) return [text]
  // create a array of chunks to hold all the text segments
  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    // push the last chunk
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

    // push the chunk
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
  // get the current connector data with active conversation populated
  const connector = await db.query.connectors.findFirst({
    where: eq(connectors.name, connectorName),
    with: {
      activeConversation: true
    }
  })

  if (!connector) {
    throw new Error(`Connector ${connectorName} not found`)
  }

  let conversationId: number

  // in case no active conversation id or conversation was deleted
  if (!connector.activeConversation) {
    // create a new conversation and add to db
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
  } else {
    conversationId = connector.activeConversation.id
  }

  // Insert incoming user prompt into messages
  await db.insert(messages).values({
    role: 'user',
    conversationId: conversationId,
    parts: [{ type: 'text', text: newPrompt }]
  })

  // Fetch conversation messages in chronological order by conversation id
  const dbMessages =
    connector.messageLimit && connector.messageLimit > 0
      ? (
          await db.query.messages.findMany({
            where: eq(messages.conversationId, conversationId),
            orderBy: [desc(messages.createdAt)],
            limit: connector.messageLimit + 1 // +1 includes the current user prompt that was just inserted along with N previous messages
          })
        ).reverse()
      : await db.query.messages.findMany({
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
  conversationId,
  connectorName
}: {
  modelId: string
  provider: string
  systemPrompt?: string
  messages: ModelMessage[]
  conversationId: number
  connectorName?: string
}): Promise<string> {
  // const get the provider as per user model
  const modelProvider = await getProviderInstanceModel({
    provider
  })

  // add mcp tools for testing
  const tools = mcpService.getTools()

  // generate response
  const { text: assistantMessage, usage } = await generateText({
    model: modelProvider(modelId),
    instructions: systemPrompt,
    messages: messages,
    tools: Object.keys(tools).length > 0 ? (tools as any) : undefined
  })

  // generate title after 2nd user prompt (when total conversation count is exactly 3)
  db.select({ totalCount: count() })
    .from(messageSchema)
    .where(eq(messageSchema.conversationId, conversationId))
    .then(([{ totalCount }]) => {
      if (totalCount === 3) {
        generateTitleFromModelMessages({
          modelId,
          provider,
          messages,
          conversationId,
          messageLimit: 3,
          optionalSuffix: connectorName ? `(${connectorName})` : ''
        })
      }
    })
    .catch(() => {})

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
      .catch(() => {
        console.error('message db insertion failed')
        /**ignore insert errors */
      })
  }

  return assistantMessage
}
/**
 * returns a detailed info string about the connector
 */
export const getInfoConnectorByName = async (name: string) => {
  // get the current connector data
  const connector = await db.query.connectors.findFirst({
    where: eq(connectors.name, name)
  })

  // if no connector found
  if (!connector) {
    return 'No info found try again later'
  }

  const info = [
    `Bot details :`,
    `Model provider : ${connector.provider}`,
    `Model id : ${connector.modelId}`
  ]

  if (connector.messageLimit) {
    info.push(`Message limit : ${connector.messageLimit}`)
  }

  return info.join('\n')
}

/**
 * create a new chant and wire up with the connector
 */
export const setNewConversationByConnectorName = async (name: string) => {
  try {
    // get the current connector data
    const connector = await db.query.connectors.findFirst({
      where: eq(connectors.name, name)
    })

    // if no connector found
    if (!connector) {
      return 'No connector found check your ai hub interface to add one'
    }

    // add a new conversation to db
    const [newConversation] = await db
      .insert(conversations)
      .values({
        modelId: connector.modelId,
        provider: connector.provider,
        systemPrompt: connector.systemPrompt,
        title: `${connector.displayName} chat` // default title
      })
      .returning()

    // update the connector db with the generated conversation id
    await db
      .update(connectors)
      .set({
        activeConversationId: newConversation.id
      })
      .where(eq(connectors.name, name))

    // return success repose
    return 'New chat created successfully'
  } catch {
    return 'Failed to create new chat retry again'
  }
}
