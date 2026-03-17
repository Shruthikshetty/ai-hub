import { useEffect, useState } from 'react'
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
import useSelectedModel from '@renderer/state-management/selected-model.store'
import { ModelIOType } from '@common/schemas/model.schema'
import { AVAILABLE_PROVIDER_LIST } from '@common/constants/global.constants'

// lets you select the various models from all the available providers
function AppModelSelector({
  output,
  disableDefaultSelection = false,
  modelType = 'chat'
}: {
  output?: ModelIOType
  disableDefaultSelection?: boolean
  modelType?: string
}) {
  //@TODO show error message if no models are not loaded
  // fetch all the model list
  const { data: modelsData } = useFetchModels({ output })
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

  return (
    <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
      <ModelSelectorTrigger asChild>
        <PromptInputButton className="border">
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
          {AVAILABLE_PROVIDER_LIST.map((chef) => (
            <ModelSelectorGroup heading={chef} key={chef}>
              {modelsData?.data
                ?.filter((m) => m.provider === chef)
                ?.map((m) => (
                  <ModelItem
                    key={m.id}
                    model={m}
                    onSelect={(selected) => setModel(modelType, selected)}
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
