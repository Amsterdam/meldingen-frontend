import { useTranslations } from 'next-intl'

import type { ApiErrorAlertProps } from '@meldingen/ui'

import { ApiErrorAlert as UIApiErrorAlert } from '@meldingen/ui'

type Props = Pick<ApiErrorAlertProps, 'shouldFocus'> & {
  description?: string
  heading?: string
}

export const ApiErrorAlert = ({ description, heading, shouldFocus }: Props) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <UIApiErrorAlert
      className="ams-mb-m"
      description={description ?? t('description')}
      heading={heading ?? t('heading')}
      headingLevel={2}
      shouldFocus={shouldFocus}
    />
  )
}
