import { useTranslations } from 'next-intl'

import type { FocusableAlertProps } from '@meldingen/ui'

import { FocusableAlert } from '@meldingen/ui'

type Props = Pick<FocusableAlertProps, 'shouldFocus'>

export const ApiErrorAlert = ({ shouldFocus }: Props) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <FocusableAlert
      className="ams-mb-m"
      description={t('description')}
      heading={t('heading')}
      shouldFocus={shouldFocus}
    />
  )
}
