import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments
} from '@renderer/components/ai-elements/attachments'
import { usePromptInputAttachments } from '@renderer/hooks/prompt-input.hooks'
import { ComponentProps } from 'react'

export type PromptInputAttachmentsDisplayProps = ComponentProps<typeof Attachments>

//component to display the attachments in the prompt input
export const PromptInputAttachmentsDisplay = ({
  variant = 'inline',
  ...props
}: PromptInputAttachmentsDisplayProps) => {
  //get the attachments from the prompt input
  const attachments = usePromptInputAttachments()

  //if there are no attachments, return null
  if (attachments.files.length === 0) {
    return null
  }

  return (
    <Attachments variant={variant} {...props}>
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  )
}
