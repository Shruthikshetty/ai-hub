import { ModelIOType, ModelSchemaType } from '../../common/schemas/model.schema'
import {
  FireworksAiModel,
  GatewayModel,
  GoogleModel,
  GroqModel,
  HuggingFaceModel,
  PoeModel,
  TogetherAiModel
} from './get-model-list'

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

/**
 * function to extract capabilities from groq model
 */
export function buildGroqModel(
  model: GroqModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []
  const lowerModeId = model.id.toLowerCase()

  if (lowerModeId.includes('tts') || lowerModeId.includes('orpheus')) {
    outputs.push('audio')
  } else if (lowerModeId.includes('whisper')) {
    inputs.pop() // remove text
    inputs.push('audio') // add audio
    outputs.push('text')
  } else {
    outputs.push('text')
  }

  return {
    id: model.id,
    name: model.id.split('/')?.[1] ?? model.id,
    provider,
    inputs: inputs,
    outputs: outputs,
    // not set for now
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  }
}

/**
 * function to build a model record for a HuggingFace model
 * uses pipeline_tag to accurately determine inputs and outputs
 * pipeline_tag reference: https://huggingface.co/tasks
 *
 * @TODO This is not properly test if all are categorized properly
 */
export function buildHuggingFaceModel(
  model: HuggingFaceModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const tag = model.pipeline_tag ?? ''

  const inputs: ModelIOType[] = []
  const outputs: ModelIOType[] = []

  // Derive inputs and outputs from pipeline_tag
  switch (tag) {
    // Chat models
    case 'text-generation':
    case 'conversational':
      inputs.push('text')
      outputs.push('text')
      break
    // Multimodal chat models
    case 'image-text-to-text':
      inputs.push('text', 'image')
      outputs.push('text')
      break
    // Image generation
    case 'text-to-image':
      inputs.push('text')
      outputs.push('image')
      break
    // Embedding models
    case 'feature-extraction':
    case 'sentence-similarity':
      inputs.push('text')
      outputs.push('embedding')
      break
    // TTS models
    case 'text-to-speech':
    case 'text-to-audio':
      inputs.push('text')
      outputs.push('audio')
      break
    // Video generation
    case 'text-to-video':
      inputs.push('text')
      outputs.push('video')
      break
    default:
      // Not a model type we support — leave inputs/outputs empty
      break
  }

  const hasVision = inputs.includes('image')

  return {
    id: model.id,
    name: model.id,
    provider,
    inputs,
    outputs,
    capabilities: {
      vision: hasVision,
      videoReasoning: false,
      realtime: false
    }
  }
}

export function buildXaiModel(
  model: string,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []
  const lowerModeId = model.toLowerCase()

  if (lowerModeId.includes('image')) {
    outputs.push('image')
    inputs.push('image')
  } else if (lowerModeId.includes('video')) {
    outputs.push('video')
  } else {
    outputs.push('text')
    inputs.push('image')
  }

  return {
    id: model,
    name: lowerModeId.split('/')?.[1] ?? lowerModeId,
    provider,
    inputs: inputs,
    outputs: outputs,
    // not set for now
    capabilities: {
      vision: inputs.includes('image'),
      videoReasoning: false,
      realtime: false
    }
  }
}

// extract model capabilities from together ai model @TODO might need to change
export function buildTogetherAiModel(
  model: TogetherAiModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []

  if (model.type === 'image') {
    outputs.push('image')
  } else if (model.type === 'embedding') {
    outputs.push('embedding')
  } else {
    outputs.push('text')
  }

  return {
    id: model.id,
    name: model.display_name,
    provider,
    inputs: inputs,
    outputs: outputs,
    capabilities: {
      vision: false,
      videoReasoning: false,
      realtime: false
    }
  }
}

/**
 * function to extract capabilities from fireworks ai model
 * @TODO no proper way to fetch exact list of models
 */
export function buildFireworksAiModel(
  model: FireworksAiModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []
  const lowerModeId = model.name.toLowerCase()

  if (model.supportsImageInput) {
    inputs.push('image')
  }

  if (lowerModeId.includes('flux')) {
    outputs.push('image')
  } else if (lowerModeId.includes('embedding')) {
    outputs.push('embedding')
  } else {
    outputs.push('text')
  }

  return {
    id: model.name,
    name: model.displayName,
    provider,
    inputs: inputs,
    outputs: outputs,
    capabilities: {
      vision: inputs.includes('image'),
      videoReasoning: false,
      realtime: false
    }
  }
}

/**
 * function to build a model record for a Poe AI model
 */
export function buildPoeModel(
  model: PoeModel,
  provider: ModelSchemaType['provider']
): ModelSchemaType {
  return {
    id: model.id,
    name: model.id,
    provider,
    inputs: model.architecture.input_modalities,
    outputs: model.architecture.output_modalities,
    capabilities: {
      realtime: false,
      vision: model.architecture.input_modalities.includes('image'),
      videoReasoning: model.architecture.input_modalities.includes('video')
    }
  }
}
