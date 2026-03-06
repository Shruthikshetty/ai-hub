/**
 * @file contains constants used globally throwout the app
 */

// File storage category
export const FILE_STORAGE_CATEGORY = {
  profileImg: 'profile-img',
  imageGen: 'img-gen'
} as const

// MIME lookup for common image types
export const EXT_TO_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  avif: 'image/avif',
  ico: 'image/x-icon'
}
