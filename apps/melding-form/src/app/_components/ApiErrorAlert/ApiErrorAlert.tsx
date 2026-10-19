import { useTranslations } from 'next-intl'

import type { FocusableAlertProps } from '@meldingen/ui'

import { FocusableAlert } from '@meldingen/ui'

type Props = Pick<FocusableAlertProps, 'focusKey'>

export const ApiErrorAlert = ({ focusKey }: Props) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <FocusableAlert className="ams-mb-m" description={t('description')} focusKey={focusKey} heading={t('heading')} />
  )
}
