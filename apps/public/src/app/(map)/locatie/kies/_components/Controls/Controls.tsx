import L from 'leaflet'
import { Button, Paragraph } from '@amsterdam/design-system-react'
import { EnlargeIcon, IndeterminateIcon } from '@amsterdam/design-system-react-icons'
import { Notification } from '../Notification/Notification'
import { useState } from 'react'
import { marker } from '../Marker/Marker'

import styles from './Controls.module.css'

type Controls = 'IN' | 'OUT'

export const Controls = ({ mapInstance }: any) => {
  const [markerLayer, setMarkerLayer] = useState<L.Marker | null>(null)

  const [notification, setNotification] = useState<{ heading: string; description: string } | null>(null)

  const handleZoom = (control: Controls) => {
    console.log('handle zoom', control)

    if (control === 'IN') {
      mapInstance?.setZoom(mapInstance.getZoom() + 1)
    }
    if (control === 'OUT') {
      mapInstance?.setZoom(mapInstance.getZoom() - 1)
    }
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
      <div className={styles['overlay-top-left']}>
        <Button variant="secondary" onClick={handleCurrentLocationButtonClick}>
          Mijn locatie
        </Button>
        {notification && (
          <Notification heading={notification.heading} closeable onClose={() => setNotification(null)}>
            <Paragraph>{notification.description}</Paragraph>
          </Notification>
        )}
      </div>
      <div className={styles['overlay-bottom-right']}>
        <Button variant="secondary" iconOnly icon={EnlargeIcon} onClick={() => handleZoom('IN')}>
          Inzoomen
        </Button>
        <Button variant="secondary" iconOnly icon={IndeterminateIcon} onClick={() => handleZoom('OUT')}>
          Uitzoomen
        </Button>
      </div>
    </>
  )
}
