import { Button, Paragraph } from '@amsterdam/design-system-react'
import { EnlargeIcon, MinimiseIcon } from '@amsterdam/design-system-react-icons'
import L from 'leaflet'
import { useState } from 'react'

import { marker } from '../Marker/Marker'
import { Notification } from '../Notification/Notification'

import styles from './ControlsOverlay.module.css'

type Props = {
  mapInstance: L.Map | null
}

export const ControlsOverlay = ({ mapInstance }: Props) => {
  const [markerLayer, setMarkerLayer] = useState<L.Marker | null>(null)

  const [notification, setNotification] = useState<{ heading: string; description: string } | null>(null)

  const handleZoomIn = () => {
    mapInstance?.setZoom(mapInstance.getZoom() + 1)
  }
  const handleZoomOut = () => {
    mapInstance?.setZoom(mapInstance.getZoom() - 1)
  }

  const onSuccess: PositionCallback = ({ coords }) => {
    // TODO: is this correct? What should happen when you click the button without a map instance?
    if (!mapInstance) return

    const { latitude, longitude } = coords

    // Remove existing marker layer
    markerLayer?.remove()

    // Create marker layer and add to map
    const newMarker = L.marker(L.latLng([latitude, longitude]), { icon: marker }).addTo(mapInstance)

    // Store marker layer in state
    setMarkerLayer(newMarker)
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
