import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'

import 'leaflet/dist/leaflet.css'

import type { Coordinates } from 'apps/public/src/types'

import { ControlsOverlay } from './ControlsOverlay/ControlsOverlay'
import styles from './Map.module.css'
import { marker } from './Marker/Marker'

type Props = {
  coordinates?: Coordinates
  showAssetList?: boolean
  setCoordinates: (coordinates: Coordinates) => void
}

export const Map = ({ coordinates, showAssetList, setCoordinates }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)

  const markerRef = useRef<L.Marker | null>(null)

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

    map.on('click', (e) => {
      setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove()
    }
  }, [mapInstance, setCoordinates])

  // Add marker to map based on coordinates
  useEffect(() => {
    if (mapInstance && coordinates) {
      // Remove existing marker layer
      markerRef.current?.remove()

      // Create marker layer and add to map
      const newMarker = L.marker(L.latLng([coordinates.lat, coordinates.lng]), { icon: marker }).addTo(mapInstance)

      // Store marker layer in ref
      markerRef.current = newMarker
    }
  }, [mapInstance, coordinates])

  return (
    <div className={`${styles.container} ${showAssetList && styles.hideMap}`}>
      <div className={styles.map} ref={mapRef} />
      <ControlsOverlay mapInstance={mapInstance} setCoordinates={setCoordinates} />
    </div>
  )
}
