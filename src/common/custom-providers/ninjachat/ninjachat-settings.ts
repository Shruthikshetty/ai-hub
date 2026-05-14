/**
 * Settings and types shared across all NinjaChat model kinds.
 */

export interface NinjaChatProviderSettings {
  /**
   * NinjaChat API key (starts with nj_sk_...).
   * Falls back to process.env.NINJACHAT_API_KEY if not provided.
   */
  apiKey?: string

  /**
   * Override the base URL. Defaults to https://ninjachat.ai/api/v1
   */
  baseURL?: string
}
