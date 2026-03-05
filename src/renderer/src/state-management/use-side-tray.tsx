import { useNavigate } from 'react-router'
import { create } from 'zustand'

//type for state
interface SideTrayState {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

// initial state
const initialState: SideTrayState = {
  selectedTab: '/',
  setSelectedTab: () => {}
}

/**
 * side tray state management hook
 */
export const useSideTray = create<SideTrayState>((set) => ({
  ...initialState,
  /**
   * set the selected tab , this dose not navigate to the path
   */
  setSelectedTab: (tab: string) => {
    set({ selectedTab: tab })
  }
}))

/**
 * hook to set and navigate to the specified tab
 */
export const useNavigateToTab = () => {
  const navigate = useNavigate()
  const setSelectedTab = useSideTray((state) => state.setSelectedTab)

  return (path: string) => {
    navigate(path)
    setSelectedTab(path)
  }
}
