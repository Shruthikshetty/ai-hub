/**
 * Normalizes the provider URL by removing any trailing slashes and appending the endpoint
 * @param url The provider URL
 * @param endpoint The endpoint to append
 * @returns The normalized URL
 */
export function normalizeProviderUrl(url: string, endpoint: string = '/api'): string {
  if (!url) return url
  let normalizedUrl = url.trim()

  if (!normalizedUrl.endsWith(endpoint)) {
    // Remove trailing slash if it exists before appending the endpoint
    normalizedUrl = normalizedUrl.replace(/\/$/, '') + endpoint
  }

  return normalizedUrl
}
