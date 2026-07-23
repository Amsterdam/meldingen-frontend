import { useTranslations } from 'next-intl'

import { ApiErrorAlert as UIApiErrorAlert } from '@meldingen/ui'

type Props = {
  description?: string
  heading?: string
  shouldRefocus: boolean
}

export const ApiErrorAlert = ({ description, heading, shouldRefocus }: Props) => {
  const t = useTranslations('shared.api-error-alert')

  return (
    <UIApiErrorAlert
      className="ams-mb-m"
      description={description ?? t('description')}
      heading={heading ?? t('heading')}
      headingLevel={2}
      shouldRefocus={shouldRefocus}
    />
  )
}
