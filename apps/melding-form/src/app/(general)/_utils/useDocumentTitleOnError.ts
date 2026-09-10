import { useTranslations } from 'next-intl'

type Args = {
  baseDocumentTitle: string
  hasApiError?: boolean
  validationErrorCount?: number
}

export const useDocumentTitleOnError = ({ baseDocumentTitle, hasApiError, validationErrorCount }: Args) => {
  const t = useTranslations('shared')

  if (validationErrorCount && validationErrorCount > 0) {
    return `${t('document-title-error-count-prefix', { count: validationErrorCount })} ${baseDocumentTitle}`
  }

  if (hasApiError) {
    return `${t('api-error-alert.heading')} - ${baseDocumentTitle}`
  }

  return baseDocumentTitle
}
