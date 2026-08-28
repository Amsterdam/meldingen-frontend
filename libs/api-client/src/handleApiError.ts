import type { ValidationError } from './generated'

// The errors returned by the API are either a simple error string or an array of `ValidationError`s.
// This functions returns a simple error string for both shapes.
// We type `error` as `unknown` because the SDK's error type is only a compile-time assertion, not guaranteed at runtime (e.g. network errors).
const isSimpleApiError = (error: unknown): error is { detail: string } =>
  typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string'

export const isApiErrorArray = (error: unknown): error is { detail: ValidationError[] } =>
  typeof error === 'object' && error !== null && 'detail' in error && Array.isArray(error.detail)

export const handleApiError = (error: unknown) => {
  if (isSimpleApiError(error)) return error.detail
  if (isApiErrorArray(error)) return error.detail.map((e) => e.msg).join(', ')

  return 'An unknown error occurred'
}
