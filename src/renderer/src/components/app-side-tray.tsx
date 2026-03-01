import { cn } from '@renderer/lib/utils'
import AppLogo from './app-logo'
import { Separator } from './ui/separator'
import { Settings } from 'lucide-react'
import { Link } from 'react-router'
import { SIDE_TRAY_ITEMS } from '@renderer/constants/screen.constants'
import { useState } from 'react'

/**
 * contains the side tray of the app that has quick links to all the pages
 */
const AppSideTray = ({ className }: { className?: string }) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
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
                selectedTab === item.path && 'bg-muted-foreground/60'
              )}
              onClick={() => setSelectedTab(item.path)}
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
          to="/settings"
          className={cn(
            'hover:cursor-pointer transition-all p-2 rounded-sm hover:bg-muted',
            selectedTab === '/settings' && 'bg-muted-foreground/60'
          )}
          onClick={() => setSelectedTab('/settings')}
        >
          <Settings className="size-6" />
        </Link>
      </div>
    </div>
  )
}

export default AppSideTray
