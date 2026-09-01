import type { ValidationError } from './generated'

import { isApiErrorArray } from './getApiErrorMessage'

/**
 * Distinguishes validation errors from other API error types.
 * We handle validation errors differently in the frontends.
 */
export const hasValidationErrors = (response?: Response, error?: unknown): error is { detail: ValidationError[] } =>
  response?.status === 422 &&
  isApiErrorArray(error) &&
  error.detail.some((detailError) => detailError.type === 'value_error')
