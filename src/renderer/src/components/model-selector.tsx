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
import { Skeleton } from './ui/skeleton'

// lets you select the various models from all the available providers
function AppModelSelector({
  output,
  disableDefaultSelection = false,
  modelType = 'chat',
  onSelect,
  disabled,
  className,
  controlled = false,
  selectedModelId,
  selectedProvider
}: {
  output?: ModelIOType
  disableDefaultSelection?: boolean
  modelType?: string
  onSelect?: (model: ModelSchemaType) => void
  disabled?: boolean
  className?: string
  controlled?: boolean
  selectedModelId?: string
  selectedProvider?: string
}) {
  // fetch all the model list
  const {
    data: modelsData,
    error,
    isSuccess,
    isLoading: modelsLoading
  } = useFetchModels({ output })
  // fetch all the provider list
  const { data: providersData, isLoading: providersLoading } = useFetchProviders()
  // get the loading state of both
  const isLoading = modelsLoading || providersLoading

  // only show providers that are enabled and not hidden
  const activeProviders = useMemo(
    () => providersData?.data?.filter((p) => p.enabled && !p.hide) ?? [],
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

  // selected model from store (only if not controlled)
  const storeModel = useSelectedModel((state) =>
    controlled ? null : (state.models[modelType] ?? null)
  )
  const setStoreModel = useSelectedModel((state) => state.setModel)

  const model = useMemo(() => {
    if (controlled) {
      if (!selectedModelId) return null
      return (
        modelsData?.data?.find(
          (m) => m.id === selectedModelId && (!selectedProvider || m.provider === selectedProvider)
        ) ?? null
      )
    }
    return storeModel
  }, [controlled, selectedModelId, selectedProvider, modelsData, storeModel])

  // set the model to the first model of the first provider
  useEffect(() => {
    // in case default selection is disabled or component is controlled
    if (disableDefaultSelection || controlled) return
    // set the model to the first model of the first provider
    if (modelsData?.data?.length && !model) {
      setStoreModel(modelType, modelsData?.data?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsData, disableDefaultSelection, controlled, modelType])

  // handle no models
  useEffect(() => {
    if (error) {
      errorToast('Error loading models check network / local instance')
    } else if (!modelsData?.data?.length && isSuccess) {
      errorToast('No models found, please add providers if not done yet')
    }
  }, [error, modelsData, isSuccess])

  return (
    <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
      <ModelSelectorTrigger asChild>
        {isLoading ? (
          <Skeleton className="w-20 h-4 rounded-sm bg-accent-foreground" />
        ) : (
          <PromptInputButton className={className} disabled={disabled}>
            <ModelSelectorLogo provider={model?.provider ?? ''} />

            {model?.name ? (
              <ModelSelectorName>{model?.name}</ModelSelectorName>
            ) : (
              <ModelSelectorName>Select a Model</ModelSelectorName>
            )}
          </PromptInputButton>
        )}
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
                    if (!controlled) {
                      setStoreModel(modelType, selected)
                    }
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
