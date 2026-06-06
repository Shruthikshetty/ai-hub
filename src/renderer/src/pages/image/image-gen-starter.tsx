import { Alert, AlertDescription, AlertTitle } from '@renderer/components/ui/alert'
import { QUICK_IMAGE_PROMPTS } from '@renderer/constants/screen.constants'
import { AlertCircleIcon, Sparkles } from 'lucide-react'

/**
 * Rendered in the image screen when there is no image generated yet
 */
function ImageGenStarter({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-col items-center h-full w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-8 grow overflow-y-auto">
      <div className="my-auto w-full flex flex-col items-center gap-6">
        {/* Icon with beautiful gradient background */}
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shrink-0">
          <Sparkles size={32} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground tracking-tight shrink-0">
          Bring Your Ideas to Life
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed max-w-md shrink-0">
          Describe what you want to see, select your model, and watch your words transform into
          high-quality images.
        </p>

        {/* Note*/}
        <Alert variant={'destructive'} className="bg-orange-300/5 w-full max-w-2xl shrink-0">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Please select an image generation model. If your current provider does not have image
            generation support, please add or configure a supported provider in Settings.
          </AlertDescription>
        </Alert>

        {/* Suggested Prompts Section */}
        <div className="flex flex-col gap-3 mt-2 w-full shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/75">
            SUGGESTED PROMPTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {QUICK_IMAGE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onSelect(prompt)}
                aria-label={prompt}
                type="button"
                className="hover:cursor-pointer text-left w-full transition-all duration-200 active:scale-98 bg-accent/5 border border-border/50 rounded-lg p-3 hover:bg-accent/10 hover:border-accent/30 text-xs md:text-sm text-muted-foreground hover:text-foreground flex items-start gap-2 h-full"
              >
                <span className="text-accent font-semibold">➔</span>
                <p className="line-clamp-3 leading-normal">{prompt}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGenStarter
