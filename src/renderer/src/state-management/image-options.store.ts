/**
 * a zustand store that holds the selected advance options of the image generation
 */

import { create } from 'zustand'

// define type of the store
interface ImageOptionsState {
  size: string | undefined
  quality: string | undefined
  setSize: (size: string | undefined) => void
  setQuality: (quality: string | undefined) => void
  reset: () => void
}

// initial state
const initialState: Pick<ImageOptionsState, 'size' | 'quality'> = {
  size: undefined,
  quality: undefined
}

export const useImagOptions = create<ImageOptionsState>((set) => ({
  ...initialState,
  setSize: (size) => set({ size }),
  setQuality: (quality) => set({ quality }),
  reset: () => set({ quality: undefined, size: undefined })
}))
