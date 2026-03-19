/**
 * This sets up the hono app and worker
 * it runs separately from the main process
 * and handles all the requests from the renderer process
 */
import configureOpenApi from './config/open-api-config'
import createApp from './lib/create-app'
import base from './routes/index.route'
import profile from './routes/profile/profile.index'
import { serve } from '@hono/node-server'
import chat from './routes/chat/chat.index'
import media from './routes/media/media.index'
import model from './routes/model/model.index'
import provider from './routes/provider/provider.index'
import conversation from './routes/conversation/conversation.index'
import message from './routes/message/message.index'
import image from './routes/image-gen/image-gen.index'

import { runMigrations } from './db/migrate'
import { seed } from './db/seed'

// create hono app
const app = createApp()

// run migrations
const migrationPromise =
  process.env.NODE_ENV === 'development'
    ? Promise.resolve()
    : runMigrations()
        .then(() => seed())
        .catch((err) => {
          console.error('Migration/Seed failed:', err)
          process.exit(1)
        })

//configure open api
configureOpenApi(app)

// all routes go here
const routes = [base, profile, chat, media, model, provider, conversation, message, image]

routes.forEach((route) => {
  if (route === base) {
    app.route('/', route)
    return
  }
  // for all other routes add /api prefix
  app.route('/api', route)
})

// expose the app for local development only
if (process.env.NODE_ENV === 'development') {
  serve({
    fetch: app.fetch,
    port: 3000 // local dev only
  })
}

// listen to message from main process this will be used to send request to hono app
process.parentPort.on('message', async (e) => {
  const port = e.ports[0]
  const { type, path, method, body } = e.data

  if (type === 'hono-request') {
    await migrationPromise
    try {
      const res = await app.fetch(
        new Request(`http://localhost${path}`, {
          method,
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined
        })
      )
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const result = await res.json()
        port.postMessage({ type: 'complete', data: result })
        port.close()
      } else if (res.body) {
        // Stream the response chunks back through the port
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          port.postMessage({ type: 'chunk', data: decoder.decode(value, { stream: true }) })
        }
        // Flush any remaining buffered bytes from incomplete multi-byte UTF-8 sequences
        const remaining = decoder.decode()
        if (remaining) {
          port.postMessage({ type: 'chunk', data: remaining })
        }
        port.postMessage({ type: 'end' })
        port.close()
      } else {
        port.postMessage({ type: 'complete', data: null })
        port.close()
      }
    } catch (error) {
      console.error('Worker request failed:', error)
      port.postMessage({ type: 'error', data: String(error) })
      port.close()
    }
  }
})
