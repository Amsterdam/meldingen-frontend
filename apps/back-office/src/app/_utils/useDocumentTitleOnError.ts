import { useTranslations } from 'next-intl'

type Args = {
  apiErrorMessage?: string
  baseDocumentTitle: string
  hasApiError?: boolean
  validationErrorCount?: number
}

export const useDocumentTitleOnError = ({
  apiErrorMessage,
  baseDocumentTitle,
  hasApiError,
  validationErrorCount,
}: Args) => {
  const t = useTranslations('shared')

  if (validationErrorCount && validationErrorCount > 0) {
    return `${t('document-title-error-count-prefix', { count: validationErrorCount })} ${baseDocumentTitle}`
  }

  if (hasApiError) {
    return `${apiErrorMessage ?? t('api-error-alert.heading')} - ${baseDocumentTitle}`
  }

  return baseDocumentTitle
}
