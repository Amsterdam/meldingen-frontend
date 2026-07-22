import { useTranslations } from 'next-intl'

import { ApiErrorAlert as UIApiErrorAlert } from '@meldingen/ui'

export const ApiErrorAlert = ({ shouldRefocus }: { shouldRefocus: boolean }) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <UIApiErrorAlert
      className="ams-mb-m"
      description={t('description')}
      heading={t('heading')}
      headingLevel={2}
      shouldRefocus={shouldRefocus}
    />
  )
}
