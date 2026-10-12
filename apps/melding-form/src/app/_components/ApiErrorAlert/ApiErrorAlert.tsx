import { useTranslations } from 'next-intl'

import type { AlertProps } from '@meldingen/ui'

import { Alert } from '@meldingen/ui'

type Props = Pick<AlertProps, 'shouldFocus'>

export const ApiErrorAlert = ({ shouldFocus }: Props) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <Alert
      className="ams-mb-m"
      description={t('description')}
      heading={t('heading')}
      headingLevel={2}
      shouldFocus={shouldFocus}
    />
  )
}
