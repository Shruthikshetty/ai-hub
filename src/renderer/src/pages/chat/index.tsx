import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from '@renderer/components/ai-elements/prompt-input'
import { GlobeIcon } from 'lucide-react'
import { useState } from 'react'

// this is the chat page contains all the chat interface
const ChatPage = () => {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gpt-4o-mini')
  const handleSubmit = () => {
    console.log('submit')
  }

  const models = [
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o-mini'
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o'
    },
    {
      id: 'gpt-4.1',
      name: 'GPT-4.1'
    }
  ]
  return (
    <div>
      <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
        <PromptInputBody>
          <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputButton tooltip={{ content: 'Search the web', shortcut: '⌘K' }}>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputSelect
              onValueChange={(value) => {
                setModel(value)
              }}
              value={model}
            >
              <PromptInputSelectTrigger>
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {models.map((model) => (
                  <PromptInputSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!text && !status} status={'ready'} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

export default ChatPage
