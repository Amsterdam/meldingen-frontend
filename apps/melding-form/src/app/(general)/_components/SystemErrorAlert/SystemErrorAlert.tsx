import { Alert } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { Paragraph } from '@meldingen/ui'

export const SystemErrorAlert = () => {
  const t = useTranslations('shared')

  return (
    <Alert className="ams-mb-xl" heading={t('system-error-alert-title')} headingLevel={2} role="alert" severity="error">
      <Paragraph>{t('system-error-alert-description')}</Paragraph>
    </Alert>
  )
}
