import { Paragraph } from '@amsterdam/design-system-react'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import { CurrentLocationButton } from './CurrentLocationButton/CurrentLocationButton'
import styles from './map.module.css'
import { Notification } from './Notification/Notification'

export const BaseLayer = () => {
  const mapRef = useRef<HTMLDivElement>(null)

  const [notification, setNotification] = useState<{ heading: string; description: string } | null>(null)

  // Use state instead of a ref for storing the Leaflet map object otherwise you may run into DOM issues when React StrictMode is enabled
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

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

    // TODO: temporarily log coordinates on click
    map.on('click', (e) => {
      console.log(`Lat, Lon : ${e.latlng.lat}, ${e.latlng.lng}`)
    })

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove()
    }
  }, [mapInstance])

  return (
    <div className={styles.container}>
      <div className={styles.map} ref={mapRef} />
      <div className={styles.overlay}>
        <CurrentLocationButton setNotification={setNotification}>Mijn locatie</CurrentLocationButton>
        {notification && (
          <Notification heading={notification.heading} closeable onClose={() => setNotification(null)}>
            <Paragraph>{notification.description}</Paragraph>
          </Notification>
        )}
      </div>
    </div>
  )
}
