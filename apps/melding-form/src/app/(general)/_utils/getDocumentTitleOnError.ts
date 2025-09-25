import { ValidationError } from 'apps/melding-form/src/types'

export const getDocumentTitleOnError = (
  originalDocTitle: string,
  t: (key: string, { count }: { count: number }) => string,
  validationErrors?: ValidationError[],
) => {
  if (validationErrors && validationErrors.length > 0) {
    const errorCount = validationErrors.length

    return `${t('error-count-label', { count: errorCount })} ${originalDocTitle}`
  }

  return originalDocTitle
}
