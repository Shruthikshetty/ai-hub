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
  seed: number | undefined
  setSeed: (seed: number | undefined) => void
  aspectRatio: string | undefined
  setAspectRatio: (aspectRatio: string | undefined) => void
  reset: () => void
}

// initial state
const initialState: Pick<ImageOptionsState, 'size' | 'quality' | 'seed' | 'aspectRatio'> = {
  size: undefined,
  quality: undefined,
  seed: undefined,
  aspectRatio: undefined
}

export const useImagOptions = create<ImageOptionsState>((set) => ({
  ...initialState,
  setSize: (size) => set({ size }),
  setQuality: (quality) => set({ quality }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setSeed: (seed) => set({ seed }),
  reset: () => set({ quality: undefined, size: undefined, seed: undefined, aspectRatio: undefined })
}))
