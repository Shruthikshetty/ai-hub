/**
 * This manages the global state for selected models
 */

import { create } from 'zustand'
import { ModelSchemaType } from '@common/schemas/model.schema'

// initial state
const initialState = {
  model: null
}

type UseSelectedModel = {
  model: ModelSchemaType | null
  setModel: (model: ModelSchemaType) => void
}

const useSelectedModel = create<UseSelectedModel>((set) => ({
  ...initialState,
  setModel: (model) => set({ model })
}))

export default useSelectedModel
