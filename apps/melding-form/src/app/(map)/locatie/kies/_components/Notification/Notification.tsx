import { Heading, Icon, IconButton, Paragraph, Row } from '@amsterdam/design-system-react'
import { ErrorFillIcon, InfoFillIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { useId } from 'react'

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
    severity: 'error',
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

export type Props = {
  assetNames: { plural: string; singular: string }
  maxAssets: number
  onClose: () => void
  type: NotificationType
}

/**
 * Notification is mostly a rebuild of the Amsterdam Design System Alert component.
 * The only change is a scroll container inside the content area.
 * This is done to make sure the component doesn't enlarge the Map it is shown in.
 */
export const Notification = ({ assetNames, maxAssets, onClose, type }: Props) => {
  const t = useTranslations('select-location.notifications')
  const texts = getTexts(t, maxAssets, assetNames)
  const id = useId()
  const severity = texts[type].severity

  return (
    <section
      aria-labelledby={id}
      className={clsx('ams-alert', severity && `ams-alert--${severity}`, styles.notification)}
      role="alert"
    >
      <div className="ams-alert__severity-indicator">
        <Icon color="inverse" size="heading-3" svg={severity === 'error' ? ErrorFillIcon : InfoFillIcon} />
      </div>
      <div className={clsx('ams-alert__content', styles.content)}>
        <div className={styles.scrollContainer}>
          <Row align="between" alignVertical="start">
            <Heading id={id} level={2} size="level-3">
              {texts[type].title}
            </Heading>
            <IconButton label={texts[type].closeButton} onClick={onClose} size="heading-3" />
          </Row>
          {type === 'location-service-disabled' && texts[type].description && (
            <Paragraph>{texts[type].description}</Paragraph>
          )}
        </div>
      </div>
    </section>
  )
}
