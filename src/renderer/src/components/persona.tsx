'use client'

import { cn } from '../lib/utils'
import { memo } from 'react'

export type PersonaState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'asleep'

interface PersonaProps {
  state: PersonaState
  className?: string
  variant?: string
}

export const Persona = memo(({ state = 'idle', className }: PersonaProps) => {
  const isAsleep = state === 'asleep'
  const isListening = state === 'listening'
  const isThinking = state === 'thinking'
  const isSpeaking = state === 'speaking'
  const isIdle = state === 'idle'

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer ambient glow */}
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-primary/30 blur-2xl transition-all duration-1000',
          isAsleep ? 'opacity-10 scale-90' : '',
          isIdle ? 'opacity-40 animate-pulse' : '',
          isListening ? 'opacity-80 scale-125 transition-transform duration-300' : '',
          isThinking ? 'opacity-60 scale-110' : '',
          isSpeaking ? 'opacity-90 scale-150 animate-pulse' : ''
        )}
      />

      {/* Pinging/expanding ripples */}
      {isListening && (
        <div className="absolute inset-1 rounded-full border-2 border-primary/50 animate-ping opacity-0" />
      )}

      {/* Spinning rings for thinking */}
      <div
        className={cn(
          'absolute inset-3 rounded-full border-[3px] border-transparent transition-all duration-500',
          isThinking && 'border-t-primary/80 border-b-primary/80 animate-spin',
          isSpeaking && 'border-primary/50 animate-pulse scale-125'
        )}
      />

      {/* Reverse spinning ring */}
      <div
        className={cn(
          'absolute inset-5 rounded-full border-2 border-transparent transition-all duration-500',
          isThinking &&
            'border-r-primary/70 border-l-primary/70 animate-[spin_1.5s_linear_infinite_reverse]',
          isSpeaking && 'border-t-primary/70 border-b-primary/70 animate-spin scale-110'
        )}
      />

      {/* Solid Core Orb */}
      <div
        className={cn(
          'relative w-1/2 h-1/2 rounded-full shadow-xl shadow-primary/50 overflow-hidden transition-all duration-300',
          isAsleep
            ? 'bg-muted border border-muted-foreground/20 shadow-none'
            : isListening
              ? 'bg-primary scale-110 shadow-primary/80 shadow-2xl blur-[1px]'
              : isSpeaking
                ? 'bg-primary scale-95 blur-[1px]'
                : 'bg-primary' // idle and thinking
        )}
      >
        {/* Core highlight gradient for a 3D sphere illusion */}
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-black/40 via-transparent to-white/50" />
      </div>
    </div>
  )
})

Persona.displayName = 'Persona'
