/**
 * This manages the global state for screen loader
 */

import { create } from 'zustand'

interface ScreenLoaderState {
  isLoading: boolean
  showLoader: () => void
  hideLoader: () => void
  setLoader: (isLoading: boolean) => void
}

/**
 * hook to get the screen loader state
 */
export const useScreenLoader = create<ScreenLoaderState>((set) => ({
  isLoading: false,
  showLoader: () => set({ isLoading: true }),
  hideLoader: () => set({ isLoading: false }),
  setLoader: (isLoading: boolean) => set({ isLoading })
}))
