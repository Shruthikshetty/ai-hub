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
