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
import fs from 'node:fs'
import { AppUIMessage } from '../../common/schemas/messages.schema'
import { resolveMediaPath } from './file-storage'

function normalizeFileParts(parts: AppUIMessage['parts']): any[] {
  return parts.map((part) => {
    if (part.type !== 'file') return part

    const { url } = part

    //media:// URL → read file from disk as Buffer
    if (url?.startsWith('media://')) {
      const relativePath = url.slice('media://'.length)
      const absolutePath = resolveMediaPath(relativePath)
      if (absolutePath) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { url: _url, ...rest } = part
        return {
          ...rest,
          // SDK accepts Buffer/Uint8Array directly — no download triggered
          url: fs.readFileSync(absolutePath)
        }
      }
      // File missing on disk — fall through to handle as-is
      return part
    }

    //data: URI → strip prefix, put raw base64 in url
    if (url?.startsWith('data:')) {
      const [prefix, base64] = url.split(',')
      const inferredMediaType = prefix.split(':')[1]?.split(';')[0] ?? part.mediaType
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { url: _url, ...rest } = part
      return { ...rest, mediaType: inferredMediaType, url: base64 }
    }

    return part
  })
}

/**
 * Normalizes all messages — history messages now persist `media://` URLs in
 * the DB so every message needs its file parts resolved before the SDK sees them.
 */
export function normalizeMessages(messages: AppUIMessage[]): any[] {
  return messages.map((msg) => ({
    ...msg,
    parts: normalizeFileParts(msg.parts)
  }))
}
