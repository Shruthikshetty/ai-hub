import { ModelSchemaType } from '../../schemas/model.schema'

// exports models that are not listed in fetch currently image and video models are not listed
export const NINJACHAT_STATIC_MODELS: ModelSchemaType[] = [
  {
    id: 'flux-kontext-max',
    name: 'FLUX Kontext Max',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: false, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'flux-2-flex',
    name: 'FLUX.2 Flex',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: false, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'flux-1-pro-ultra',
    name: 'FLUX.1 Pro Ultra',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: false, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'recraft-v3',
    name: 'Recraft V3',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'google-imagen-4',
    name: 'Google Imagen 4',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: false, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'seedream',
    name: 'Seedream',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: false, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'flux-2-pro',
    name: 'FLUX.2 Pro',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'flux-kontext-pro',
    name: 'FLUX Kontext Pro',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'nano-banana-2',
    name: 'Nano Banana 2',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'flux-1-fill',
    name: 'FLUX.1 Fill',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'flux-2-klein',
    name: 'FLUX.2 Klein',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    inputs: ['text'],
    outputs: ['image'],
    capabilities: { vision: false, realtime: true, videoReasoning: false },
    provider: 'ninjachat'
  }
]
