/**
 * @file Normalizes UIMessages before passing them to the AI SDK.
 *
 * The AI SDK's `downloadAssets` utility only accepts http/https URLs in the
 * `url` field of file parts. When images are sourced locally (e.g. from an
 * Electron blob URL converted to a data URI on the frontend), they arrive as
 * `data:image/webp;base64,...`. This helper strips the prefix and replaces
 * the full data URI with just the raw base64 string, which the SDK treats as
 * already-decoded inline data rather than a URL to fetch.
 */
import { AppUIMessage } from '../../common/schemas/messages.schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFileParts(parts: AppUIMessage['parts']): any[] {
  return parts.map((part) => {
    if (part.type === 'file' && part.url?.startsWith('data:')) {
      const [prefix, base64] = part.url.split(',')
      // prefix looks like "data:image/webp;base64"
      const inferredMediaType = prefix.split(':')[1]?.split(';')[0] ?? part.mediaType
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { url: _url, ...rest } = part
      return {
        ...rest,
        mediaType: inferredMediaType,
        // Raw base64 in `url` — the SDK treats this as inline data, not a URL to fetch
        url: base64
      }
    }
    return part
  })
}

/**
 * Only the last message (the freshly submitted user message) can have
 * `data:` URIs — prior messages came from the DB and are already clean.
 * All other messages are passed through unchanged.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeMessages(messages: AppUIMessage[]): any[] {
  if (messages.length === 0) return messages
  return [
    ...messages.slice(0, -1),
    { ...messages.at(-1)!, parts: normalizeFileParts(messages.at(-1)!.parts) }
  ]
}
