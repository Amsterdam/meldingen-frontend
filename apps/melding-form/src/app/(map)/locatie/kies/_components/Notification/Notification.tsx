import type { AlertProps } from '@amsterdam/design-system-react'
import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { MAX_ASSETS } from '../../_utils/addAssetLayerToMap'
import { NotificationType } from '../../SelectLocation'

import styles from './Notification.module.css'

const getTexts = (t: (key: string, options?: { maxAssets: number }) => string) => ({
  'too-many-assets': {
    closeButton: t('too-many-assets.close-button'),
    title: t('too-many-assets.title', { maxAssets: MAX_ASSETS }),
    severity: undefined,
  },
  'location-service-disabled': {
    closeButton: t('location-service-disabled.close-button'),
    title: t('location-service-disabled.title'),
    description: t('location-service-disabled.description'),
    severity: 'error' as AlertProps['severity'],
  },
})

export type Props = Omit<AlertProps, 'heading' | 'headingLevel'> & { type: NotificationType }

export const Notification = ({ type, ...restProps }: Props) => {
  const t = useTranslations('select-location.notifications')
  const texts = getTexts(t)

  return (
    <Alert
      {...restProps}
      className={styles.notification}
      closeable
      closeButtonLabel={texts[type].closeButton}
      heading={texts[type].title}
      headingLevel={2}
      role="alert"
      severity={texts[type].severity}
    >
      {type === 'location-service-disabled' && texts[type].description && (
        <Paragraph>{texts[type].description}</Paragraph>
      )}
    </Alert>
  )
}
