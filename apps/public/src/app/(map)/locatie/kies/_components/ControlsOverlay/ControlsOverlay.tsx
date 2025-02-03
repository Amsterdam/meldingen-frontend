import { Button, Paragraph } from '@amsterdam/design-system-react'
import { EnlargeIcon, MinimiseIcon } from '@amsterdam/design-system-react-icons'
import type L from 'leaflet'
import { useState } from 'react'

import { Notification } from '../Notification/Notification'

import styles from './ControlsOverlay.module.css'

type Props = {
  mapInstance: L.Map | null
}

export const ControlsOverlay = ({ mapInstance }: Props) => {
  const [notification, setNotification] = useState<{ heading: string; description: string } | null>(null)

  const handleZoomIn = () => {
    mapInstance?.setZoom(mapInstance.getZoom() + 1)
  }
  const handleZoomOut = () => {
    mapInstance?.setZoom(mapInstance.getZoom() - 1)
  }

  const onSuccess: PositionCallback = () => {
    // TODO: is this correct? What should happen when you click the button without a map instance?
    if (!mapInstance) return undefined

    // TODO: call setCoordinates from here, the marker should be set based on that
    return undefined
  }

  const onError = () => {
    // TODO: these texts should come from the BE, or a config / env vars
    setNotification({
      heading: 'meldingen.amsterdam.nl heeft geen toestemming om uw locatie te gebruiken.',
      description: 'Dit kunt u wijzigen in de voorkeuren of instellingen van uw browser of systeem.',
    })
  }

  const handleCurrentLocationButtonClick = () => navigator.geolocation.getCurrentPosition(onSuccess, onError)

  return (
    <>
      <div className={styles.overlayTopLeft}>
        <Button variant="secondary" onClick={handleCurrentLocationButtonClick}>
          Mijn locatie
        </Button>
        {notification && (
          <Notification heading={notification.heading} closeable onClose={() => setNotification(null)}>
            <Paragraph>{notification.description}</Paragraph>
          </Notification>
        )}
      </div>
      <div className={styles.overlayBottomRight}>
        <Button variant="secondary" iconOnly icon={EnlargeIcon} onClick={handleZoomIn}>
          Inzoomen
        </Button>
        <Button variant="secondary" iconOnly icon={MinimiseIcon} onClick={handleZoomOut}>
          Uitzoomen
        </Button>
      </div>
    </>
  )
}
