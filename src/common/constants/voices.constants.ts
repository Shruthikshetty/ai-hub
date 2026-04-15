// this file contains all the voice options by provider

export const VOICE_OPTIONS = {
  openai: [
    'alloy',
    'ash',
    'ballad',
    'coral',
    'echo',
    'fable',
    'nova',
    'onyx',
    'sage',
    'shimmer',
    'verse',
    'marin',
    'cedar'
  ],
  //@TODO dose not support tts speech endpoint
  xai: ['ara', 'eve', 'leo', 'rex', 'sal']
  //update the rest of the providers
} as const
