import z from 'zod'

/*
defines the zod validated error format used in response
*/
export const AppValidationErrorSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.string(), z.array(z.string()))
  })
})

/*
defines a zod schema for not found error
*/
export const AppNotFoundErrorSchema = z.object({
  message: z.string(),
  success: z.boolean()
})

/**
 * defines a zod schema for internal server error
 */
export const AppInternalServerErrorSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  errorInfo: z.string().optional()
})

/**
 * defines bad request error schema
 */
export const AppBadRequestErrorSchema = z.object({
  message: z.string(),
  success: z.boolean()
})
