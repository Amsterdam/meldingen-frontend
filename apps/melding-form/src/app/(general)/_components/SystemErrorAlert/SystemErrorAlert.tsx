import { Alert } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { Paragraph } from '@meldingen/ui'

export const SystemErrorAlert = () => {
  const t = useTranslations('shared')

  return (
    <Alert role="alert" headingLevel={2} severity="error" heading={t('system-error-alert-title')} className="ams-mb-xl">
      <Paragraph>{t('system-error-alert-description')}</Paragraph>
    </Alert>
  )
}
