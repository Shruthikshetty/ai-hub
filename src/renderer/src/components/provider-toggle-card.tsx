import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { ProviderGetSchema } from '@common/db-schemas/provider.schema'
import { Separator } from './ui/separator'
import { Switch } from './ui/switch'
import { cn } from '@renderer/lib/utils'
import { useUpdateProviderById } from '@renderer/services/provider'
import { hiddenText } from '@renderer/lib/format.utils'

export default function ProviderToggleCard({ provider }: { provider: ProviderGetSchema }) {
  const defaultValue = provider.server ? provider.serverUrl : provider.apiKey || ''
  // store the input
  const [value, setValue] = useState(defaultValue)
  // hook used to update provider
  const { mutate, isPending } = useUpdateProviderById()

  // enable a provider
  const applySettings = () => {
    mutate({
      data: {
        enabled: true,
        ...(provider.server ? { serverUrl: value } : { apiKey: value })
      },
      id: provider.id
    })
  }

  // disable a provider
  const disableProvider = () => {
    mutate(
      {
        data: {
          enabled: false,
          apiKey: '',
          serverUrl: ''
        },
        id: provider.id
      },
      {
        onSuccess: () => {
          setValue('')
        }
      }
    )
  }

  return (
    <Card
      className={cn(
        'flex flex-col p-5',
        provider.enabled ? 'bg-green-400/10 ring-green-500/50' : 'bg-muted-foreground/5'
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {provider?.icon ? (
              <img
                src={provider?.icon}
                alt={`${provider.name}-icon`}
                className="w-8 h-8 object-contain shrink-0 invert"
              />
            ) : null}
            <div className="flex flex-col gap-1.5 text-start items-start">
              <CardTitle className="text-base font-semibold leading-none">
                {provider?.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {provider?.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Separator />
          <Label
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
            htmlFor={`${provider.provider}-value`}
          >
            {provider.server ? 'API Endpoint' : 'API Key'}
          </Label>
          <Input
            placeholder={provider.server ? 'http://localhost:11434' : 'sk-...'}
            className="bg-transparent border-border/30"
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value)}
            id={`${provider.provider}-value`}
            disabled={!!provider?.enabled || isPending}
            type={provider.server ? 'text' : 'password'}
          />
          <Separator className="mt-1" />
          {provider.enabled ? (
            <div className="flex flex-row justify-between items-start gap-4">
              <p className="text-base break-all">
                {provider.server ? (
                  <span>
                    connected to : <b>{provider?.serverUrl}</b>
                  </span>
                ) : (
                  <span>
                    connected using :{' '}
                    <b>{provider?.apiKey ? hiddenText(provider?.apiKey) : 'N/A'}</b>
                  </span>
                )}
              </p>
              <Switch
                className="shrink-0"
                checked={!!provider.enabled}
                onCheckedChange={disableProvider}
              />
            </div>
          ) : (
            <div className="flex flex-row justify-start gap-2">
              <Button variant={'outline'} onClick={applySettings} disabled={!value}>
                Apply
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setValue(defaultValue)
                }}
                disabled={isPending}
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
