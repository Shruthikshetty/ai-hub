import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'
import { Eye, EyeOff, Plus, Star } from 'lucide-react'
import { useState } from 'react'

//types
type FilterState = {
  isFavorite: boolean
  isHidden: boolean
  provider: string
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
    provider: '',
    search: ''
  })

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
      {/* additional filters favorite , hidden , providers */}
      <div className="flex flex-row gap-5 items-center">
        {/* providers dropdown */}
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
    </div>
  )
}

export default CatalogTab
