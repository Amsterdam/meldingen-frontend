import type { Ref } from 'react'

import { Alert } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'

import { Paragraph } from '@meldingen/ui'

import styles from './SystemErrorAlert.module.css'

type Props = {
  ref?: Ref<HTMLDivElement>
}

export const SystemErrorAlert = ({ ref }: Props) => {
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
}
