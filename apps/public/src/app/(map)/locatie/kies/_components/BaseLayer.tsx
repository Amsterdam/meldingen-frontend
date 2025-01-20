import { Button, Paragraph } from '@amsterdam/design-system-react'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import { EnlargeIcon, IndeterminateIcon } from '@amsterdam/design-system-react-icons'
import 'leaflet/dist/leaflet.css'

import type { Coordinates } from '../page'

import styles from './map.module.css'
import { marker } from './Marker/Marker'
import { Notification } from './Notification/Notification'

type Props = {
  setCoordinates: (coordinates: Coordinates) => void
}

type Controls = 'IN' | 'OUT'

export const BaseLayer = ({ setCoordinates }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)

  // Use state instead of a ref for storing the Leaflet map object otherwise you may run into DOM issues when React StrictMode is enabled
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  const [markerLayer, setMarkerLayer] = useState<L.Marker | null>(null)

  const [notification, setNotification] = useState<{ heading: string; description: string } | null>(null)

  // This could be a useState but as we don't expect this to fire more than once, use ref as it is mutable and won't trigger any further re-render
  const createdMapInstance = useRef(false)

  useEffect(() => {
    // Ensure that the target DOM element exists and that the map doesn't already exist (to prevent duplicate renders in StrictMode)
    if (mapRef.current === null || createdMapInstance.current !== false) {
      return undefined
    }

    const map = new L.Map(mapRef.current, {
      center: L.latLng([52.370216, 4.895168]),
      zoom: 14,
      layers: [
        L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm/{z}/{x}/{y}.png', {
          attribution: '',
          subdomains: ['t1', 't2', 't3', 't4'],
        }),
      ],
      zoomControl: false,
      maxZoom: 18,
      minZoom: 11,
      // Prevent the user browsing too far outside Amsterdam otherwise the map will render blank greyspace.
      // Amsterdam tile layer only supports Amsterdam and the immediate surrounding areas
      maxBounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
    })

    // Remove Leaflet link from the map
    map.attributionControl.setPrefix(false)

    // Set the map as created and store the object to state
    createdMapInstance.current = true
    setMapInstance(map)

    map.on('click', (e) => {
      setCoordinates({ lat: e.latlng.lat, lon: e.latlng.lng })
    })

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove()
    }
  }, [mapInstance, setCoordinates])

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

  const handleZoom = (control: Controls) => {
    if (control === 'IN') {
      mapInstance?.setZoom(mapInstance.getZoom() + 1)
    }
    if (control === 'OUT') {
      mapInstance?.setZoom(mapInstance.getZoom() - 1)
    }
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
    <div className={styles.container}>
      <div className={styles.map} ref={mapRef} />
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
    </div>
  )
}
