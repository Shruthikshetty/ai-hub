/**
 * Database utility helper functions
 */

/**
 * Returns the message of the first error in the cause chain that is a unique
 * constraint violation, or null. Drizzle wraps driver errors in DrizzleQueryError.
 */
export function findUniqueConstraintMessage(error: unknown): string | null {
  let current: unknown = error
  for (let depth = 0; depth < 5 && current && typeof current === 'object'; depth++) {
    const err = current as { code?: string; message?: string; cause?: unknown }
    const message = typeof err.message === 'string' ? err.message : ''
    if (
      err.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
      err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' ||
      message.includes('UNIQUE constraint failed') ||
      message.includes('PRIMARY KEY constraint failed')
    ) {
      return message
    }
    current = err.cause
  }
  return null
}

export const isUniqueConstraintError = (error: unknown): boolean =>
  findUniqueConstraintMessage(error) !== null
