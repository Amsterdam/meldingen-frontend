import type { AlertProps } from '@amsterdam/design-system-react'

import { Alert, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import type { NotificationType } from '../../SelectLocation'

import styles from './Notification.module.css'

const getTexts = (
  t: (key: string, options?: { assetNamesPlural: string; assetNamesSingular: string; maxAssets: number }) => string,
  maxAssets: number,
  assetNames: { plural: string; singular: string },
) => ({
  'location-service-disabled': {
    closeButton: t('location-service-disabled.close-button'),
    description: t('location-service-disabled.description'),
    severity: 'error' as AlertProps['severity'],
    title: t('location-service-disabled.title'),
  },
  'too-many-assets': {
    closeButton: t('too-many-assets.close-button'),
    severity: undefined,
    title: t('too-many-assets.title', {
      assetNamesPlural: assetNames.plural,
      assetNamesSingular: assetNames.singular,
      maxAssets,
    }),
  },
})

export type Props = Omit<AlertProps, 'heading' | 'headingLevel'> & {
  assetNames: { plural: string; singular: string }
  maxAssets: number
  type: NotificationType
}

export const Notification = ({ assetNames, maxAssets, type, ...restProps }: Props) => {
  const t = useTranslations('select-location.notifications')
  const texts = getTexts(t, maxAssets, assetNames)

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
