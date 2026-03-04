import { Button } from '@renderer/components/ui/button'
import { SETTINGS_TABS } from '@renderer/constants/screen.constants'
import { cn } from '@renderer/lib/utils'
import { useState } from 'react'

/**
 * Settings page
 */
function Settings(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState<string>(SETTINGS_TABS[0].name)

  return (
    <div className="flex flex-col h-full w-full">
      {/* header */}
      <div className="px-5 py-2 border-border border-b">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, AI providers, and application settings
        </p>
      </div>
      {/* tabs */}
      <div className="w-35 bg-sidebar-accent h-full pt-10 md:w-40 lg:w-48 lg:pt-12">
        {/* tab buttons */}
        <div className="flex flex-col gap-2 p-2 md:gap-3">
          {SETTINGS_TABS.map((tab) => (
            <Button
              key={tab.name}
              variant={'ghost'}
              className={cn(
                'text-foreground p-4 text-start w-full flex items-center gap-2 justify-start hover:bg-primary/20! md:gap-3',
                selectedTab === tab.name && 'bg-primary/30'
              )}
              onClick={() => setSelectedTab(tab.name)}
            >
              <p className="flex items-center justify-center">
                <tab.icon className="size-4 md:size-5" />
              </p>
              <p>{tab.name}</p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Settings
