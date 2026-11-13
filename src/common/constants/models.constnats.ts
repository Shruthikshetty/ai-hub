import { ModelSchemaType } from '../schemas/model.schema'

/**
 * OpenAI unlisted / missing models that are not returned by `GET https://api.openai.com/v1/models`.
 *
 * Reference links to check and update model details in the future:
 * - OpenAI Models Documentation: https://platform.openai.com/docs/models
 * - OpenAI Video Generation Guide: https://platform.openai.com/docs/guides/video-generation
 * - OpenAI API Reference: https://platform.openai.com/docs/api-reference/models
 */
export const OPENAI_UNLISTED_MODELS: ModelSchemaType[] = [
  {
    id: 'sora-2',
    name: 'Sora 2',
    provider: 'openai',
    inputs: ['text'],
    outputs: ['video'],
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  },
  {
    id: 'sora-2-pro',
    name: 'Sora 2 Pro',
    provider: 'openai',
    inputs: ['text'],
    outputs: ['video'],
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  },
  {
    id: 'sora',
    name: 'Sora',
    provider: 'openai',
    inputs: ['text'],
    outputs: ['video'],
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  }
]

/**
 * Vertex AI Gemini & Foundation models list for Google Vertex AI (Express Mode).
 *
 * Official Documentation & Model Garden References:
 * - Vertex AI Model Garden: https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models
 * - Vertex AI Foundation Models: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models
 * - Google DeepMind Gemini Reference: https://ai.google.dev/gemini-api/docs/models/gemini
 */
export const VERTEX_STATIC_MODELS: ModelSchemaType[] = [
  // Gemini 4 Element Series (Agent Platform / Express)
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },
  {
    id: 'gemini-4-hydrogen',
    name: 'Gemini 4 Hydrogen',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },
  {
    id: 'gemini-4-carbon',
    name: 'Gemini 4 Carbon (Billing Required)',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },

  // --- Gemini 3 Series ---
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    provider: 'google-vertex',
    inputs: ['text', 'image', 'video', 'audio', 'file'],
    outputs: ['text'],
    capabilities: {
      vision: true,
      videoReasoning: true,
      realtime: false
    }
  },

  // --- Image Generation Models ---
  {
    id: 'gemini-nano-banana-2.1',
    name: 'Gemini Nano Banana 2.1',
    provider: 'google-vertex',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  },

  // --- TTS (Text-to-Speech) Models ---
  {
    id: 'gemini-3.8-flash-tts',
    name: 'Gemini 3.8 Flash TTS',
    provider: 'google-vertex',
    inputs: ['text'],
    outputs: ['audio'],
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  }
]
