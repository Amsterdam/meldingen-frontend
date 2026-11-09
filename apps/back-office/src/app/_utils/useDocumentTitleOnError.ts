import { useTranslations } from 'next-intl'
import { useRef } from 'react'

type Args = {
  apiErrorMessage?: string
  hasApiError: boolean
  validationErrorCount?: number
}

export const useDocumentTitleOnError = ({ apiErrorMessage, hasApiError, validationErrorCount }: Args) => {
  const t = useTranslations('shared')
  const baseDocumentTitle = useRef<string | undefined>(undefined)

  if (!hasApiError && !validationErrorCount) {
    baseDocumentTitle.current = undefined

    return
  }

  if (typeof document === 'undefined') return

  // Keep the unprefixed title while errors persist across renders.
  baseDocumentTitle.current ??= document.title

  if (validationErrorCount && validationErrorCount > 0) {
    return `${t('document-title-error-count-prefix', { count: validationErrorCount })} ${baseDocumentTitle.current}`
  }

  if (hasApiError) {
    return `${apiErrorMessage ?? t('api-error-alert.heading')} - ${baseDocumentTitle.current}`
  }
}
