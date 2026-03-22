/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file Normalizes UIMessages before passing them to the AI SDK.
 *
 * After the frontend upgrade, file parts stored in messages carry either:
 *   - media:// URLs → files saved to disk (happy path)
 *   - blob: URLs    → upload failed, still in-memory (fallback)
 *   - data: URIs    → legacy / direct base64 sends
 *
 * The AI SDK's `downloadAssets` only accepts http/https in the `url` field.
 * This helper converts each case to something the SDK accepts without fetching.
 */
import fs from 'node:fs/promises'
import { AppUIMessage } from '../../common/schemas/messages.schema'
import { resolveMediaPath } from './file-storage'

async function normalizeFileParts(parts: AppUIMessage['parts']): Promise<any[]> {
  // Use Promise.all to handle multiple parts concurrently
  return Promise.all(
    parts.map(async (part) => {
      if (part.type !== 'file') return part

      const { url } = part

      // media:// URL → read file from disk as Buffer asynchronously
      if (url?.startsWith('media://')) {
        const relativePath = url.slice('media://'.length)
        const absolutePath = resolveMediaPath(relativePath)
        if (absolutePath) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { url: _url, ...rest } = part
            return {
              ...rest,
              // await fs.readFile ensures the event loop is not blocked
              url: await fs.readFile(absolutePath)
            }
          } catch (e) {
            // Fallback if file read fails
            console.error('Failed to normalize media attachment', e)
            // Drop broken attachment
            return null
          }
        }
        return null
      }

      // data: URI → strip prefix, put raw base64 in url
      if (url?.startsWith('data:')) {
        const commaIdx = url.indexOf(',')
        if (commaIdx < 0) return part
        const prefix = url.slice(0, commaIdx)
        const base64 = url.slice(commaIdx + 1)
        if (!base64) return part
        const inferredMediaType = prefix.split(':')[1]?.split(';')[0] ?? part.mediaType
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { url: _url, ...rest } = part
        return { ...rest, mediaType: inferredMediaType, url: base64 }
      }

      return part
    })
  )
}

/**
 * Normalizes all messages asynchronously before passing to the AI SDK
 */
export async function normalizeMessages(messages: AppUIMessage[]): Promise<any[]> {
  return (
    await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        // Wait for file parts to be resolved
        parts: await normalizeFileParts(msg.parts)
      }))
    )
  ).filter(Boolean)
}
