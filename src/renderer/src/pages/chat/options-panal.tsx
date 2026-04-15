import { PROVIDERS_WITH_SEARCH_TOOL } from '@common/constants/global.constants'
import { VOICE_OPTIONS } from '@common/constants/voices.constants'
import { FetchConversationWithMessagesResponseType } from '@common/schemas/conversation.schema'
import AppModelSelector from '@renderer/components/model-selector'
import ResizableSidePanel from '@renderer/components/resizable-side-panel'
import TokensUsedCard from '@renderer/components/tokens-used-card'
import { Button } from '@renderer/components/ui/button'
import { FieldError, FieldGroup, FieldLabel, Field } from '@renderer/components/ui/field'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { Switch } from '@renderer/components/ui/switch'
import { Textarea } from '@renderer/components/ui/textarea'
import { handleStringChange } from '@renderer/lib/form.utils'
import {
  ChatOptionsValidationSchema,
  chatOptionsValidationSchema
} from '@renderer/schemas/chat-options-validation.schema'
import { useUpdateConversationById } from '@renderer/services/conversation'
import { useFetchProviders } from '@renderer/services/provider'
import { useForm } from '@tanstack/react-form'
import { Save, Trash } from 'lucide-react'
import { memo, useEffect, useMemo } from 'react'

/**
 * This panel contains additional options that can be passed to the model
 */
const ChatOptionsPanel = ({
  conversation,
  totalTokens = 0,
  ...rest
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  conversation?: FetchConversationWithMessagesResponseType['data'] | undefined
  totalTokens?: number
}) => {
  // hook to update conversation settings
  const { mutate: updateConversationById } = useUpdateConversationById()
  // fetch the providers list
  const { data: providers } = useFetchProviders()
  // filter out the options for search which are enabled by user
  const searchProvidersOptions = useMemo(() => {
    if (!providers?.data) return []

    return providers.data.reduce<string[]>((acc, provider) => {
      if (provider.enabled && PROVIDERS_WITH_SEARCH_TOOL.has(provider.provider)) {
        acc.push(provider.provider)
      }
      return acc
    }, [])
  }, [providers])

  // create a form to update the conversation settings
  const form = useForm({
    defaultValues: {
      systemPrompt: conversation?.systemPrompt ?? null,
      tools: {
        search: {
          enabled: conversation?.tools?.search?.enabled ?? false,
          provider: conversation?.tools?.search?.provider ?? ''
        },
        profileAccess: {
          enabled: conversation?.tools?.profileAccess?.enabled ?? false
        },
        imageGeneration: {
          enabled: conversation?.tools?.imageGeneration?.enabled ?? false,
          provider: conversation?.tools?.imageGeneration?.provider ?? '',
          modelId: conversation?.tools?.imageGeneration?.modelId ?? ''
        }
      },
      additionalOptions: {
        speech: {
          enabled: conversation?.additionalOptions?.speech?.enabled ?? false,
          voice: conversation?.additionalOptions?.speech?.voice ?? undefined,
          model: {
            id: conversation?.additionalOptions?.speech?.model?.id,
            name: conversation?.additionalOptions?.speech?.model?.name,
            provider: conversation?.additionalOptions?.speech?.model?.provider
          }
        }
      },
      metadata: conversation?.metadata ?? true
    } as ChatOptionsValidationSchema,
    validators: { onSubmit: chatOptionsValidationSchema },
    onSubmit: async ({ value }) => {
      if (!conversation?.id) return
      // update the conversation settings
      updateConversationById({ id: conversation.id, data: value })
    }
  })
  // reset the form when the conversation changes this is important to sync the form with the conversation
  useEffect(() => {
    form.reset({
      systemPrompt: conversation?.systemPrompt ?? null,
      metadata: conversation?.metadata ?? true,
      additionalOptions: {
        speech: {
          enabled: conversation?.additionalOptions?.speech?.enabled ?? false,
          voice: conversation?.additionalOptions?.speech?.voice ?? undefined,
          model: conversation?.additionalOptions?.speech?.model ?? undefined
        }
      },
      tools: {
        search: {
          enabled: conversation?.tools?.search?.enabled ?? false,
          provider: conversation?.tools?.search?.provider ?? ''
        },
        profileAccess: {
          enabled: conversation?.tools?.profileAccess?.enabled ?? false
        },
        imageGeneration: {
          enabled: conversation?.tools?.imageGeneration?.enabled ?? false,
          provider: conversation?.tools?.imageGeneration?.provider ?? '',
          modelId: conversation?.tools?.imageGeneration?.modelId ?? ''
        }
      }
    })
  }, [conversation, form])

  return (
    <ResizableSidePanel {...rest}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="h-full w-full flex flex-col justify-between overflow-hidden"
      >
        {/* heading */}
        <div>
          <h1 className="text-foreground/80 font-semibold p-4">OPTIONS</h1>
          <Separator />
        </div>
        <FieldGroup className="gap-1 grow overflow-y-auto">
          {/* OPTIONS */}
          <div className="p-4 flex flex-col gap-2">
            <h2 className="text-foreground font-semibold text-sm">MODEL OPTIONS</h2>
            <form.Field name="systemPrompt">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-muted-foreground text-sm font-semibold"
                      htmlFor={field.name}
                    >
                      System Prompt
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ''}
                      placeholder="Enter system instructions for the AI..."
                      className="dark:bg-background/90 max-h-60"
                      onChange={(e) => handleStringChange(e, field.handleChange)}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
            <Label className="text-muted-foreground text-sm font-semibold" htmlFor="reasoning">
              Reasoning
            </Label>
            <Select />
          </div>
          <Separator />
          {/* Tools */}
          <div className="p-4 flex flex-col gap-2">
            <h2 className="text-foreground font-semibold text-sm">TOOLS</h2>
            {/* search tool  */}
            <form.Field name="tools.search.enabled">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <p className="text-xs text-muted-foreground">
                      ❗Note : if your provider or model does not support search tool then it will
                      not be used (some tools will only support their provider models)
                    </p>
                    <div className="flex flex-row justify-between">
                      <FieldLabel
                        className="text-muted-foreground text-sm font-semibold"
                        htmlFor={field.name}
                      >
                        Search
                      </FieldLabel>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        disabled={searchProvidersOptions.length === 0}
                        onCheckedChange={(value) => {
                          field.handleChange(value)
                          // if search is disabled, clear the provider and model
                          if (!value) {
                            form.setFieldValue('tools.search.provider', '')
                          }
                        }}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
            {/* search tool provider and model selector */}
            <form.Subscribe selector={(state) => state.values.tools.search.enabled}>
              {(isSearchEnabled) => {
                if (!isSearchEnabled) return null
                return (
                  <form.Field name="tools.search.provider">
                    {(field) => (
                      <Field className="flex flex-col gap-1 my-2 animate-in fade-in slide-in-from-top-1">
                        <Select
                          onValueChange={(value) => field.handleChange(value)}
                          value={field.state.value}
                          disabled={searchProvidersOptions.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {searchProvidersOptions.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched && field.state.meta.errors && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )}
                  </form.Field>
                )
              }}
            </form.Subscribe>

            {/* Profile Access Tool */}
            <form.Field name="tools.profileAccess.enabled">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex flex-row justify-between">
                      <FieldLabel
                        className="text-muted-foreground text-sm font-semibold"
                        htmlFor={field.name}
                      >
                        Profile Access
                      </FieldLabel>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(value) => field.handleChange(value)}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            {/* image generation tool */}
            <form.Field name="tools.imageGeneration.enabled">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        className="text-muted-foreground text-sm font-semibold"
                        htmlFor={field.name}
                      >
                        Image generation
                      </FieldLabel>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(value) => {
                          field.handleChange(value)
                          // if image generation is disabled, clear the provider and model
                          if (!value) {
                            form.setFieldValue('tools.imageGeneration.provider', '')
                            form.setFieldValue('tools.imageGeneration.modelId', '')
                          }
                        }}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
            {/* image generation tool provider and model selector */}
            <form.Subscribe selector={(state) => state.values.tools.imageGeneration.enabled}>
              {(isImageGenerationEnabled) => {
                if (!isImageGenerationEnabled) return null
                // nest field for provider and model
                return (
                  <form.Field name="tools.imageGeneration.provider">
                    {(providerField) => (
                      <form.Field name="tools.imageGeneration.modelId">
                        {(modelField) => {
                          const isProviderInvalid =
                            providerField.state.meta.isTouched && !providerField.state.meta.isValid
                          const isModelInvalid =
                            modelField.state.meta.isTouched && !modelField.state.meta.isValid
                          return (
                            <Field className="flex flex-col gap-1 my-2 animate-in fade-in slide-in-from-top-1">
                              <AppModelSelector
                                modelType="image"
                                output="image"
                                className="border border-input bg-input/30"
                                disableDefaultSelection
                                onSelect={(selected) => {
                                  providerField.handleChange(selected.provider)
                                  modelField.handleChange(selected.id)
                                }}
                              />
                              {(isModelInvalid || isProviderInvalid) && (
                                <p className="text-sm font-normal text-destructive">
                                  Please select a model
                                </p>
                              )}
                            </Field>
                          )
                        }}
                      </form.Field>
                    )}
                  </form.Field>
                )
              }}
            </form.Subscribe>
          </div>

          {/* Additional options */}
          <div className="p-4 flex flex-col gap-2">
            <h2 className="text-foreground font-semibold text-sm">ADDITIONAL OPTIONS</h2>

            {/* Speech Tool */}
            <form.Field name="additionalOptions.speech.enabled">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        className="text-muted-foreground text-sm font-semibold"
                        htmlFor={field.name}
                      >
                        Speech (Text-to-Speech)
                      </FieldLabel>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(value) => {
                          field.handleChange(value)
                          // if speech is disabled, clear the model and voice fields
                          if (!value) {
                            form.setFieldValue('additionalOptions.speech.model', undefined)
                            form.setFieldValue('additionalOptions.speech.voice', undefined)
                          }
                        }}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            {/* Speech model + voice selector — visible only when speech is enabled */}
            <form.Subscribe selector={(state) => state.values.additionalOptions.speech.enabled}>
              {(isSpeechEnabled) => {
                if (!isSpeechEnabled) return null
                return (
                  <form.Field name="additionalOptions.speech.model.provider">
                    {(providerField) => (
                      <form.Field name="additionalOptions.speech.model.id">
                        {(modelIdField) => (
                          <form.Field name="additionalOptions.speech.model.name">
                            {(modelNameField) => {
                              const isProviderInvalid =
                                providerField.state.meta.isTouched &&
                                !providerField.state.meta.isValid
                              const isModelInvalid =
                                modelIdField.state.meta.isTouched &&
                                !modelIdField.state.meta.isValid

                              // derive available voices for the selected provider
                              const selectedProvider = providerField.state.value as
                                | string
                                | undefined
                              const voiceOptions: readonly string[] =
                                selectedProvider && selectedProvider in VOICE_OPTIONS
                                  ? VOICE_OPTIONS[selectedProvider as keyof typeof VOICE_OPTIONS]
                                  : []

                              return (
                                <Field className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1">
                                  <p className="text-xs text-muted-foreground">
                                    ❗Note : if you get an error try switching the model and try
                                    selecting a voice
                                  </p>
                                  {/* Model selector */}
                                  <AppModelSelector
                                    modelType="tts"
                                    output="audio"
                                    className="border border-input bg-input/30"
                                    disableDefaultSelection
                                    onSelect={(selected) => {
                                      providerField.handleChange(selected.provider)
                                      modelIdField.handleChange(selected.id)
                                      modelNameField.handleChange(selected.name)
                                      // reset voice when provider changes
                                      form.setFieldValue(
                                        'additionalOptions.speech.voice',
                                        undefined
                                      )
                                    }}
                                  />
                                  {(isModelInvalid || isProviderInvalid) && (
                                    <p className="text-sm font-normal text-destructive">
                                      Please select a model
                                    </p>
                                  )}
                                  {/* Voice selector — only shown when provider has known voices */}
                                  {voiceOptions.length > 0 && (
                                    <form.Field name="additionalOptions.speech.voice">
                                      {(voiceField) => (
                                        <Field className="flex flex-col gap-1">
                                          <FieldLabel className="text-muted-foreground text-xs font-semibold">
                                            Voice
                                          </FieldLabel>
                                          <Select
                                            value={voiceField.state.value ?? ''}
                                            onValueChange={(value) =>
                                              voiceField.handleChange(value)
                                            }
                                          >
                                            <SelectTrigger className="border border-input bg-input/30">
                                              <SelectValue placeholder="Select a voice" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {voiceOptions.map((voice) => (
                                                <SelectItem key={voice} value={voice}>
                                                  {voice}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </Field>
                                      )}
                                    </form.Field>
                                  )}
                                </Field>
                              )
                            }}
                          </form.Field>
                        )}
                      </form.Field>
                    )}
                  </form.Field>
                )
              }}
            </form.Subscribe>
          </div>

          <Separator />
          {/* Metadata */}
          <div className="p-4 flex flex-col gap-2">
            <h2 className="text-foreground font-semibold text-sm">META DATA</h2>
            <form.Field name="metadata">
              {(field) => (
                <>
                  <Field
                    data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    className="flex flex-row justify-between"
                  >
                    <FieldLabel
                      className="text-muted-foreground text-sm font-semibold"
                      htmlFor={field.name}
                    >
                      Tokens used
                    </FieldLabel>
                    <Switch
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(value) => field.handleChange(value)}
                    />
                  </Field>
                  {/* total tokes used in conversation card */}
                  <TokensUsedCard totalTokens={totalTokens} show={field.state.value} />
                </>
              )}
            </form.Field>
          </div>
          <Separator />
        </FieldGroup>
        <div>
          <Separator />
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-2 sm:flex-row">
            <Button
              variant="destructive"
              onClick={() => form.reset()}
              type="button"
              className="p-4"
            >
              <Trash />
              Reset
            </Button>
            <Button type="submit" variant={'outline'} className="p-4">
              <Save />
              Save
            </Button>
          </div>
        </div>
      </form>
    </ResizableSidePanel>
  )
}

export default memo(ChatOptionsPanel)
