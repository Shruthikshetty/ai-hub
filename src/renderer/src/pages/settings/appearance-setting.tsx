import { Theme, useTheme } from '@renderer/components/theme-context'
import { ToggleGroup, ToggleGroupItem } from '@renderer/components/ui/toggle-group'
import { THEME_OPTIONS } from '@renderer/constants/screen.constants'

/**
 * Appearance tab
 * contains options for changing the themes of the app
 */
const AppearanceTab = () => {
  const { theme, setTheme } = useTheme()
  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Appearance</h1>
      <h2>Theme preferences</h2>
      <div className="flex flex-row gap-3">
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(value: Theme | '') => value && setTheme(value)}
        >
          {THEME_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="items-center justify-center border border-border p-5 min-w-10 md:min-w-20 flex flex-row gap-2"
            >
              {option.icon && <option.icon className="size-4" />}
              <p>{option.label}</p>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}

export default AppearanceTab
