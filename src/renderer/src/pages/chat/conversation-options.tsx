import { ConversationsGetSchema } from '@common/db-schemas/conversation.schema'
import { Button } from '@renderer/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Field, FieldError, FieldGroup } from '@renderer/components/ui/field'
import { Input } from '@renderer/components/ui/input'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useUpdateConversationById } from '@renderer/services/conversation'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ConversationOptionsProps {
  conversation: ConversationsGetSchema
  onDelete: () => void
}

const ConversationOptions = ({ conversation, onDelete }: ConversationOptionsProps) => {
  // query client
  const queryClient = useQueryClient()
  // state for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  // hook for updating conversation
  const { mutate } = useUpdateConversationById()

  // form for updating conversation title
  const form = useForm({
    defaultValues: {
      title: conversation?.title ?? ''
    },
    onSubmit: ({ value }) => {
      if (!conversation?.id || !value.title.trim()) return
      mutate(
        {
          id: conversation?.id,
          data: { title: value.title }
        },
        {
          onSuccess: () => {
            // invalidated conversation list
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversationsFetch] })
            // close the dialog
            setIsEditDialogOpen(false)
          }
        }
      )
    }
  })

  return (
    <>
      {/* dropdown menu for conversation options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Conversation options"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup className="gap-0.5 flex flex-col">
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" />
              <p>Delete</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                form.reset()
                setIsEditDialogOpen(true)
              }}
            >
              <Pencil className="size-4" />
              <p>Rename</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* rename form dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="sm:max-w-[70%] lg:max-w-[50%] p-6 rounded-2xl bg-muted"
          showCloseButton={false}
        >
          <DialogHeader className="pb-4 px-0 pt-0">
            <DialogTitle className="text-xl font-medium">Rename this chat</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-6">
              <form.Field name="title">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        id={field.name}
                        aria-label="Chat title"
                        name={field.name}
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        autoFocus
                        className="bg-transparent"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
              <div className="flex justify-end gap-2 items-center mt-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    form.reset()
                    setIsEditDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={!form.state.isValid || !conversation.id}
                >
                  Rename
                </Button>
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ConversationOptions
