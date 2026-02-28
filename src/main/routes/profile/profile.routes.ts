/**
 * @file contains all the routes related to profile with Zod Open Api support
 */

import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { zodNotFoundDocObject, zodValidationErrorDocObject } from '../../constants/doc-constants'
import { userPatchSchema, usersGetSchema } from '../../db/schema'

// route to get profile data
export const getProfile = createRoute({
  tags: ['profile'],
  method: 'get',
  path: '/profile',
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            data: usersGetSchema,
            success: z.boolean()
          })
        }
      },
      description: 'success response for profile route'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject
  }
})

// route to update profile data
export const updateProfile = createRoute({
  tags: ['profile'],
  method: 'patch',
  path: '/profile',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: userPatchSchema
        }
      },
      description: 'request body for update profile route'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            data: usersGetSchema,
            success: z.boolean()
          })
        }
      },
      description: 'success response for profile route'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject
  }
})

// export all the route types
export type GetProfileRoute = typeof getProfile
export type UpdateProfileRoute = typeof updateProfile
