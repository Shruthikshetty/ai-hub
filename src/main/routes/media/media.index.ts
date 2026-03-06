/**
 * @file Aggregates all media routes into a single router.
 */

import { createRouter } from '../../lib/create-app'
import * as handlers from './media.handlers'
import * as routes from './media.routes'

// create the router
const router = createRouter().openapi(routes.uploadMedia, handlers.uploadMedia)

export default router
