import {
  AppBadRequestErrorSchema,
  AppInternalServerErrorSchema,
  AppNotFoundErrorSchema,
  AppValidationErrorSchema
} from '../schemas/validation-errors'

// defines a openapi doc object for zod not found error
export const zodNotFoundDocObject = {
  content: {
    'application/json': {
      schema: AppNotFoundErrorSchema.openapi({
        example: {
          message: 'Not found',
          success: false
        }
      })
    }
  },
  description: 'Not found error response'
}

// define validation error doc object
export const zodValidationErrorDocObject = {
  content: {
    'application/json': {
      schema: AppValidationErrorSchema
    }
  },
  description: 'Validation error response'
}

// internal server errors doc object
export const internalServerErrorDocObject = {
  content: {
    'application/json': {
      schema: AppInternalServerErrorSchema
    }
  },
  description: 'Internal server error response'
}

// bad request error doc object
export const badRequestDocObject = {
  content: {
    'application/json': {
      schema: AppBadRequestErrorSchema
    }
  },
  description: 'Bad request error response'
}
