import { useTranslations } from 'next-intl'

type Args = {
  baseDocumentTitle: string
  /** Heading of a non-API error alert on the page, used as the title prefix so the title matches the alert */
  errorHeading?: string
  hasApiError?: boolean
  validationErrorCount?: number
}

export const useDocumentTitleOnError = ({
  baseDocumentTitle,
  errorHeading,
  hasApiError,
  validationErrorCount,
}: Args) => {
  const t = useTranslations('shared')

  if (validationErrorCount && validationErrorCount > 0) {
    return `${t('document-title-error-count-prefix', { count: validationErrorCount })} ${baseDocumentTitle}`
  }

  if (hasApiError) {
    return `${t('api-error-alert.heading')} - ${baseDocumentTitle}`
  }

  if (errorHeading) {
    return `${errorHeading} - ${baseDocumentTitle}`
  }

  return baseDocumentTitle
}
