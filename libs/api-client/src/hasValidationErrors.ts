import type { ValidationError } from './generated'

import { isApiErrorArray } from './handleApiError'

export const hasValidationErrors = (response?: Response, error?: unknown): error is { detail: ValidationError[] } =>
  response?.status === 422 &&
  isApiErrorArray(error) &&
  error.detail.some((detailError) => detailError.type === 'value_error')
