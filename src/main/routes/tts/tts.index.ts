// this file aggregates all the tts(text to speech) related routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './tts.handlers'
import * as routes from './tts.routes'

// create the router
const router = createRouter()
  .openapi(routes.generateSpeechFromText, handlers.generateSpeechFromText)
  .openapi(routes.deleteGeneratedTTSAudio, handlers.deleteGeneratedTTSAudio)

// export the router
export default router
