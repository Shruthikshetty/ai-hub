import { useEffect, useMemo, useState } from 'react'
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger
} from './ai-elements/model-selector'
import { PromptInputButton } from './ai-elements/prompt-input'
import ModelItem from './model-item'
import { useFetchModels } from '@renderer/services/model'
import { useFetchProviders } from '@renderer/services/provider'
import useSelectedModel from '@renderer/state-management/selected-model.store'
import { ModelIOType, ModelSchemaType } from '@common/schemas/model.schema'

import { errorToast } from '@renderer/lib/toast-wrapper'

// lets you select the various models from all the available providers
function AppModelSelector({
  output,
  disableDefaultSelection = false,
  modelType = 'chat',
  onSelect,
  className
}: {
  output?: ModelIOType
  disableDefaultSelection?: boolean
  modelType?: string
  onSelect?: (model: ModelSchemaType) => void
  className?: string
}) {
  // fetch all the model list
  const { data: modelsData, error, isSuccess } = useFetchModels({ output })
  const { data: providersData } = useFetchProviders()

  // only show providers that are enabled
  const activeProviders = useMemo(
    () => providersData?.data?.filter((p) => p.enabled) ?? [],
    [providersData]
  )

  //Group models once O(M) instead of filtering in the render loop O(P*M) this
  const modelsByProvider = useMemo(() => {
    const groups: Record<string, ModelSchemaType[]> = {}
    modelsData?.data?.forEach((m) => {
      if (!groups[m.provider]) groups[m.provider] = []
      groups[m.provider].push(m)
    })
    return groups
  }, [modelsData])

  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  // selected model
  const { getModel, setModel } = useSelectedModel()
  const model = getModel(modelType)

  // set the model to the first model of the first provider
  useEffect(() => {
    // in case default selection is disabled
    if (disableDefaultSelection) return
    // set the model to the first model of the first provider
    if (modelsData?.data?.length && !model) {
      setModel(modelType, modelsData?.data?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsData, disableDefaultSelection, modelType])

  // handle no models
  useEffect(() => {
    if (error) {
      errorToast('Error loading models check network / local instance')
    } else if (!modelsData?.data?.length && isSuccess) {
      errorToast('No models found please add providers id not done yet')
    }
  }, [error, modelsData, isSuccess])

  return (
    <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
      <ModelSelectorTrigger asChild>
        <PromptInputButton className={className}>
          <ModelSelectorLogo provider={model?.provider ?? ''} />

          {model?.name ? (
            <ModelSelectorName>{model?.name}</ModelSelectorName>
          ) : (
            <ModelSelectorName>Select a Model</ModelSelectorName>
          )}
        </PromptInputButton>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          {activeProviders.map((provider) => (
            <ModelSelectorGroup
              heading={provider.name ?? provider.provider}
              key={provider.provider}
            >
              {modelsByProvider[provider.provider]?.map((m) => (
                <ModelItem
                  key={`${m.provider}-${m.id}`}
                  model={m}
                  onSelect={(selected) => {
                    setModel(modelType, selected)
                    onSelect?.(selected)
                  }}
                  selectedModel={model}
                />
              ))}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  )
}

export default AppModelSelector
