import { cn } from '@renderer/lib/utils'
import AppLogo from './app-logo'
import { Separator } from './ui/separator'
import { Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { SETTINGS_TRAY_ITEM, SIDE_TRAY_ITEMS } from '@renderer/constants/screen.constants'

/**
 * contains the side tray of the app that has quick links to all the pages
 */
const AppSideTray = ({ className }: { className?: string }) => {
  // get the current path
  const { pathname } = useLocation()

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
        <Link to="/">
          <AppLogo />
        </Link>
        <Separator className="w-full" />
        <div className="flex flex-col gap-5 mt-2">
          {SIDE_TRAY_ITEMS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'hover:cursor-pointer transition-all p-2 rounded-sm hover:bg-muted',
                pathname === item.path && 'bg-muted-foreground/60'
              )}
            >
              <item.icon className="size-6" />
              <span className="sr-only">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* bottom part */}
      <div className="gap-2 flex flex-col w-full items-center">
        <Separator className="w-full" />
        <Link
          to={SETTINGS_TRAY_ITEM.path}
          className={cn(
            'hover:cursor-pointer transition-all p-2 rounded-sm hover:bg-muted',
            pathname === SETTINGS_TRAY_ITEM.path && 'bg-muted-foreground/60'
          )}
        >
          <Settings className="size-6" />
        </Link>
      </div>
    </div>
  )
}

export default AppSideTray
