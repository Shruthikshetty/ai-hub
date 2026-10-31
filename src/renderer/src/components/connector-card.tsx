import { ConnectorGetSchema, ConnectorUpdateSchema } from '@common/db-schemas/connector.schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MessageSquare, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
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
import AppModelSelector from './model-selector'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Separator } from './ui/separator'
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

/**
 * Card that display the connector details and allows to set up connections
 */
const ConnectorCard = ({
  connector,
  type = 'ADD'
}: {
  connector: Partial<Omit<ConnectorGetSchema, 'name'>> & { name: string }
  type: 'ADD' | 'UPDATE'
}) => {
  // When updating, token starts masked/locked, on ADD, it is editable
  const [isTokenEditing, setIsTokenEditing] = useState(type === 'ADD')
  const [isConnected, setConnected] = useState(false)

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
    if (isConnected) {
      stopConnectionMutation(connector.name, {
        onSuccess: () => {
          setConnected(false)
        }
      })
    } else {
      startConnectionMutation(connector.name, {
        onSuccess: () => {
          setConnected(true)
        }
      })
    }
  }

  // for used to take in the connector details
  const form = useForm({
    defaultValues: {
      botToken: connector.botToken ?? '',
      allowedUsers: connector.allowedUsers ?? [],
      modelId: connector.modelId ?? '',
      provider: connector.provider ?? '',
      systemPrompt: connector.systemPrompt ?? '',
      autoStart: connector.autoStart ?? false
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
                        modelType="chat"
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
          {/*@TODO restart the connector on change of configs create a new endpoint and a new method in the service */}
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
              isConnected
                ? 'bg-success/70! hover:bg-destructive/80! hover:text-destructive-foreground!'
                : '',
              'active:scale-95'
            )}
            onClick={handleConnection}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
            {isStartConnectorPending || isStopConnectorPending ? <Spinner /> : null}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ConnectorCard
