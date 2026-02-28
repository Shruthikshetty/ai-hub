import { OpenAPIHono } from '@hono/zod-openapi'

import { AppBindings, AppOpenApi } from '../types'
import handleNotFound from '../middlewares/not-found'
import { appLogger } from '../middlewares/app-logger'
import validationErrorHandler from '../middlewares/validation-error-handler'
import errorHandler from '../middlewares/error-handler'

/**
 * This will create the router for the app with Zod Open Api support
 */
export const createRouter = () => {
  const router = new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: validationErrorHandler
  })

  return router
}

// a function that creates the app with all the middlewares
const createApp = () => {
  const app = createRouter()

  // middlewares go here
  app.use(appLogger)
  app.notFound(handleNotFound)
  app.onError(errorHandler)

  return app
}

export default createApp

// so that our test can have all the middlewares
export function createTestApp(router: AppOpenApi) {
  const testApp = createApp()
  testApp.route('/api', router)
  return testApp
}
