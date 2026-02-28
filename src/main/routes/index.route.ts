// this is the base route
import { createRoute, z } from '@hono/zod-openapi'
import { createRouter } from '../lib/create-app'

// create the base route
const router = createRouter().openapi(
  createRoute({
    tags: ['base'],
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              message: z.string()
            })
          }
        },
        description: 'success response for base route'
      }
    }
  }),
  (c) => {
    return c.json(
      {
        message: 'example hono react electron app'
      },
      200
    )
  }
)

export default router
