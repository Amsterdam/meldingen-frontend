import { isApiErrorArray } from '~/handleApiError'

export const hasValidationErrors = (response: Response, error: unknown) =>
  response.status === 422 &&
  isApiErrorArray(error) &&
  error?.detail?.some((detailError) => detailError.type === 'value_error')
