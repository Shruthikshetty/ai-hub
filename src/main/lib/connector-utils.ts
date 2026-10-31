import { generateText } from 'ai'
import { getProviderInstanceModel } from './get-provider-instance'

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
 *this is used for generating text response from ai
 * used by connector chant bots
 */
export async function getAiResponseForBotNonStream({ prompt, provider, modelId }): Promise<string> {
  // const get the provider as per user model
  const modelProvider = await getProviderInstanceModel({
    provider
  })

  // generate response
  const { text } = await generateText({
    model: modelProvider(modelId),
    prompt: prompt
  })

  return text
}
