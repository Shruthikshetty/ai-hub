import useDelayedLoading from '@renderer/hooks/use-delayed-loading'
import GradientLoader from './gradient-loader'
import { useScreenLoader } from '@renderer/state-management/screen-loader.store'

/**
 * This wraps the app with a overlay screen loader
 */
export function ScreenLoaderProvider({ children }: { children: React.ReactNode }) {
  const isLoading = useScreenLoader((state) => state.isLoading)
  const delay = useScreenLoader((state) => state.delay)
  // only show the overlay if loading persists for delay ms (prevent flicker) by default delay is 300ms
  const showLoader = useDelayedLoading(isLoading, delay)

  return (
    <>
      {showLoader && (
        <div
          className="absolute inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <GradientLoader />
        </div>
      )}
      <div inert={showLoader} aria-hidden={showLoader} className="contents">
        {children}
      </div>
    </>
  )
}
