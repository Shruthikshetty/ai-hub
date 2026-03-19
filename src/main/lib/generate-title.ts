/**
 * this generates a title for the conversation
 */
import { generateText } from 'ai'
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
    const modelProvider = await getProviderInstanceModel({ model })
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
