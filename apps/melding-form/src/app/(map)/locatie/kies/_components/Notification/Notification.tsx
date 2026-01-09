import type { AlertProps } from '@amsterdam/design-system-react'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { MAX_ASSETS } from '../../SelectLocation'
import { NotificationType } from '../../SelectLocation'

import styles from './Notification.module.css'

const getTexts = (t: (key: string, options?: { maxAssets: number }) => string) => ({
  'location-service-disabled': {
    closeButton: t('location-service-disabled.close-button'),
    description: t('location-service-disabled.description'),
    severity: 'error' as AlertProps['severity'],
    title: t('location-service-disabled.title'),
  },
  'pdok-no-address-found': {
    closeButton: t('pdok-no-address-found.close-button'),
    description: t('pdok-no-address-found.description'),
    severity: 'error' as AlertProps['severity'],
    title: t('pdok-no-address-found.title'),
  },
  'too-many-assets': {
    closeButton: t('too-many-assets.close-button'),
    description: undefined,
    severity: undefined,
    title: t('too-many-assets.title', { maxAssets: MAX_ASSETS }),
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
      {texts[type].description && <Paragraph>{texts[type].description}</Paragraph>}
    </Alert>
  )
}
