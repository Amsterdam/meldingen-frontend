import { useTranslations } from 'next-intl'

import type { FocusableAlertProps } from '@meldingen/ui'

import { FocusableAlert } from '@meldingen/ui'

export type ApiErrorAlertProps = Partial<Pick<FocusableAlertProps, 'heading'>> &
  Pick<FocusableAlertProps, 'description' | 'shouldFocus'>

export const ApiErrorAlert = ({ description, heading, shouldFocus }: ApiErrorAlertProps) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <FocusableAlert
      className="ams-mb-m"
      description={description ?? t('description')}
      heading={heading ?? t('heading')}
      shouldFocus={shouldFocus}
    />
  )
}
