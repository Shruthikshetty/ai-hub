/**
 * Global route error handler
 */
import { ErrorHandler } from 'hono'
import * as HTTP_STATUS_CODES from '../constants/http-status-codes.constants'

const errorHandler: ErrorHandler = (err, c) => {
  console.error(`${err}`)
  return c.json(
    {
      message: 'Internal server error',
      success: false,
      errorInfo:
        process.env.NODE_ENV === 'development'
          ? `${err instanceof Error ? err.message : String(err)}`
          : undefined
    },
    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  )
}

export default errorHandler
