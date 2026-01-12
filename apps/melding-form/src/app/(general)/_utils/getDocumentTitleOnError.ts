export const getDocumentTitleOnError = ({
  hasSystemError,
  originalDocTitle,
  translateFunction: t,
  validationErrorCount,
}: {
  hasSystemError?: boolean
  originalDocTitle: string
  translateFunction: (key: string, options?: { count: number }) => string
  validationErrorCount?: number
}) => {
  if (validationErrorCount && validationErrorCount > 0) {
    return `${t('error-count-label', { count: validationErrorCount })} ${originalDocTitle}`
  }
  if (hasSystemError) {
    return `${t('system-error-alert-title')} - ${originalDocTitle}`
  }

  return originalDocTitle
}
