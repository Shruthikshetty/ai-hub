/**
 * @file Aggregator for all DB schemas.
 * Re-exports from individual schema files in src/common/db-schemas/.
 * Drizzle config points here, so no config changes needed when adding new tables.
 */

export * from '../../common/db-schemas/user.schema'
export * from '../../common/db-schemas/provider.schema'
export * from '../../common/db-schemas/conversation.schema'
export * from '../../common/db-schemas/message.schema'
export * from '../../common/db-schemas/relations.schema'

// When you add more tables, just add more re-exports here:
// export * from '../../common/db-schemas/messages.schema'
