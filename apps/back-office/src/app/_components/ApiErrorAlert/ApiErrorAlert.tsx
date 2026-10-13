import { useTranslations } from 'next-intl'

import type { AlertProps } from '@meldingen/ui'

import { FocusableAlert } from '@meldingen/ui'

export type ApiErrorAlertProps = Pick<AlertProps, 'description' | 'shouldFocus'> & {
  heading?: string
}

export const ApiErrorAlert = ({ description, heading, shouldFocus }: ApiErrorAlertProps) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <FocusableAlert
      className="ams-mb-m"
      description={description ?? t('description')}
      heading={heading ?? t('heading')}
      severity="error"
      shouldFocus={shouldFocus}
    />
  )
}
