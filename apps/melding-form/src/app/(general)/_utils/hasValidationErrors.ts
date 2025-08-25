import { isApiErrorArray } from 'apps/melding-form/src/handleApiError'

export const hasValidationErrors = (response: Response, error: unknown) =>
  response.status === 422 && isApiErrorArray(error) && error?.detail?.some((error) => error.type === 'value_error')
