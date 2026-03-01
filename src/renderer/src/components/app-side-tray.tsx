import { cn } from '@renderer/lib/utils'
import AppLogo from './app-logo'
import { Separator } from './ui/separator'
import { Settings } from 'lucide-react'

/**
 * contains the side tray of the app that has quick links to all the pages
 */
const AppSideTray = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'w-18 bg-sidebar px-2 py-5 overflow-hidden flex flex-col border-r items-center justify-between',
        className
      )}
    >
      {/* top part  */}
      <div className="gap-2 flex flex-col w-full items-center">
        {/* App Logo */}
        <AppLogo />
        <Separator className="w-full" />
        {/*@todo All quick links go here */}
      </div>
      {/* bottom part */}
      <div className="gap-2 flex flex-col w-full items-center">
        <Separator className="w-full" />
        <button className="hover:cursor-pointer">
          <Settings className="size-6" />
        </button>
      </div>
    </div>
  )
}

export default AppSideTray
