import type { ValidationError } from './generated'

// Both error shapes share the `detail` field name but differ in its value type (string vs. array), so TypeScript
// can't discriminate between them without a runtime check. We also accept `unknown` rather than trust the SDK's
// per-endpoint error type, since that type is a compile-time assertion, not a runtime guarantee for e.g. network failures.
const isSimpleApiError = (error: unknown): error is { detail: string } =>
  typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string'

export const isApiErrorArray = (error: unknown): error is { detail: ValidationError[] } =>
  typeof error === 'object' && error !== null && 'detail' in error && Array.isArray(error.detail)

export const handleApiError = (error: unknown) => {
  if (isSimpleApiError(error)) return error.detail
  if (isApiErrorArray(error)) return error.detail.map((e) => e.msg).join(', ')

  return 'An unknown error occurred'
}
