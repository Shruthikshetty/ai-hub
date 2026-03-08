import { Dispatch, SetStateAction, useState } from 'react'
import { providerType } from '@renderer/pages/settings/provider-settings'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Button } from './ui/button'

export default function ProviderToggleCard({
  provider,
  setProvider
}: {
  provider: providerType
  setProvider: Dispatch<SetStateAction<providerType[]>>
}) {
  //@TOD API actions
  const [enable, setEnabled] = useState(provider.enabled)
  // store the input @TODO later change to use form hook
  const [value, setValue] = useState(provider.server ? provider.serverUrl : provider.apiKey || '')
  // @TODO temp logic to store api key

  const applySettings = () => {
    setProvider((prev) =>
      prev.map((p) =>
        p.provider === provider.provider
          ? {
              ...p,
              enabled: enable,
              ...(provider.server ? { serverUrl: value } : { apiKey: value })
            }
          : p
      )
    )
  }

  return (
    <Card className="flex flex-col p-5 bg-muted-foreground/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {provider?.icon ? (
            <img
              src={provider?.icon}
              alt={`${provider.name}-icon`}
              className="w-8 h-8 object-contain shrink-0 invert"
            />
          ) : null}
          <Label
            className="flex flex-col gap-1.5 text-start items-start"
            htmlFor={`enable-${provider.provider}`}
          >
            <h3 className="text-base font-semibold leading-none">{provider?.name}</h3>
            <p className="text-sm text-muted-foreground">{provider?.description}</p>
          </Label>
        </div>
        <Switch
          id={`enable-${provider.provider}`}
          checked={enable}
          onCheckedChange={() => {
            setEnabled((s) => !s)
          }}
        />
      </div>

      {enable && (
        <div className="flex flex-col mt-4">
          <div className="h-px w-full bg-border/20 mb-4" />
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              {provider.server ? 'API Endpoint' : 'API Key'}
            </label>
            <Input
              placeholder={provider.server ? 'http://localhost:11434' : 'sk-...'}
              className="bg-transparent border-border/30"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="flex flex-row justify-end">
              {/* modify logic for button to appear if there is change only  */}
              <Button className="" onClick={applySettings}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
