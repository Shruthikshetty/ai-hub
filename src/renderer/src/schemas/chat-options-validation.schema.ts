import { z } from 'zod'

// used to validate the chat options update validation form
export const chatOptionsValidationSchema = z.object({
  systemPrompt: z.string().nullish()
  // rest will be added here
})

// type for the chat options validation schema
export type ChatOptionsValidationSchema = z.infer<typeof chatOptionsValidationSchema>
