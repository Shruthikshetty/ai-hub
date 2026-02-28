import AppSideTray from './components/app-side-tray'

/**
 * @param param0 defines the app layout and all the providers required
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-row justify-baseline">
      <AppSideTray className="w-20 bg-gray-800 p-2 overflow-hidden flex flex-col" />
      <div className="w-11/12 bg-white overflow-hidden">{children}</div>
    </div>
  )
}

export default AppLayout
