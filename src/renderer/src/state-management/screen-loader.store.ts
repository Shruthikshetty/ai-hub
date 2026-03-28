/**
 * This manages the global state for screen loader
 */

import { create } from 'zustand'

interface ScreenLoaderState {
  isLoading: boolean
  showLoader: () => void
  hideLoader: () => void
  setLoader: (isLoading: boolean) => void
  delay: number
}
const initialState = {
  isLoading: false,
  delay: 300
}

/**
 * hook to get the screen loader state
 */
export const useScreenLoader = create<ScreenLoaderState>((set) => ({
  ...initialState,
  showLoader: () => set({ isLoading: true }),
  hideLoader: () => set({ isLoading: false }),
  setDelay: (delay: number) => set({ delay }),
  setLoader: (isLoading: boolean) => set({ isLoading })
}))
