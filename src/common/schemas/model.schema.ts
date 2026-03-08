import { z } from 'zod'

export const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string().default('unknown'),
  inputs: z.array(z.string()).default(['text']),
  outputs: z.array(z.string()).default(['text']),
  capabilities: z
    .object({
      vision: z.boolean().nullish(),
      videoReasoning: z.boolean().nullish(),
      realtime: z.boolean().nullish()
    })
    .nullish()
})

// extract the type
export type ModelSchemaType = z.infer<typeof modelSchema>
