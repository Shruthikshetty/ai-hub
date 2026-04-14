import { Check, CopyIcon } from 'lucide-react'
import { MessageAction } from './ai-elements/message'
import { AppUIMessage } from '@common/schemas/messages.schema'
import { getMessageText } from '@renderer/lib/conversation.utils'
import { useState } from 'react'

/**
 * Copy action to copy message content to clipboard
 * @param message - message to copy
 * @returns Copy action component
 */
const CopyMessageAction = ({ message }: { message: AppUIMessage }) => {
  const [copied, setCopied] = useState(false)

  // function to handle copy to clipboard
  const handleCopy = async (content: string) => {
    try {
      // copy to clipboard
      await navigator.clipboard.writeText(content)
      setCopied(true)
    } catch {
      // in case of error show copy icon
      setCopied(false)
    }
  }

  // if copied show ticket check icon else copy icon
  if (copied) {
    return (
      <MessageAction
        label="Copy"
        onClick={() => {
          handleCopy(getMessageText(message))
        }}
        tooltip="Copy to clipboard"
      >
        <Check className="size-4" />
      </MessageAction>
    )
  } else {
    // if not copied show copy icon
    return (
      <MessageAction
        label="Copy"
        onClick={() => {
          handleCopy(getMessageText(message))
        }}
        tooltip="Copy to clipboard"
      >
        <CopyIcon className="size-4" />
      </MessageAction>
    )
  }
}

export default CopyMessageAction
