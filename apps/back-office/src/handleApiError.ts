import { ValidationError } from '@meldingen/api-client'

// Our API client doesn't strongly type errors, so we need to check if the error is a simple error or an array of errors.
const isSimpleApiError = (error: unknown): error is { detail: string } =>
  typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string'

export const isApiErrorArray = (error: unknown): error is { detail: ValidationError[] } =>
  typeof error === 'object' && error !== null && 'detail' in error && Array.isArray(error.detail)

export const handleApiError = (error: unknown) => {
  if (isSimpleApiError(error)) return error.detail
  if (isApiErrorArray(error)) return error.detail.map((e) => e.msg).join(', ')

  return 'An unknown error occurred'
}
