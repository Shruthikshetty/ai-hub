/**
 * utils used in prompt input component
 */

import type {
  AttachmentsContext,
  PromptInputControllerProps
} from '@renderer/components/ai-elements/prompt-input'
import type { SourceDocumentUIPart } from 'ai'
import { createContext, useContext } from 'react'

// ============================================================================
// Component Context & Hooks
// ============================================================================

export const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null)

export const usePromptInputAttachments = () => {
  // Prefer local context (inside PromptInput) as it has validation, fall back to provider
  const provider = useOptionalProviderAttachments()
  const local = useContext(LocalAttachmentsContext)
  const context = local ?? provider
  if (!context) {
    throw new Error(
      'usePromptInputAttachments must be used within a PromptInput or PromptInputProvider'
    )
  }
  return context
}

export const PromptInputController = createContext<PromptInputControllerProps | null>(null)
export const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(null)

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController)
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use usePromptInputController().'
    )
  }
  return ctx
}

// Optional variants (do NOT throw). Useful for dual-mode components.
export const useOptionalPromptInputController = () => useContext(PromptInputController)

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext)
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use useProviderAttachments().'
    )
  }
  return ctx
}

export const useOptionalProviderAttachments = () => useContext(ProviderAttachmentsContext)

// ============================================================================
// Referenced Sources (Local to PromptInput)
// ============================================================================

export interface ReferencedSourcesContext {
  sources: (SourceDocumentUIPart & { id: string })[]
  add: (sources: SourceDocumentUIPart[] | SourceDocumentUIPart) => void
  remove: (id: string) => void
  clear: () => void
}

export const LocalReferencedSourcesContext = createContext<ReferencedSourcesContext | null>(null)

export const usePromptInputReferencedSources = () => {
  const ctx = useContext(LocalReferencedSourcesContext)
  if (!ctx) {
    throw new Error(
      'usePromptInputReferencedSources must be used within a LocalReferencedSourcesContext.Provider'
    )
  }
  return ctx
}
