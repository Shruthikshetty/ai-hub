import { z } from 'zod'
import {
  chatToolsValidationSchema,
  chatAdditionalOptionsValidationSchema
} from './chat-options-validation.schema'

/**
 * Validation schema for the connector configuration form.
 * for both update and addition of a connector
 */
export const connectorFormValidationSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
  allowedUsers: z.array(z.string()).min(1, 'at least one allowed user is required'),
  modelId: z.string().min(1, 'Model is required'),
  provider: z.string().min(1, 'Provider is required'),
  systemPrompt: z.string().nullish(),
  messageLimit: z
    .number('must be a number')
    .int('must be a integer')
    .positive('must be a positive number')
    .nullish(),
  tools: chatToolsValidationSchema,
  additionalOptions: chatAdditionalOptionsValidationSchema,
  autoStart: z.boolean()
})

// export input type
export type ConnectorFormValidationSchemaType = z.input<typeof connectorFormValidationSchema>
