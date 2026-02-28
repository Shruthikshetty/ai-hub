/**
 * @file configures open api for the app
 * with swagger like ui
 */
import { Scalar } from '@scalar/hono-api-reference'

import type { AppOpenApi } from '../types'

import packageJson from '../../../package.json' with { type: 'json' }

const configureOpenApi = (app: AppOpenApi) => {
  // main doc endpoint for open api
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJson.version,
      title: 'Electron Hono React Template'
    }
  })

  // scalar endpoint for open api swagger like ui
  app.get(
    '/reference',
    Scalar({
      url: '/doc',
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'js'
      }
    })
  )
}

export default configureOpenApi
