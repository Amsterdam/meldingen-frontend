import type { ValidationError } from './generated'

const isSimpleApiError = (error: unknown): error is { detail: string } =>
  typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string'

export const isApiErrorArray = (error: unknown): error is { detail: ValidationError[] } =>
  typeof error === 'object' && error !== null && 'detail' in error && Array.isArray(error.detail)

/**
 * The errors returned by the API are either a simple error string or an array of `ValidationError`s.
 * This function returns a simple error string for both shapes.
 * @param error The API error object to extract the message from. Typed as `unknown` because the SDK's
 * error type is only a compile-time assertion, not guaranteed at runtime (e.g. network errors).
 */
export const getApiErrorMessage = (error: unknown) => {
  if (isSimpleApiError(error)) return error.detail
  if (isApiErrorArray(error)) return error.detail.map((e) => e.msg).join(', ')

  return 'An unknown error occurred'
}
