import { ModelIOType, ModelSchemaType } from '../../common/schemas/model.schema'
import { GatewayModel, GoogleModel } from './get-model-list'

// builds a complete model record for an OpenAI model from its ID
export function buildOpenAiModel(
  modelId: string,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const isImage = modelId.includes('dall-e') || modelId.includes('image')
  const isEmbedding = modelId.includes('embedding')
  const isTTS = modelId.includes('tts') || modelId.includes('audio')
  const isWhisper = modelId.includes('whisper')
  const isRealTime = modelId.includes('realtime')
  const isVideo = modelId.includes('sora')

  // Vision inputs for newer multimodal textual models NOTE: this might not be accurate
  const isVision =
    modelId.includes('vision') ||
    modelId.startsWith('gpt-4o') ||
    modelId.startsWith('o1') ||
    modelId.startsWith('gpt-5')

  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []

  // Set Inputs
  if (isVision) inputs.push('image')
  if (isWhisper) {
    // Whisper takes audio and returns text
    inputs.push('audio')
  }

  // Set Outputs
  switch (true) {
    case isImage:
      outputs.push('image')
      break
    case isEmbedding:
      outputs.push('embedding')
      break
    case isTTS:
      outputs.push('audio')
      break
    case isRealTime:
      outputs.push('realtime')
      break
    case isVideo:
      outputs.push('video')
      break
    default:
      outputs.push('text')
      break
  }

  return {
    id: modelId,
    name: modelId,
    provider,
    inputs,
    outputs,
    capabilities: {
      vision: isVision,
      videoReasoning: false, // @ TODO No clear distinction for now
      realtime: modelId.includes('realtime')
    }
  }
}

// builds a complete model record for a Google AI Studio model
export function buildGoogleModel(
  model: GoogleModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const name = model.name.toLowerCase()
  const methods = model.supportedGenerationMethods || []

  // Determine Input Types
  // Gemini is multimodal by default unless it's an embedding model
  const inputs: ModelIOType[] = ['text']
  if (!name.includes('embedding')) {
    inputs.push('image', 'video', 'audio', 'file')
  }

  // Determine Output Types
  const outputs: ModelIOType[] = []
  if (methods.includes('embedContent')) {
    outputs.push('embedding')
  } else if (name.includes('image') || name.includes('banana')) {
    outputs.push('image')
  } else if (name.includes('veo')) {
    outputs.push('video')
  } else if (name.includes('audio')) {
    outputs.push('audio')
  } else {
    outputs.push('text')
  }

  // return the full model record
  return {
    id: model.name.split('/')?.[1] ?? model.name,
    name: model.displayName,
    provider,
    inputs,
    outputs,
    capabilities: {
      vision: !name.includes('embedding'), // All modern Gemini models have vision
      videoReasoning: name.includes('pro') || name.includes('flash')
    }
  }
}

/**
 * function to extract capabilities from gateway model
 */
export function buildGatewayModel(
  model: GatewayModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []

  // Set Inputs
  if (model.tags?.includes('vision')) inputs.push('image')

  // Set Outputs
  switch (model.type) {
    case 'image':
      outputs.push('image')
      break
    case 'embedding':
      outputs.push('embedding')
      break
    case 'video':
      outputs.push('video')
      break
    default:
      outputs.push('text')
      break
  }

  return {
    id: model.id,
    name: model?.name ?? model.id,
    provider,
    inputs,
    outputs,
    capabilities: {
      vision: model.tags?.includes('vision'),
      //not set for now
      videoReasoning: false,
      realtime: false
    }
  }
}
