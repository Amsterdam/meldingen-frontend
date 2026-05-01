import { isApiErrorArray } from '~/handleApiError'

export const hasValidationErrors = (response: Response, error: unknown) =>
  response.status === 422 && isApiErrorArray(error) && error?.detail?.some((error) => error.type === 'value_error')
