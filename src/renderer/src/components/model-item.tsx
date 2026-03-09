import { CheckIcon } from 'lucide-react'
import { memo, useCallback } from 'react'
import {
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName
} from './ai-elements/model-selector'
import { ModelSchemaType } from '@common/schemas/model.schema'

const ModelItem = ({
  model,
  selectedModel,
  onSelect
}: {
  model: ModelSchemaType
  selectedModel: ModelSchemaType | null
  onSelect: (model: ModelSchemaType) => void
}) => {
  const handleSelect = useCallback(() => onSelect(model), [onSelect, model])

  if (!selectedModel) return null
  return (
    <ModelSelectorItem key={model.id} onSelect={handleSelect} value={model.id}>
      <ModelSelectorLogo provider={model.provider} />
      <ModelSelectorName>{model.name}</ModelSelectorName>
      {selectedModel?.id === model.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  )
}

export default memo(ModelItem)
