/**
 * Extracts projectId and apiKey for Vertex AI.
 * Format can be `<project-id>:<api-key>` or just `<api-key>`.
 */
export function parseVertexCredentials(credentialString?: string): {
  projectId: string
  apiKey: string
} {
  const trimmed = credentialString?.trim() || ''
  if (trimmed.includes(':')) {
    const colonIndex = trimmed.indexOf(':')
    const projectId = trimmed.slice(0, colonIndex).trim()
    const apiKey = trimmed.slice(colonIndex + 1).trim()
    return {
      projectId: projectId ?? '',
      apiKey
    }
  }
  return {
    projectId: '',
    apiKey: trimmed
  }
}
