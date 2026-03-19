import { FetchConversationWithMessagesResponseType } from '@common/schemas/conversation.schema'
import ResizableSidePanel from '@renderer/components/resizable-side-panel'
import TokensUsedCard from '@renderer/components/tokens-used-card'
import { Button } from '@renderer/components/ui/button'
import { FieldError, FieldGroup, FieldLabel, Field } from '@renderer/components/ui/field'
import { Label } from '@renderer/components/ui/label'
import { Select } from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { Switch } from '@renderer/components/ui/switch'
import { Textarea } from '@renderer/components/ui/textarea'
import { handleStringChange } from '@renderer/lib/form.utils'
import {
  ChatOptionsValidationSchema,
  chatOptionsValidationSchema
} from '@renderer/schemas/chat-options-validation.schema'
import { useUpdateConversationById } from '@renderer/services/conversation'
import { useForm } from '@tanstack/react-form'
import { Save, Trash } from 'lucide-react'
import { memo, useEffect } from 'react'

//@TODO add the rest of the options later
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
  // create a form to update the conversation settings
  const form = useForm({
    defaultValues: {
      systemPrompt: conversation?.systemPrompt ?? null,
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
      metadata: conversation?.metadata ?? true
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
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm font-semibold" htmlFor="search">
                Search
              </Label>
              <Switch id="search" />
            </div>
            <div className="flex items-center justify-between">
              <Label
                className="text-muted-foreground text-sm font-semibold"
                htmlFor="image-generation"
              >
                Image generation
              </Label>
              <Switch id="image-generation" />
            </div>
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
