import type { AlertProps } from '@amsterdam/design-system-react'
import { Button, Paragraph } from '@amsterdam/design-system-react'
import { MinusIcon, PlusIcon } from '@amsterdam/design-system-react-icons'
import type L from 'leaflet'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Notification } from '../Notification/Notification'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './ControlsOverlay.module.css'

type Props = {
  mapInstance: L.Map | null
  setCoordinates: (coordinates: Coordinates) => void
}

type NotificationType = {
  heading: AlertProps['heading']
  closeButtonLabel: AlertProps['closeButtonLabel']
  severity: AlertProps['severity']
}

export const ControlsOverlay = ({ mapInstance, setCoordinates }: Props) => {
  const [notification, setNotification] = useState<NotificationType | null>(null)

  const t = useTranslations('select-location.controls-overlay')

  const handleZoomIn = () => {
    mapInstance?.setZoom(mapInstance.getZoom() + 1)
  }
  const handleZoomOut = () => {
    mapInstance?.setZoom(mapInstance.getZoom() - 1)
  }

  // eslint-disable-next-line no-undef
  const onSuccess: PositionCallback = ({ coords }) => {
    // TODO: is this correct? What should happen when you click the button without a map instance?
    if (!mapInstance) return undefined

    const { latitude, longitude } = coords

    return setCoordinates({
      lat: latitude,
      lng: longitude,
    })
  }

  const onError = () =>
    setNotification({
      closeButtonLabel: t('notification.close-button'),
      heading: t('notification.title'),
      severity: 'error',
    })

  const handleCurrentLocationButtonClick = () => navigator.geolocation.getCurrentPosition(onSuccess, onError)

  return (
    <>
      <div className={styles.overlayTopLeft}>
        <Button variant="secondary" onClick={handleCurrentLocationButtonClick}>
          {t('current-location-button')}
        </Button>
        {notification && (
          <Notification
            closeable
            closeButtonLabel={notification.closeButtonLabel}
            heading={notification.heading}
            headingLevel={2}
            onClose={() => setNotification(null)}
            severity={notification.severity}
          >
            <Paragraph>{t('notification.description')}</Paragraph>
          </Notification>
        )}
      </div>
      <div className={styles.overlayBottomRight}>
        <Button variant="secondary" iconOnly icon={PlusIcon} onClick={handleZoomIn}>
          {t('zoom-in')}
        </Button>
        <Button variant="secondary" iconOnly icon={MinusIcon} onClick={handleZoomOut}>
          {t('zoom-out')}
        </Button>
      </div>
    </>
  )
}
