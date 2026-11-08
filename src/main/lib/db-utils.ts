/**
 * Database utility helper functions
 */

/**
 * Checks if a caught database error is a unique constraint violation (e.g. duplicate key/name)
 */
export function isUniqueConstraintError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const err = error as { code?: string; message?: string }
  return (
    err.code === 'SQLITE_CONSTRAINT' ||
    err.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
    err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' ||
    (typeof err.message === 'string' &&
      (err.message.includes('UNIQUE constraint failed') ||
        err.message.includes('PRIMARY KEY constraint failed') ||
        err.message.includes('SQLITE_CONSTRAINT_UNIQUE')))
  )
}
