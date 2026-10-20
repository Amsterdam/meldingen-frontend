import { useTranslations } from 'next-intl'

import type { InvalidFormAlertProps } from '@meldingen/ui'

import { InvalidFormAlert as UIInvalidFormAlert } from '@meldingen/ui'

type Props = Partial<Pick<InvalidFormAlertProps, 'heading'>> & Pick<InvalidFormAlertProps, 'errors' | 'focusKey'>

export const InvalidFormAlert = ({ errors, focusKey, heading }: Props) => {
  const t = useTranslations('shared')

  return (
    <UIInvalidFormAlert
      className="ams-mb-m"
      errors={errors}
      focusKey={focusKey}
      heading={heading ?? t('invalid-form-alert-title')}
    />
  )
}
