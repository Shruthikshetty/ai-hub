/**
 * @file Aggregates all model routes into a single router.
 */

import { createRouter } from '../../lib/create-app'
import * as handlers from './model.handlers'
import * as routes from './model.route'

// create router for model routes
export const modelRouter = createRouter().openapi(routes.getModels, handlers.getModels)

export default modelRouter
