import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import styles from './MapLoadingIndicator.module.css'

export const MapLoadingIndicator = () => {
  const t = useTranslations('select-location.errors')

  return (
    <div className={styles.loadingContainer}>
      <Alert className={styles.noJavaScriptAlert} heading={t('no-js-alert-title')} headingLevel={2}>
        <Paragraph>{t('no-js-alert-description')}</Paragraph>
      </Alert>
    </div>
  )
}
