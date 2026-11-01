/**
 * this generates a title for the conversation
 */
import { generateText, ModelMessage } from 'ai'
import { getProviderInstanceModel } from './get-provider-instance'
import { ModelSchemaType } from '../../common/schemas/model.schema'
import db from '../db'
import { conversations } from '../db/schema'
import { eq } from 'drizzle-orm'

/**
 * this function generates a title for the conversation
 */
export async function generateTitle({
  model,
  message,
  conversationId
}: {
  model: ModelSchemaType
  message: string
  conversationId: number
}) {
  try {
    const modelProvider = await getProviderInstanceModel({ provider: model.provider })
    const result = await generateText({
      model: modelProvider(model.id),
      prompt: `Generate a very short title (max 7 words) for a conversation that starts with: "${message}". Reply with ONLY the title, no quotes.`
    })
    // up date the conversation title
    await db
      .update(conversations)
      .set({ title: result?.text?.replace(/^["'\s]+|["'\s]+$/g, '') ?? 'New Chat' })
      .where(eq(conversations.id, conversationId))
  } catch (error) {
    // silent fail
    console.error('Failed to generate title', error)
  }
}

/**
 * Generates a title from an array of ModelMessages (multi-turn context).
 */
export async function generateTitleFromModelMessages({
  modelId,
  provider,
  messages,
  conversationId,
  messageLimit = 4
}: {
  modelId: string
  provider: string
  messages: ModelMessage[]
  conversationId: number
  messageLimit?: number
}) {
  try {
    // Take up to messageLimit messages
    const targetMessages = messages.slice(0, messageLimit)
    // Extract clean text into a dialogue snippet using single-pass for..of
    let conversationSnippet = ''
    for (const m of targetMessages) {
      let text = ''
      if (typeof m.content === 'string') {
        text = m.content
      } else if (Array.isArray(m.content)) {
        for (const part of m.content) {
          if (part.type === 'text') {
            text += (text ? ' ' : '') + part.text
          }
        }
      }
      if (text.trim()) {
        conversationSnippet += `${m.role}: ${text.trim()}\n`
      }
    }
    // in case no text found
    if (!conversationSnippet.trim()) return

    //generate title
    const modelProvider = await getProviderInstanceModel({ provider })
    const result = await generateText({
      model: modelProvider(modelId),
      prompt: `Generate a very short title (max 7 words) for this conversation:\n\n${conversationSnippet}\nReply with ONLY the title, no quotes.`
    })

    //Update the conversation title in database
    await db
      .update(conversations)
      .set({ title: result?.text?.replace(/^["'\s]+|["'\s]+$/g, '') ?? 'New Chat' })
      .where(eq(conversations.id, conversationId))
  } catch (error) {
    // silent fail
    console.error('Failed to generate title from model messages', error)
  }
}
