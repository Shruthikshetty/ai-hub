//types
export type AttachmentVariant = 'grid' | 'inline' | 'list'
export type AttachmentsProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AttachmentVariant
}

// ============================================================================
// Utility Functions
// ============================================================================

import {
  AttachmentData,
  AttachmentMediaCategory
} from '@renderer/components/ai-elements/attachments'
import { createContext, HTMLAttributes, useContext } from 'react'

export const getMediaCategory = (data: AttachmentData): AttachmentMediaCategory => {
  if (data.type === 'source-document') {
    return 'source'
  }

  const mediaType = data.mediaType ?? ''

  if (mediaType.startsWith('image/')) {
    return 'image'
  }
  if (mediaType.startsWith('video/')) {
    return 'video'
  }
  if (mediaType.startsWith('audio/')) {
    return 'audio'
  }
  if (mediaType.startsWith('application/') || mediaType.startsWith('text/')) {
    return 'document'
  }

  return 'unknown'
}

export const getAttachmentLabel = (data: AttachmentData): string => {
  if (data.type === 'source-document') {
    return data.title || data.filename || 'Source'
  }

  const category = getMediaCategory(data)
  return data.filename || (category === 'image' ? 'Image' : 'Attachment')
}

// ============================================================================
// Contexts
// ============================================================================

interface AttachmentsContextValue {
  variant: AttachmentVariant
}

export const AttachmentsContext = createContext<AttachmentsContextValue | null>(null)

export interface AttachmentContextValue {
  data: AttachmentData
  mediaCategory: AttachmentMediaCategory
  onRemove?: () => void
  variant: AttachmentVariant
}

export const AttachmentContext = createContext<AttachmentContextValue | null>(null)

// ============================================================================
// Hooks
// ============================================================================

export const useAttachmentsContext = () =>
  useContext(AttachmentsContext) ?? { variant: 'grid' as const }

export const useAttachmentContext = () => {
  const ctx = useContext(AttachmentContext)
  if (!ctx) {
    throw new Error('Attachment components must be used within <Attachment>')
  }
  return ctx
}
