// custom ninja chant ai sdk provider
// @TODO still in progress
export type { NinjaChatProvider, NinjaChatProviderSettings } from './ninjachat-provider'
export { createNinjaChat } from './ninjachat-provider'

// Internal exports for extending (e.g. future image/embedding models)
export { buildNinjaChatFetch } from './ninjachat-fetch-adapter'
