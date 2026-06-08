/**
 * Paginates an array of results obtained from querying `limit + 1` records.
 * Ensures the items have an `id` field for the cursor.
 */
export function getCursorPagination<T extends { id: number }>(result: T[], limit: number) {
  const hasMore = result.length > limit
  const items = hasMore ? result.slice(0, limit) : result
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null

  return {
    items,
    hasMore,
    nextCursor
  }
}
