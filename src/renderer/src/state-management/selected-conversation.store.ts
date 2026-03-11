/**
 * This manages the state for selected conversation
 */
import { ConversationsGetSchema } from '@common/db-schemas/conversation.schema'
import { create } from 'zustand'

//initial state
const initialState = {
  conversation: null
}
// type
type UseSelectedConversation = {
  conversation: ConversationsGetSchema | null
  setConversation: (conversation: ConversationsGetSchema) => void
}

// hook to access the state
const useSelectedConversation = create<UseSelectedConversation>((set) => ({
  ...initialState,
  setConversation: (conversation) => set({ conversation })
}))

export default useSelectedConversation
