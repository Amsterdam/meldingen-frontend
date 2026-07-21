import type { InvalidFormAlertProps } from '@amsterdam/design-system-react'

import { useTranslations } from 'next-intl'

import { InvalidFormAlert as UIInvalidFormAlert } from '@meldingen/ui'

type Props = {
  errors: { key: string; message: string }[]
  heading?: InvalidFormAlertProps['heading']
}

export const InvalidFormAlert = ({ errors, heading }: Props) => {
  const t = useTranslations('shared')

  return (
    <UIInvalidFormAlert
      className="ams-mb-m"
      errors={errors}
      heading={heading ?? t('invalid-form-alert-title')}
      headingLevel={2}
    />
  )
}
