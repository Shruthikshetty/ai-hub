/**
 * This manages the global state for selected models
 */

import { create } from 'zustand'
import { ModelSchemaType } from '@common/schemas/model.schema'

// initial state
const initialState = {
  models: {} as Record<string, ModelSchemaType | null>
}

type UseSelectedModel = {
  models: Record<string, ModelSchemaType | null>
  getModel: (feature: string) => ModelSchemaType | null
  setModel: (feature: string, model: ModelSchemaType) => void
}

const useSelectedModel = create<UseSelectedModel>((set, get) => ({
  ...initialState,
  getModel: (feature) => get().models[feature] ?? null,
  setModel: (feature, model) =>
    set((state) => ({
      models: {
        ...state.models,
        [feature]: model
      }
    }))
}))

export default useSelectedModel
