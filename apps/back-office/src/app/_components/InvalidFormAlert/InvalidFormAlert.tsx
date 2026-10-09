import { useTranslations } from 'next-intl'

import type { InvalidFormAlertProps as UIInvalidFormAlertProps } from '@meldingen/ui'

import { InvalidFormAlert as UIInvalidFormAlert } from '@meldingen/ui'

export type InvalidFormAlertProps = Pick<UIInvalidFormAlertProps, 'errors' | 'shouldFocus'> & {
  heading?: string
}

export const InvalidFormAlert = ({ errors, heading, shouldFocus }: InvalidFormAlertProps) => {
  const t = useTranslations('shared')

  return (
    <UIInvalidFormAlert
      className="ams-mb-m"
      errors={errors}
      heading={heading ?? t('invalid-form-alert-title')}
      headingLevel={2}
      shouldFocus={shouldFocus}
    />
  )
}
