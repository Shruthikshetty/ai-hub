import { cn } from '@renderer/lib/utils'
import AppLogo from './app-logo'
import { Separator } from './ui/separator'
import { Settings } from 'lucide-react'
import { Link } from 'react-router'
import { SETTINGS_TRAY_ITEM, SIDE_TRAY_ITEMS } from '@renderer/constants/screen.constants'
import { useSideTray } from '@renderer/state-management/use-side-tray'

/**
 * contains the side tray of the app that has quick links to all the pages
 */
const AppSideTray = ({ className }: { className?: string }) => {
  // get the selected tab from the state
  const { selectedTab, setSelectedTab } = useSideTray()

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
        <Link to="/" onClick={() => setSelectedTab('/')}>
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
          to={SETTINGS_TRAY_ITEM.path}
          className={cn(
            'hover:cursor-pointer transition-all p-2 rounded-sm hover:bg-muted',
            selectedTab === SETTINGS_TRAY_ITEM.path && 'bg-muted-foreground/60'
          )}
          onClick={() => setSelectedTab(SETTINGS_TRAY_ITEM.path)}
        >
          <Settings className="size-6" />
        </Link>
      </div>
    </div>
  )
}

export default AppSideTray
