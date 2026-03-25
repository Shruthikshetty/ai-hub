import { z } from 'zod'

// used to validate the chat options update validation form
export const chatOptionsValidationSchema = z.object({
  systemPrompt: z.string().nullish(),
  metadata: z.boolean(),
  tools: z.object({
    profileAccess: z.object({
      enabled: z.boolean()
    }),
    search: z
      .object({
        enabled: z.boolean(),
        provider: z.string()
      })
      .superRefine((data, ctx) => {
        if (data.enabled && !data.provider) {
          ctx.addIssue({
            code: 'custom',
            message: 'Provider is required when search is enabled',
            path: ['provider']
          })
        }
      })
  })
  // rest will be added here
})

// type for the chat options validation schema
export type ChatOptionsValidationSchema = z.infer<typeof chatOptionsValidationSchema>
