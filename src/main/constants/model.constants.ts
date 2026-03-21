/**
 * HuggingFace pipeline_tag categories to fetch, with per-category limits.
 * Each entry maps to one API request (HF only supports one pipeline_tag per request).
 */
export const HF_MODEL_CATEGORIES: { tag: string; limit: number }[] = [
  { tag: 'text-generation', limit: 100 }, // chat models
  { tag: 'image-text-to-text', limit: 100 }, // multimodal chat
  { tag: 'text-to-image', limit: 50 } // image generation
  //{ tag: 'feature-extraction', limit: 50 }, // embeddings - not supported yet
  //{ tag: 'text-to-speech', limit: 30 }, // TTS - not supported yet
  //{ tag: 'text-to-video', limit: 20 } // video generation - not supported yet
]
