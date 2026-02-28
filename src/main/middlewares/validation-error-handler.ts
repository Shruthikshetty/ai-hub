/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hook } from '@hono/zod-openapi'
import { flattenError } from 'zod'
import * as HTTP_STATUS_CODES from '../constants/http-status-codes.constants'

// handles the api zod validation errors this will be used as the default hook for zod open api
const validationErrorHandler: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: flattenError(result.error)
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }

  // if no error return null
  return null
}

export default validationErrorHandler
