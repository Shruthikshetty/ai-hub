import { decryptText } from '../../../common/utils/encryption.util'
import db from '../../db'

export const handleGetRealtimeToken = async () => {
  try {
    // get api key
    const providerDetails = await db.query.providers.findFirst({
      where: (providers, { eq }) => eq(providers.provider, 'openai')
    })

    let apiKey = ''

    // decrypt api key
    if (providerDetails?.apiKey) {
      apiKey = decryptText(providerDetails.apiKey)
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, client_secret: data.client_secret.value }
  } catch (error) {
    console.error('Failed to get realtime token:', error)
    return { success: false, error: (error as Error).message }
  }
}
