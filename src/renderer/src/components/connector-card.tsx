import { ConnectorUpdateSchema } from '@common/db-schemas/connector.schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MessageSquare, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useForm } from '@tanstack/react-form'
import { useState, useMemo } from 'react'
import {
  connectorFormValidationSchema,
  ConnectorFormValidationSchemaType
} from '@renderer/schemas/connectors-validation.schema'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@renderer/components/ui/field'
import { Input } from './ui/input'
import { MultiInput } from './multi-input'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Separator } from './ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import {
  useAddConnector,
  useDeleteConnector,
  useStartConnector,
  useStopConnector,
  useUpdateConnector
} from '@renderer/services/connectors'
import { maskedText } from '@renderer/lib/format.utils'
import { cn } from '@renderer/lib/utils'
import { Spinner } from './ui/spinner'
import { FetchAllConnectorResponseSchemaType } from '@common/schemas/connector.schema'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { handleNumberChangeWithNull } from '@renderer/lib/form.utils'
import { useFetchProviders } from '@renderer/services/provider'
import { PROVIDERS_WITH_SEARCH_TOOL } from '@common/constants/global.constants'
import { VOICE_OPTIONS } from '@common/constants/voices.constants'
import AppModelSelector from '@renderer/components/model-selector'

/**
 * Card that display the connector details and allows to set up connections
 */
const ConnectorCard = ({
  connector,
  type = 'ADD'
}: {
  connector: Partial<Omit<FetchAllConnectorResponseSchemaType['data'][0], 'name'>> & {
    name: string
  }
  type: 'ADD' | 'UPDATE'
}) => {
  // When updating, token starts masked/locked, on ADD, it is editable
  const [isTokenEditing, setIsTokenEditing] = useState(type === 'ADD')

  // connector hooks
  const { mutate: addConnectorMutation } = useAddConnector()
  const { mutate: updateConnectorMutation } = useUpdateConnector()
  const { mutate: deleteConnectorMutation, isPending: isDeleteConnectorPending } =
    useDeleteConnector()

  // hooks for connection
  const { mutate: startConnectionMutation, isPending: isStartConnectorPending } =
    useStartConnector()
  const { mutate: stopConnectionMutation, isPending: isStopConnectorPending } = useStopConnector()

  // function to handle connection
  const handleConnection = () => {
    // stop or start the connector
    if (connector.isRunning) {
      stopConnectionMutation(connector.name)
    } else {
      startConnectionMutation(connector.name)
    }
  }

  // fetch the providers list for search tool
  const { data: providers } = useFetchProviders()
  // filter out the options for search which are enabled by user
  const searchProvidersOptions = useMemo(() => {
    if (!providers?.data) return []

    return providers.data.reduce<string[]>((acc, provider) => {
      if (provider.enabled && !provider.hide && PROVIDERS_WITH_SEARCH_TOOL.has(provider.provider)) {
        acc.push(provider.provider)
      }
      return acc
    }, [])
  }, [providers])

  // for used to take in the connector details
  const form = useForm({
    defaultValues: {
      botToken: connector.botToken ?? '',
      allowedUsers: connector.allowedUsers ?? [],
      modelId: connector.modelId ?? '',
      provider: connector.provider ?? '',
      systemPrompt: connector.systemPrompt ?? '',
      messageLimit: connector.messageLimit ?? null,
      autoStart: connector.autoStart ?? false,
      tools: {
        search: {
          enabled: connector.tools?.search?.enabled ?? false,
          provider: connector.tools?.search?.provider ?? ''
        },
        profileAccess: {
          enabled: connector.tools?.profileAccess?.enabled ?? false
        },
        imageGeneration: {
          enabled: connector.tools?.imageGeneration?.enabled ?? false,
          provider: connector.tools?.imageGeneration?.provider ?? '',
          modelId: connector.tools?.imageGeneration?.modelId ?? ''
        }
      },
      additionalOptions: {
        speech: {
          enabled: connector.additionalOptions?.speech?.enabled ?? false,
          voice: connector.additionalOptions?.speech?.voice ?? undefined,
          model: connector.additionalOptions?.speech?.model ?? undefined
        }
      }
    } as ConnectorFormValidationSchemaType,
    validators: { onSubmit: connectorFormValidationSchema },
    onSubmit: async ({ value }) => {
      switch (type) {
        case 'ADD':
          addConnectorMutation({
            ...value,
            name: connector.name,
            description: connector.description,
            displayName: connector.displayName
          })
          break
        case 'UPDATE': {
          const { botToken, ...rest } = value
          const updatePayload: ConnectorUpdateSchema = {
            ...rest,
            ...(isTokenEditing && botToken ? { botToken } : {})
          }
          updateConnectorMutation({
            connector: updatePayload,
            name: connector.name
          })
          break
        }
      }
    }
  })

  return (
    <Card className="pt-0 shrink-0">
      <CardHeader className="bg-muted/50 mt-0 py-3 border-b">
        <div className="flex-row flex justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            {/* icon  */}
            <div className="p-2 bg-muted-foreground/20 rounded-md">
              <MessageSquare className="size-5" />
            </div>
            <div className="gap-1 flex flex-col">
              <CardTitle>{connector.displayName}</CardTitle>
              <CardDescription>{connector.description}</CardDescription>
            </div>
          </div>
          {/* trash icon */}
          {type === 'UPDATE' ? (
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-destructive p-5 hover:text-destructive active:scale-95 hover:border hover:bg-accent-foreground/10!"
              disabled={
                isStartConnectorPending || isStopConnectorPending || isDeleteConnectorPending
              }
              onClick={() => {
                deleteConnectorMutation(connector.name)
              }}
            >
              <Trash2 className="size-5" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <h2 className="text-muted-foreground text-base font-bold">ACCESS</h2>
          <form.Field name="botToken">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Bot Token</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={
                        !isTokenEditing ? maskedText(field.state.value) : (field.state.value ?? '')
                      }
                      onBlur={field.handleBlur}
                      disabled={!isTokenEditing}
                      placeholder={'token'}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {type === 'UPDATE' && (
                      <Button
                        type="button"
                        variant="outline"
                        className="active:scale-95 sm:min-w-20"
                        onClick={() => {
                          if (isTokenEditing) {
                            setIsTokenEditing(false)
                            field.handleChange(connector.botToken ?? '')
                          } else {
                            setIsTokenEditing(true)
                            field.handleChange('')
                          }
                        }}
                      >
                        {isTokenEditing ? 'Reset' : 'Clear'}
                      </Button>
                    )}
                  </div>
                  <FieldDescription>
                    {isTokenEditing
                      ? 'Enter the bot authentication token (e.g. from @BotFather on Telegram).'
                      : 'Token is encrypted and saved. Click "Clear" to change it.'}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="allowedUsers">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Allowed User IDs</FieldLabel>
                  <MultiInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="e.g. 12345678"
                    filterFn={(val) => val.replace(/\D/g, '')}
                  />
                  <FieldDescription className="truncate">
                    Numeric user IDs allowed to chat with the bot. Leave empty to allow all.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <h2 className="text-muted-foreground text-base font-bold">OPTIONS</h2>
          {/* Model selection for chat */}
          <form.Field name="provider">
            {(providerField) => (
              <form.Field name="modelId">
                {(modelField) => {
                  const isProviderInvalid =
                    providerField.state.meta.isTouched && !providerField.state.meta.isValid
                  const isModelInvalid =
                    modelField.state.meta.isTouched && !modelField.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isProviderInvalid || isModelInvalid}
                      className="flex flex-col gap-1"
                    >
                      <FieldLabel>Chat Model</FieldLabel>
                      <AppModelSelector
                        controlled
                        selectedModelId={modelField.state.value}
                        selectedProvider={providerField.state.value}
                        output="text"
                        className="border border-input bg-input/30"
                        disableDefaultSelection
                        onSelect={(selected) => {
                          providerField.handleChange(selected.provider)
                          modelField.handleChange(selected.id)
                        }}
                      />
                      <FieldDescription className="truncate">
                        The AI model that answers queries from this connector.
                      </FieldDescription>
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
          {/* optional sys prompt */}
          <form.Field name="systemPrompt">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>System prompt</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    placeholder="Enter system instructions for the AI..."
                    className="dark:bg-background/90 max-h-60"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="additional-options" className="border-none">
              <AccordionTrigger className="text-muted-foreground text-base font-bold hover:no-underline py-2 cursor-pointer hover:text-foreground transition-colors">
                ADDITIONAL OPTIONS
              </AccordionTrigger>
              <AccordionContent className="pt-2 flex flex-col gap-4">
                {/* optional message limit */}
                <form.Field name="messageLimit">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Message limit</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={1}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          placeholder="e.g. 10 (leave empty for unlimited)"
                          onChange={(e) => handleNumberChangeWithNull(e, field.handleChange)}
                        />
                        <FieldDescription className="line-clamp-2">
                          Maximum number of previous messages sent to AI as context (empty for
                          unlimited).
                        </FieldDescription>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </form.Field>
                {/* Search tool */}
                <form.Field name="tools.search.enabled">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex flex-row items-center justify-between">
                          <FieldLabel className="text-sm font-semibold" htmlFor={field.name}>
                            Search
                          </FieldLabel>
                          <Switch
                            id={field.name}
                            name={field.name}
                            className="shrink-0"
                            checked={field.state.value}
                            onCheckedChange={(value) => {
                              field.handleChange(value)
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

                {/* Provider search options selector */}
                <form.Subscribe selector={(state) => state.values.tools?.search?.enabled}>
                  {(isSearchEnabled) => {
                    if (!isSearchEnabled) return null
                    return (
                      <form.Field name="tools.search.provider">
                        {(field) => (
                          <Field className="flex flex-col gap-1 my-1 animate-in fade-in slide-in-from-top-1">
                            <Select
                              onValueChange={(value) => field.handleChange(value)}
                              value={field.state.value}
                              disabled={searchProvidersOptions.length === 0}
                            >
                              <SelectTrigger className="w-full">
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
                            <p className="text-xs text-muted-foreground mt-3">
                              ❗Note : if your provider or model does not support search tool then
                              it will not be used (some tools will only support their provider
                              models)
                            </p>
                          </Field>
                        )}
                      </form.Field>
                    )
                  }}
                </form.Subscribe>

                {/* Image generation tool */}
                <form.Field name="tools.imageGeneration.enabled">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex flex-row items-center justify-between">
                          <FieldLabel className=" text-sm font-semibold" htmlFor={field.name}>
                            Image generation
                          </FieldLabel>
                          <Switch
                            id={field.name}
                            name={field.name}
                            className="shrink-0"
                            checked={field.state.value}
                            onCheckedChange={(value) => {
                              field.handleChange(value)
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

                {/* Image model selector */}
                <form.Subscribe selector={(state) => state.values.tools?.imageGeneration?.enabled}>
                  {(isImageGenerationEnabled) => {
                    if (!isImageGenerationEnabled) return null
                    return (
                      <form.Field name="tools.imageGeneration.provider">
                        {(providerField) => (
                          <form.Field name="tools.imageGeneration.modelId">
                            {(modelField) => {
                              const isProviderInvalid =
                                providerField.state.meta.isTouched &&
                                !providerField.state.meta.isValid
                              const isModelInvalid =
                                modelField.state.meta.isTouched && !modelField.state.meta.isValid
                              return (
                                <Field className="flex flex-col gap-1 my-1 animate-in fade-in slide-in-from-top-1">
                                  <AppModelSelector
                                    modelType="image"
                                    output="image"
                                    className="border border-input bg-input/30"
                                    disableDefaultSelection
                                    controlled
                                    selectedModelId={modelField.state.value}
                                    selectedProvider={providerField.state.value}
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

                {/* Speech toggle */}
                <form.Field name="additionalOptions.speech.enabled">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex flex-row items-center justify-between">
                          <FieldLabel className="text-sm font-semibold" htmlFor={field.name}>
                            Speech (Text-to-Speech)
                          </FieldLabel>
                          <Switch
                            id={field.name}
                            name={field.name}
                            className="shrink-0"
                            checked={field.state.value}
                            onCheckedChange={(value) => {
                              field.handleChange(value)
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
                {/* Speech model and voice selector */}
                <form.Subscribe
                  selector={(state) => state.values.additionalOptions?.speech?.enabled}
                >
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

                                  const selectedProvider = providerField.state.value as
                                    string | undefined
                                  const voiceOptions: readonly { id: string; label: string }[] =
                                    selectedProvider && selectedProvider in VOICE_OPTIONS
                                      ? VOICE_OPTIONS[
                                          selectedProvider as keyof typeof VOICE_OPTIONS
                                        ]
                                      : []

                                  return (
                                    <Field className="flex flex-col gap-2 my-1 animate-in fade-in slide-in-from-top-1">
                                      <p className="text-xs text-muted-foreground">
                                        ❗Note : if you get an error try switching the model and try
                                        selecting a voice (only openai is supported currently)
                                      </p>
                                      <AppModelSelector
                                        modelType="tts"
                                        output="audio"
                                        className="border border-input bg-input/30"
                                        disableDefaultSelection
                                        controlled
                                        selectedModelId={modelIdField.state.value}
                                        selectedProvider={providerField.state.value}
                                        onSelect={(selected) => {
                                          providerField.handleChange(selected.provider)
                                          modelIdField.handleChange(selected.id)
                                          modelNameField.handleChange(selected.name)
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
                                                <SelectTrigger className="border border-input bg-input/30 w-full">
                                                  <SelectValue placeholder="Select a voice" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {voiceOptions.map((voice) => (
                                                    <SelectItem key={voice.id} value={voice.id}>
                                                      {voice.label}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />
          {/* auto start field */}
          <form.Field name="autoStart">
            {(field) => {
              return (
                <Field data-invalid={false}>
                  <div className="flex flex-row gap-5 items-center">
                    <FieldLabel htmlFor={field.name}>Auto start</FieldLabel>
                    <Switch
                      className="shrink-0"
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                  </div>
                  <p className="text-muted-foreground">
                    Connect this bot automatically when the app opens.
                  </p>
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        {/*  text*/}
        <p className="text-muted-foreground">Fill in the required fields to continue</p>
        {/* button for connect and apply */}
        <div className="gap-2 flex flex-row">
          <Button
            variant={'default'}
            className="active:scale-95"
            type="submit"
            onClick={() => form.handleSubmit()}
          >
            Apply
          </Button>
          <Button
            disabled={isStartConnectorPending || isStopConnectorPending}
            variant={'outline'}
            className={cn(
              connector.isRunning
                ? 'bg-success/70! hover:bg-destructive/80! hover:text-destructive-foreground!'
                : '',
              'active:scale-95'
            )}
            onClick={handleConnection}
          >
            {connector.isRunning ? 'Connected' : 'Disconnected'}
            {isStartConnectorPending || isStopConnectorPending ? <Spinner /> : null}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ConnectorCard
