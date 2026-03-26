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
      }),
    imageGeneration: z
      .object({
        enabled: z.boolean(),
        provider: z.string(),
        modelId: z.string()
      })
      .superRefine((data, ctx) => {
        if (data.enabled && !data.provider) {
          ctx.addIssue({
            code: 'custom',
            message: 'Provider is required when image generation is enabled',
            path: ['provider']
          })
        }
        if (data.enabled && !data.modelId) {
          ctx.addIssue({
            code: 'custom',
            message: 'Model is required when image generation is enabled',
            path: ['modelId']
          })
        }
      })
  })
  // rest will be added here
})

// type for the chat options validation schema
export type ChatOptionsValidationSchema = z.infer<typeof chatOptionsValidationSchema>
