import { MODALITIES } from '@common/constants/models.constants'
import { Modality } from '@common/db-schemas/model.schema'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { cn } from '@renderer/lib/utils'
import { useFetchModelsV2 as useFetchModels } from '@renderer/services/model'
import { useFetchProviders } from '@renderer/services/provider'
import { Eye, EyeOff, Plus, Star } from 'lucide-react'
import { useMemo, useState, useDeferredValue } from 'react'

//types
type FilterState = {
  isFavorite: boolean
  isHidden: boolean
  provider: string
  output: Modality | 'all'
  search: string
}

/**
 * catalog settings tab containing list of all models with
 * custom model configuration , favorite and hide feature
 */
function CatalogTab() {
  const [filters, setFilters] = useState<FilterState>({
    isFavorite: false,
    isHidden: false,
    provider: 'all',
    output: 'all',
    search: ''
  })
  // differ the search query to prevent multiple requests
  const searchQuery = useDeferredValue(filters.search)

  // fetch models with filters
  const { data } = useFetchModels({
    output: filters.output === 'all' ? undefined : filters.output,
    providerId: filters.provider === 'all' ? undefined : filters.provider,
    hidden: filters.isHidden ? true : undefined,
    isFavorite: filters.isFavorite ? true : undefined,
    search: searchQuery,
    sortFav: false
  })

  // fetch providers for dropdown menu
  const { data: providersData } = useFetchProviders()

  // get list of applicable providers
  const providers = useMemo(
    () => (providersData?.data ?? []).filter((p) => p.enabled && !p.hide),
    [providersData?.data]
  )

  const models = data?.data ?? []

  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5 overflow-auto">
      {/* header */}
      <div className="flex flex-row gap-5 justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold">Model Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Browse every model, mark favorites, and hide any you don&apos;t want in the chat model
            menu.
          </p>
        </div>
        {/*  Add new button  */}
        <Button
          type="button"
          variant="default"
          className="active:scale-95 sm:min-w-20 hover:bg-success! transition-colors"
          onClick={() => {}}
        >
          <Plus /> Add Custom Model
        </Button>
      </div>
      {/* search */}
      <Input
        placeholder="Search by provider, name or ID..."
        value={filters.search}
        className="py-4"
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
      />
      {/* additional filters favorite , hidden , providers */}
      <div className="flex flex-row flex-wrap gap-3 items-center">
        {/* providers dropdown */}
        <Select
          value={filters.provider}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, provider: value }))}
        >
          <SelectTrigger className="min-w-30">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.provider}>
                {provider.name || provider.provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* output modality dropdown */}
        <Select
          value={filters.output}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, output: value as Modality | 'all' }))
          }
        >
          <SelectTrigger className="min-w-30">
            <SelectValue placeholder="Output type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outputs</SelectItem>
            {MODALITIES.map((modality) => (
              <SelectItem key={modality} value={modality} className="capitalize">
                {modality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* favorite button */}
        <Button
          className={cn('active:scale-95 transition-colors', filters.isFavorite && 'bg-secondary!')}
          type="button"
          variant={'outline'}
          onClick={() => setFilters((prev) => ({ ...prev, isFavorite: !prev.isFavorite }))}
        >
          <Star className={cn(filters.isFavorite && 'fill-yellow-400 text-yellow-400')} /> Favorite
        </Button>
        {/* hidden button */}
        <Button
          className={cn('active:scale-95 transition-colors', filters.isHidden && 'bg-secondary!')}
          type="button"
          variant={'outline'}
          onClick={() => setFilters((prev) => ({ ...prev, isHidden: !prev.isHidden }))}
        >
          {filters.isHidden ? <EyeOff /> : <Eye />} Hidden from chat
        </Button>
      </div>
      {/*  list of all the models*/}
      <h2 className="text-sm text-muted-foreground">{models.length} models</h2>
      <ul>
        {models.map((model) => (
          <li key={`${model.providerId}-${model.id}`}>{model.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default CatalogTab
