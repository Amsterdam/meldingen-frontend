import { useTranslations } from 'next-intl'

import type { FocusableAlertProps } from '@meldingen/ui'

import { FocusableAlert } from '@meldingen/ui'

export type ApiErrorAlertProps = Partial<Pick<FocusableAlertProps, 'description' | 'heading'>> &
  Pick<FocusableAlertProps, 'focusKey'>

export const ApiErrorAlert = ({ description, focusKey, heading }: ApiErrorAlertProps) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <FocusableAlert
      className="ams-mb-m"
      description={description ?? t('description')}
      focusKey={focusKey}
      heading={heading ?? t('heading')}
    />
  )
}
