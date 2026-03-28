import GradientLoader from './gradient-loader'
import { useScreenLoader } from '@renderer/state-management/screen-loader.store'

/**
 * This wraps the app with a overlay screen loader
 */
export function ScreenLoaderProvider({ children }: { children: React.ReactNode }) {
  const isLoading = useScreenLoader((state) => state.isLoading)

  return (
    <>
      {isLoading && (
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
      <div inert={isLoading} aria-hidden={isLoading} className="contents">
        {children}
      </div>
    </>
  )
}
