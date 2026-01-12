import { Alert } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { ForwardedRef, forwardRef } from 'react'

import { Paragraph } from '@meldingen/ui'

import styles from './SystemErrorAlert.module.css'

export const SystemErrorAlert = forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
  const t = useTranslations('shared')

  return (
    <Alert
      className={clsx('ams-mb-m', styles.alert)}
      heading={t('system-error-alert-title')}
      headingLevel={2}
      ref={ref}
      role="alert"
      severity="error"
      tabIndex={-1}
    >
      <Paragraph>{t('system-error-alert-description')}</Paragraph>
    </Alert>
  )
})

SystemErrorAlert.displayName = 'SystemErrorAlert'
