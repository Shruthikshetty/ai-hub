import AppSideTray from './components/app-side-tray'
import { ThemeProvider } from './components/theme-provider'
import { TooltipProvider } from './components/ui/tooltip'

/**
 * @param param0 defines the app layout and all the providers required
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="h-screen w-screen flex flex-row justify-baseline">
          <AppSideTray />
          <div className="bg-background overflow-auto w-full">{children}</div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default AppLayout
