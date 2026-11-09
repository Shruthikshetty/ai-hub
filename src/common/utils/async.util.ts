/**
 * @file Helper utilities for asynchronous operations and timeout management.
 */

export type CleanupFn = () => Promise<void> | void
export type OnCleanup = (fn: CleanupFn) => void

export interface TimeoutOptions {
  timeoutMs?: number
  errorMessage?: string
}

/**
 * Wraps an async task with a timeout and an optional single cleanup hook.
 *
 * @param task - Async function receiving `onCleanup` to register resource teardown.
 * @param options - Timeout configuration or duration in milliseconds (defaults to 10000ms).
 */
export async function withTimeout<T>(
  task: (onCleanup: OnCleanup & { onCleanup: OnCleanup }) => Promise<T>,
  options: TimeoutOptions | number = {}
): Promise<T> {
  const opts = typeof options === 'number' ? { timeoutMs: options } : options
  const { timeoutMs = 10000, errorMessage } = opts

  let cleanup: CleanupFn | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  const registerCleanup: OnCleanup & { onCleanup: OnCleanup } = Object.assign(
    (fn: CleanupFn) => {
      cleanup = fn
    },
    {
      onCleanup: (fn: CleanupFn) => {
        cleanup = fn
      }
    }
  )

  // create timer
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(errorMessage ?? `Operation timed out after ${timeoutMs / 1000}s`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([task(registerCleanup), timeoutPromise])
  } finally {
    // clear timer if it exist
    if (timer !== undefined) {
      clearTimeout(timer)
    }
    // run clean up function if provided
    if (cleanup) {
      try {
        await cleanup()
      } catch (err) {
        console.error('[withTimeout] Error during cleanup:', err)
      }
    }
  }
}
