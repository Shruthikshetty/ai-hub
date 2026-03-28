/**
 * This file contains all the query / mutation keys
 */
export const QUERY_KEYS = {
  userFetch: 'user-fetch',
  modelsFetch: 'models-fetch',
  providersFetch: 'providers-fetch',
  conversationsFetch: 'conversations-fetch',
  conversationMessagesFetch: 'conversation-messages-fetch',
  messageFetch: 'message-fetch',
  mediaFetch: 'media-fetch'
}

export const MUTATION_KEYS = {
  userUpdate: 'user-update',
  mediaUpload: 'media-upload',
  providerUpdateById: 'provider-update-by-id',
  conversationAdd: 'conversation-add',
  deleteConversationById: 'delete-conversation-by-id',
  messageAdd: 'message-add',
  updateConversationById: 'update-conversation-by-id',
  imageGenerate: 'image-generate',
  imageDelete: 'image-delete'
}
