/**
 * @file File storage utility for saving uploaded files to app data directory.
 *
 * Storage layout under APP_USER_DATA/media/:
 *   - profile-img/avatar.<ext>    → Single profile image (overwritten so URL stays same)
 *   - img-gen/<YYYY-MM-DD>/<uuid>.<ext>  → Generated images, organized by date
 *
 * All functions return a relative "media path" which the custom media:// protocol
 * resolves to the absolute path for direct URL access in the renderer.
 *
 * Upload flow:
 *   1. Renderer gets real file path via preload's getFilePath()
 *   2. Sends the path string + category to Hono via existing IPC bridge
 *   3. This module stream-copies the file to APP_USER_DATA/media/ organizing by FILE_STORAGE_CATEGORY
 *   4. Returns the media:// URL for the renderer to use directly
 */

import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { randomUUID } from 'node:crypto'
import { EXT_TO_MIME, FILE_STORAGE_CATEGORY } from '../../common/constants/global.constants'
import { mediaUploadSchemaType } from '../../common/schemas/media.schema'

//types
export interface SaveFileResult {
  /** Relative path from media root, e.g. "profile-img/avatar.png" */
  relativePath: string
  /** Absolute path on disk */
  absolutePath: string
  /** media:// URL for use in renderer, e.g. "media://profile-img/avatar.png" */
  mediaUrl: string
}

/** Resolve the root media directory from the APP_USER_DATA env var. witch we are setting in a utilityProcess in main index*/
export function getMediaRoot(): string {
  const appData = process.env.APP_USER_DATA
  if (!appData) {
    throw new Error('APP_USER_DATA environment variable is not set')
  }
  return path.join(appData, 'media')
}

/**
 * Extract file extension from a path.
 * Validates against EXT_TO_MIME to ensure only safe image types are uploaded.
 */
function getExtension(filePath: string): string {
  const ext = path.extname(filePath).replace('.', '').toLowerCase()
  if (!ext || !EXT_TO_MIME[ext]) {
    throw new Error(`Unsupported file type. Allowed types: ${Object.keys(EXT_TO_MIME).join(', ')}`)
  }
  return ext
}

/**
 * Stream-copy a file from sourcePath to the appropriate location in app data.
 * Uses Node.js streams so even large files (MBs) are handled efficiently.
 */
export async function saveFile(options: mediaUploadSchemaType): Promise<SaveFileResult> {
  const { sourcePath, category } = options
  const ext = getExtension(sourcePath)
  const mediaRoot = getMediaRoot()

  let relativePath: string
  let absolutePath: string

  if (category === FILE_STORAGE_CATEGORY.profileImg) {
    // Always overwrite with same filename so DB URL stays constant
    const dir = path.join(mediaRoot, category)
    fs.mkdirSync(dir, { recursive: true })

    // Clean up any old avatar files with different extensions
    if (fs.existsSync(dir)) {
      const existing = fs.readdirSync(dir).filter((f) => f.startsWith('avatar.'))
      for (const file of existing) {
        fs.unlinkSync(path.join(dir, file))
      }
    }

    const filename = `avatar.${ext}`
    absolutePath = path.join(dir, filename)
    relativePath = `${category}/${filename}`
  } else {
    // Other categories (e.g. imageGen): date-based folder with UUID filename
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const dir = path.join(mediaRoot, category, today)
    fs.mkdirSync(dir, { recursive: true })

    const filename = `${randomUUID()}.${ext}`
    absolutePath = path.join(dir, filename)
    relativePath = `${category}/${today}/${filename}`
  }

  // Stream copy — efficient for files of any size
  await pipeline(fs.createReadStream(sourcePath), fs.createWriteStream(absolutePath))

  return {
    relativePath,
    absolutePath,
    mediaUrl: `media://${relativePath}`
  }
}

/**
 * Resolve a relative media path (e.g. "profile-img/avatar.png") to its absolute path.
 * Used by the custom protocol handler to serve files.
 */
export function resolveMediaPath(relativePath: string): string | null {
  const mediaRoot = getMediaRoot()

  // Sanitize: prevent path traversal
  const cleaned = relativePath.replace(/^\/+/, '')
  if (cleaned.includes('..')) return null

  const absolute = path.join(mediaRoot, cleaned)

  // Ensure the resolved path is still inside the media root (security)
  if (!absolute.startsWith(mediaRoot)) return null
  if (!fs.existsSync(absolute)) return null

  return absolute
}

/**
 * Delete a file by its relative media path.
 */
export function deleteMediaFile(relativePath: string): boolean {
  const absolute = resolveMediaPath(relativePath)
  if (!absolute) return false

  try {
    fs.unlinkSync(absolute)
    return true
  } catch {
    return false
  }
}
