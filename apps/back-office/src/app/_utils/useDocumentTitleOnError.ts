import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

type Args = {
  apiErrorMessage?: string
  hasApiError: boolean
  validationErrorCount?: number
}

export const useDocumentTitleOnError = ({ apiErrorMessage, hasApiError, validationErrorCount }: Args) => {
  const t = useTranslations('shared')
  let error: string | undefined

  if (validationErrorCount && validationErrorCount > 0) {
    error = `${t('document-title-error-count-prefix', { count: validationErrorCount })}`
  } else if (hasApiError) {
    error = `${apiErrorMessage ?? t('api-error-alert.heading')}`
  }

  useEffect(() => {
    if (!error) return

    const originalTitle = document.title
    const title = `${error} - ${originalTitle}`

    document.title = title

    return () => {
      if (document.title === title) {
        document.title = originalTitle
      }
    }
  }, [error])
}
