import { Badge } from '@renderer/components/ui/badge'
import { QUICK_PROMPTS } from '@renderer/constants/screen.constants'
import { Bot } from 'lucide-react'

/**
 * rendered in the chat screen when there is no conversation
 */
function ChatStarter({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-3 h-full">
      <div className="w-16 h-16 rounded-full bg-linear-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto  shadow-lg">
        <Bot size={32} className="text-white" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Start a Conversation</h1>
      <p className="text-base text-muted-foreground/80">
        Ask me anything! I&apos;m here to help with questions, brainstorming, writing, analysis, and
        much more.
      </p>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground ">QUICK PROMPTS</h2>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSelect(prompt)}
              aria-label={prompt}
              type="button"
              className="hover:cursor-pointer"
            >
              <Badge variant="secondary" className="p-3 text-xs hover:bg-secondary/80">
                {prompt}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatStarter
