import { ModelGetSchema } from '@common/db-schemas/model.schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { useState } from 'react'
import { Button } from './ui/button'
import { Check, Eye, EyeOff, Minus, Star } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { ModelBadgeItem } from '@renderer/lib/model.utils'
import { Badge } from './ui/badge'

/**
 * Component to display model details
 * @param model - model to display
 * @param handleToggleFavorite - function to toggle model favorite
 * @param handleToggleVisibility - function to toggle model visibility
 * @param children - trigger element
 * @returns ModelDetailsDialog component
 */
function ModelDetailsDialog({
  model,
  capabilityBadges,
  handleToggleFavorite,
  handleToggleVisibility,
  children
}: {
  model: ModelGetSchema
  capabilityBadges?: ModelBadgeItem[]
  children: React.ReactNode
  handleToggleFavorite: () => void
  handleToggleVisibility: () => void
}) {
  const [open, setOpen] = useState(false)

  // overview details
  const overviewsDetails = [
    {
      label: 'Provider',
      value: model.providerId
    },
    {
      label: 'Origin provider',
      value: model.originProvider
    },
    {
      label: 'Model ID',
      value: model.id
    },
    {
      label: 'Canonical ID',
      value: model.canonicalId
    },
    {
      label: 'Context window',
      value: model.contextLength ? model.contextLength.toLocaleString() : 'Not listed'
    },
    {
      label: 'Max output tokens',
      value: model.maxOutputTokens ? model.maxOutputTokens.toLocaleString() : 'Not listed'
    },
    {
      label: 'Inputs',
      value: model.inputs.join(', ')
    },
    {
      label: 'Outputs',
      value: model.outputs.join(', ')
    },
    {
      label: 'Status',
      value: model.isDeprecated ? 'Deprecated' : 'Active'
    },
    {
      label: 'Source',
      value:
        model.source === 'github'
          ? 'Model catalog'
          : model.source === 'in-app'
            ? 'In-app'
            : 'Not listed'
    }
  ]

  // capabilities details
  const capabilityDetails = [
    { label: 'Vision input', supported: model.capabilities.vision },
    { label: 'Function calling', supported: model.capabilities.functionCalling },
    { label: 'Web search', supported: model.capabilities.webSearch },
    { label: 'Code execution', supported: model.capabilities.codeExecution },
    { label: 'Realtime', supported: model.capabilities.realtime },
    { label: 'Video reasoning', supported: model.capabilities.videoReasoning },
    { label: 'File input', supported: model.capabilities.fileInput },
    { label: 'Streaming', supported: model.capabilities.supportsStreaming },
    { label: 'System prompt', supported: model.capabilities.supportsSystemPrompt }
  ]

  // reasoning details (when supported)
  const reasoning = model.capabilities.reasoning
  const reasoningDetails = reasoning?.supported
    ? [
        { label: 'Type', value: reasoning.type ?? 'Not listed' },
        { label: 'Default state', value: reasoning.defaultState },
        { label: 'Can toggle off', value: reasoning.canToggleOff ? 'Yes' : 'No' },
        ...(reasoning.effortLevels?.length
          ? [{ label: 'Effort levels', value: reasoning.effortLevels.join(', ') }]
          : []),
        ...(reasoning.budgetTokens
          ? [
              {
                label: 'Budget tokens',
                value: `${reasoning.budgetTokens.min.toLocaleString()} - ${reasoning.budgetTokens.max.toLocaleString()} (default ${reasoning.budgetTokens.default.toLocaleString()})`
              }
            ]
          : [])
      ]
    : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-4 min-w-[60vw] sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{model.name}</DialogTitle>
          <DialogDescription className="font-mono text-xs">{model.id}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          {/*show fav and hidden buttons */}
          <div className="flex flex-row flex-wrap gap-3 items-center">
            <Button
              type="button"
              variant="outline"
              className={cn(
                'active:scale-95 transition-colors',
                model.isFavorite &&
                  'bg-amber-500/15! text-amber-400! border-amber-500/30! hover:bg-amber-500/20!'
              )}
              onClick={handleToggleFavorite}
              aria-label={model.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={cn(model.isFavorite && 'fill-amber-400 text-amber-400')} />
              {model.isFavorite ? 'Favorited' : 'Favorite'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn('active:scale-95 transition-colors', model.isHidden && 'bg-secondary!')}
              onClick={handleToggleVisibility}
              aria-label={model.isHidden ? 'Show in chat' : 'Hide from chat'}
            >
              {model.isHidden ? <EyeOff /> : <Eye />}
              {model.isHidden ? 'Hidden from chat' : 'Hide from chat'}
            </Button>
          </div>
          {/* description */}
          {model.description && <p>{model.description}</p>}
          {/* list of capability badges */}
          {capabilityBadges && capabilityBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {capabilityBadges.map(({ label, icon: Icon, className }) => (
                <Badge key={label} variant="outline" className={className}>
                  {Icon && <Icon />}
                  {label}
                </Badge>
              ))}
            </div>
          )}
          {/* overview */}
          <h2 className="text-sm font-semibold tracking-wide text-foreground">OVERVIEW</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overviewsDetails.map(({ label, value }) => (
              <div key={label}>
                <p>{label}</p>
                <p className="text-foreground break-all">{value}</p>
              </div>
            ))}
          </div>

          {/* capabilities */}
          <h2 className="mt-2 text-sm font-semibold tracking-wide text-foreground">CAPABILITIES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {capabilityDetails.map(({ label, supported }) => (
              <div key={label} className="flex items-center gap-2">
                {supported ? (
                  <Check className="size-4 shrink-0 text-success" />
                ) : (
                  <Minus className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className={cn(supported ? 'text-foreground' : 'text-muted-foreground')}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* reasoning */}
          <h2 className="mt-2 text-sm font-semibold tracking-wide text-foreground">REASONING</h2>
          {reasoning?.supported ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasoningDetails.map(({ label, value }) => (
                <div key={label}>
                  <p>{label}</p>
                  <p className="text-foreground capitalize">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Reasoning is not supported.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModelDetailsDialog
