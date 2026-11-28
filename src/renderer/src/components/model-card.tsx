import { ModelGetSchema } from '@common/db-schemas/model.schema'
import { getModelBadges } from '@renderer/lib/model.utils'
import { cn } from '@renderer/lib/utils'
import { Eye, EyeOff, Star } from 'lucide-react'
import { useMemo } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

function ModelCard({ model }: { model: ModelGetSchema }) {
  // get model badges from model
  const capabilityBadges = useMemo(() => getModelBadges(model), [model])

  return (
    <Card className={cn(model.isHidden && 'opacity-60')}>
      <CardContent>
        <div className="flex flex-row items-start justify-between gap-5">
          {/* details */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-base font-semibold leading-tight">{model.name}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{model.id}</p>
            {model.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{model.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {capabilityBadges.map(({ label, icon: Icon, className }) => (
                <Badge key={label} variant="outline" className={className}>
                  {Icon && <Icon />}
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* fav and hide button */}
          <div className="flex shrink-0 flex-row items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={model.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={cn(
                  'text-muted-foreground',
                  model.isFavorite && 'fill-yellow-400 text-yellow-400'
                )}
              />
            </Button>
            <Button
              type="button"
              variant={model.isHidden ? 'secondary' : 'ghost'}
              size="icon"
              aria-label={model.isHidden ? 'Show in chat' : 'Hide from chat'}
            >
              {model.isHidden ? (
                <EyeOff className="text-muted-foreground" />
              ) : (
                <Eye className="text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ModelCard
