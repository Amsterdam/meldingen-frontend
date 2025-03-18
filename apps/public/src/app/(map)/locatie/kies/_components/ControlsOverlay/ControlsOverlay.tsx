import { Button, Paragraph } from '@amsterdam/design-system-react'
import { EnlargeIcon, MinimiseIcon } from '@amsterdam/design-system-react-icons'
import type L from 'leaflet'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Notification } from '../Notification/Notification'
import type { Coordinates } from 'apps/public/src/types'

import styles from './ControlsOverlay.module.css'

type Props = {
  mapInstance: L.Map | null
  setCoordinates: (coordinates: Coordinates) => void
}

export const ControlsOverlay = ({ mapInstance, setCoordinates }: Props) => {
  const [showNotification, setShowNotification] = useState<boolean>(false)

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

  const onError = () => setShowNotification(true)

  const handleCurrentLocationButtonClick = () => navigator.geolocation.getCurrentPosition(onSuccess, onError)

  return (
    <>
      <div className={styles.overlayTopLeft}>
        <Button variant="secondary" onClick={handleCurrentLocationButtonClick}>
          {t('current-location-button')}
        </Button>
        {showNotification && (
          <Notification
            heading={t('notification.title')}
            closeable
            closeButtonLabel={t('notification.close-button')}
            onClose={() => setShowNotification(false)}
          >
            <Paragraph>{t('notification.description')}</Paragraph>
          </Notification>
        )}
      </div>
      <div className={styles.overlayBottomRight}>
        <Button variant="secondary" iconOnly icon={EnlargeIcon} onClick={handleZoomIn}>
          {t('zoom-in')}
        </Button>
        <Button variant="secondary" iconOnly icon={MinimiseIcon} onClick={handleZoomOut}>
          {t('zoom-out')}
        </Button>
      </div>
    </>
  )
}
