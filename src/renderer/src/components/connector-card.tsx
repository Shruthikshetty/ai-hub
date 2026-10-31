import { ConnectorGetSchema } from '@common/db-schemas/connector.schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MessageSquare } from 'lucide-react'
import { Button } from './ui/button'
import { useForm } from '@tanstack/react-form'
import {
  connectorFormValidationSchema,
  ConnectorFormValidationSchemaType
} from '@renderer/schemas/connectors-validatoin.schema'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@renderer/components/ui/field'
import { Input } from './ui/input'
import { MultiInput } from './ui/multi-input'
import AppModelSelector from './model-selector'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'

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
    onSubmit: async () => {
      switch (type) {
        case 'ADD':
          //@TOD
          break
        case 'UPDATE':
        //@TODO
      }
    }
  })

  return (
    <Card className="pt-0 shrink-0">
      <CardHeader className="bg-muted/50 mt-0 py-3 border-b">
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
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    placeholder="token"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    Enter the bot authentication token (e.g. from @BotFather on Telegram).
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
          {/*@TODO will have apply and delete */}
          <Button variant={'default'} className="active:scale-95">
            Apply
          </Button>
          {/*@TODO will change color when connected */}
          <Button variant={'outline'}>connect</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ConnectorCard
