import AppSideTray from './components/app-side-tray'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

//create a query client
const queryClient = new QueryClient()

/**
 * @param param0 defines the app layout and all the providers required
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <div className="h-screen w-screen flex flex-row justify-baseline">
            <AppSideTray />
            <div className="bg-background overflow-auto w-full">{children}</div>
          </div>
          <Toaster position="bottom-right" />
          {/* for debugging */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default AppLayout
