import { useTranslations } from 'next-intl'

import type { InvalidFormAlertProps } from '@meldingen/ui'

import { InvalidFormAlert as UIInvalidFormAlert } from '@meldingen/ui'

type Props = Pick<InvalidFormAlertProps, 'errors' | 'heading' | 'shouldFocus'>

export const InvalidFormAlert = ({ errors, heading, shouldFocus }: Props) => {
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
