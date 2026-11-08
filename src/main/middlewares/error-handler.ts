/**
 * Global route error handler
 */
import { ErrorHandler } from 'hono'
import * as HTTP_STATUS_CODES from '../constants/http-status-codes.constants'
import { isUniqueConstraintError } from '../lib/db-utils'

const errorHandler: ErrorHandler = (err, c) => {
  console.error(`${err}`)

  // Catch database unique constraint violations globally
  if (isUniqueConstraintError(err)) {
    const errMessage = err instanceof Error ? err.message : String(err)
    const match = errMessage.match(/UNIQUE constraint failed: \w+\.(\w+)/)
    const field = match ? match[1] : null
    const message = field
      ? `A record with this ${field} already exists`
      : 'A record with this unique identifier already exists'

    return c.json(
      {
        message,
        success: false
      },
      HTTP_STATUS_CODES.CONFLICT
    )
  }

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
