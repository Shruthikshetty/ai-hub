// this file contains all the voice options by provider

export type VoiceOption = { id: string; label: string }

export const VOICE_OPTIONS: Record<string, readonly VoiceOption[]> = {
  openai: [
    { id: 'alloy', label: 'alloy' },
    { id: 'ash', label: 'ash' },
    { id: 'ballad', label: 'ballad' },
    { id: 'coral', label: 'coral' },
    { id: 'echo', label: 'echo' },
    { id: 'fable', label: 'fable' },
    { id: 'nova', label: 'nova' },
    { id: 'onyx', label: 'onyx' },
    { id: 'sage', label: 'sage' },
    { id: 'shimmer', label: 'shimmer' },
    { id: 'verse', label: 'verse' },
    { id: 'marin', label: 'marin' },
    { id: 'cedar', label: 'cedar' }
  ],
  // fetched from https://api.elevenlabs.io/v1/voices
  elevenlabs: [
    { id: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
    { id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice' },
    { id: 'hpp4J3VqNfWAUOO0d1Us', label: 'Bella' },
    { id: 'pqHfZKP75CvOlQylNhV4', label: 'Bill' },
    { id: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
    { id: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
    { id: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
    { id: 'iP95p4xoKVk53GoZ742B', label: 'Chris' },
    { id: 'onwK4e9ZLuTAKqWW03F9', label: 'Daniel' },
    { id: 'cjVigY5qzO86Huf0OWal', label: 'Eric' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
    { id: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
    { id: 'cgSgspJ2msm6clMCkdW9', label: 'Jessica' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', label: 'Laura' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
    { id: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
    { id: 'XrExE9yKIg1WjnnlVkGX', label: 'Matilda' },
    { id: 'SAz9YHcvj6GT2YYXdXww', label: 'River' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', label: 'Roger' },
    { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah' },
    { id: 'bIHbv24MWmeRgasZH58o', label: 'Will' }
  ],
  //@TODO: does not support TTS speech endpoint
  xai: [
    { id: 'ara', label: 'ara' },
    { id: 'eve', label: 'eve' },
    { id: 'leo', label: 'leo' },
    { id: 'rex', label: 'rex' },
    { id: 'sal', label: 'sal' }
  ]
} as const
