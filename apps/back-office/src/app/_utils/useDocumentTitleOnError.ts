import { useTranslations } from 'next-intl'

type Args = {
  apiErrorMessage?: string
  hasApiError: boolean
  validationErrorCount: number
}

export const useDocumentTitleOnError = ({ apiErrorMessage, hasApiError, validationErrorCount }: Args) => {
  const t = useTranslations('shared')

  if (validationErrorCount && validationErrorCount > 0) {
    return `${t('document-title-error-count-prefix', { count: validationErrorCount })} ${document.title}`
  }

  if (hasApiError) {
    return `${apiErrorMessage ?? t('api-error-alert.heading')} - ${document.title}`
  }
}
