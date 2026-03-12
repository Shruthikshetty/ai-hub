import { useState, useEffect } from 'react'

/**
 * A custom hook that prevents flickering loading indicators by appropriately delaying the true state.
 * It only returns `true` if the `isLoading` state persists for longer than the specified delay.
 *
 * @param isLoading The actual loading state from a data fetching hook (e.g., `isFetching`).
 * @param delay The debounce delay in milliseconds. Defaults to 500ms.
 * @returns A boolean indicating whether the delayed loading state should be shown.
 */
function useDelayedLoading(isLoading: boolean, delay = 500): boolean {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      // eslint-disable-next-line
      setShowLoading(false)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoading, delay])

  return showLoading
}

export default useDelayedLoading
