/**
 * This file contains all globally used types
 */

import { FILE_STORAGE_CATEGORY } from './constants/global.constants'

export type ApiError = {
  message?: string
  success: boolean
}

export type FileStorageCategory = (typeof FILE_STORAGE_CATEGORY)[keyof typeof FILE_STORAGE_CATEGORY]
