/**
 * @file configures open api for the app
 * with swagger like ui
 */
import type { AppOpenApi } from '../types'

import packageJson from '../../../package.json' with { type: 'json' }

const configureOpenApi = async (app: AppOpenApi) => {
  // main doc endpoint for open api
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJson.version,
      title: 'AI Hub Backend'
    }
  })
  // Mount Scalar Swagger UI only in development mode
  // scalar endpoint for open api swagger like ui
  if (import.meta.env.DEV) {
    const { Scalar } = await import('@scalar/hono-api-reference')
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
}

export default configureOpenApi
