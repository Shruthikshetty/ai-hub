import AppSideTray from './components/app-side-tray'
import { ThemeProvider } from './components/theme-provider'

/**
 * @param param0 defines the app layout and all the providers required
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-row justify-baseline">
        <AppSideTray />
        <div className=" bg-background overflow-auto w-full">{children}</div>
      </div>
    </ThemeProvider>
  )
}

export default AppLayout
