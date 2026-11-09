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
  let isFinished = false

  const handleRegister = (fn: CleanupFn) => {
    if (isFinished) {
      Promise.resolve(fn()).catch((err) =>
        console.error('[withTimeout] Error during late cleanup:', err)
      )
    } else {
      cleanup = fn
    }
  }

  const registerCleanup: OnCleanup & { onCleanup: OnCleanup } = Object.assign(handleRegister, {
    onCleanup: handleRegister
  })

  // create timer
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(errorMessage ?? `Operation timed out after ${timeoutMs / 1000}s`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([task(registerCleanup), timeoutPromise])
  } finally {
    isFinished = true
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

/**
 * Keyed asynchronous FIFO queue.
 *
 * Ensures that async operations sharing the same string key execute strictly
 * one after another in order, while operations with different keys execute in parallel.
 */
export class KeyedAsyncQueue {
  private queues = new Map<string, Promise<unknown>>()

  /**
   * Enqueues an async task under the specified key.
   *
   * @param key - The identifier to serialize operations on.
   * @param task - The async operation to execute.
   */
  public run<T>(key: string, task: () => Promise<T>): Promise<T> {
    const runningTask = this.queues.get(key) ?? Promise.resolve()
    const ourTask = runningTask.catch(() => {}).then(task)

    this.queues.set(key, ourTask)

    const cleanup = (): void => {
      if (this.queues.get(key) === ourTask) {
        this.queues.delete(key)
      }
    }
    //run clean up on success or failure
    ourTask.then(cleanup, cleanup)

    return ourTask
  }
}
