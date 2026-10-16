import { useTranslations } from 'next-intl'

import type { InvalidFormAlertProps } from '@meldingen/ui'

import { InvalidFormAlert as UIInvalidFormAlert } from '@meldingen/ui'

type Props = Partial<Pick<InvalidFormAlertProps, 'heading'>> & Pick<InvalidFormAlertProps, 'errors' | 'focusTrigger'>

export const InvalidFormAlert = ({ errors, focusTrigger, heading }: Props) => {
  const t = useTranslations('shared')

  return (
    <UIInvalidFormAlert
      className="ams-mb-m"
      errors={errors}
      focusTrigger={focusTrigger}
      heading={heading ?? t('invalid-form-alert-title')}
      headingLevel={2}
    />
  )
}
