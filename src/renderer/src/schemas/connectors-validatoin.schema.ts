import { z } from 'zod'

/**
 * Validation schema for the connector configuration form.
 * for both update and addition of a connector
 */
export const connectorFormValidationSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
  allowedUsers: z.array(z.string()),
  modelId: z.string().min(1, 'Model is required'),
  provider: z.string().min(1, 'Provider is required'),
  systemPrompt: z.string().nullish(),
  autoStart: z.boolean()
})

// export input type
export type ConnectorFormValidationSchemaType = z.input<typeof connectorFormValidationSchema>
