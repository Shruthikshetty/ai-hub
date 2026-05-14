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
  // locking till video gen is supported
  // {
  //   id: 'seedance-2',
  //   name: 'Seedance 2',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'kling-video',
  //   name: 'Kling Video',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'google-veo-2',
  //   name: 'Google Veo 2',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'veo-3.1',
  //   name: 'Veo 3.1',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'veo-3.1-fast',
  //   name: 'Veo 3.1 Fast',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'google-veo-3-fast',
  //   name: 'Veo 3 Fast',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'runway-gen4.5',
  //   name: 'Runway Gen-4.5',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // },
  // {
  //   id: 'runway-gen4-turbo',
  //   name: 'Runway Gen-4 Turbo',
  //   inputs: ['text'],
  //   outputs: ['video'],
  //   capabilities: { vision: false, realtime: false, videoReasoning: true },
  //   provider: 'ninjachat'
  // }
]
