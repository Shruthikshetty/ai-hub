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
