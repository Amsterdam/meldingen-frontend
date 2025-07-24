import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

import { ControlsOverlay } from './components/ControlsOverlay/ControlsOverlay'
import { Crosshair } from './components/Crosshair/Crosshair'
import { marker } from './components/Marker/Marker'
import { updateWfsLayer } from './utils/updateWfsLayer'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './Map.module.css'

type Props = {
  classification?: string
  coordinates?: Coordinates
  showAssetList?: boolean
  setCoordinates: (coordinates: Coordinates) => void
}

export const Map = ({ classification, coordinates, showAssetList, setCoordinates }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const assetLayerRef = useRef<L.Layer | null>(null)

  // Use state instead of a ref for storing the Leaflet map object otherwise you may run into DOM issues when React StrictMode is enabled
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  useEffect(() => {
    mapInstance?.on('moveend', () => updateWfsLayer(mapInstance, assetLayerRef, classification))

    return () => {
      mapInstance?.off('moveend', () => updateWfsLayer(mapInstance, assetLayerRef, classification))
    }
  }, [mapInstance])

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

    const crosshair = document.getElementById('crosshair')!

    map.on('keydown', ({ originalEvent }) => {
      // Show crosshair when map is controlled using arrow keys
      if (
        originalEvent.key === 'ArrowUp' ||
        originalEvent.key === 'ArrowDown' ||
        originalEvent.key === 'ArrowLeft' ||
        originalEvent.key === 'ArrowRight'
      ) {
        crosshair.style.display = 'block'
      }
      // Add marker on spacebar or Enter key press
      if (originalEvent.key === ' ' || originalEvent.key === 'Enter') {
        const center = map.getCenter()

        return setCoordinates({
          lat: center.lat,
          lng: center.lng,
        })
      }
    })

    // Hide crosshair on following events
    map.on('blur mousemove dragstart', () => {
      crosshair.style.display = 'none'
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
      const newMarker = L.marker(L.latLng([coordinates.lat, coordinates.lng]), { icon: marker, keyboard: false }).addTo(
        mapInstance,
      )

      // Store marker layer in ref
      markerRef.current = newMarker

      // Zoom to the marker location
      const currentZoom = mapInstance.getZoom()
      const flyToMinZoom = 18
      mapInstance.flyTo([coordinates.lat, coordinates.lng], currentZoom < flyToMinZoom ? flyToMinZoom : currentZoom)
    }
  }, [mapInstance, coordinates])

  return (
    <div className={`${styles.container} ${showAssetList && styles.hideMap}`}>
      <div className={styles.map} ref={mapRef} />
      <Crosshair id="crosshair" />
      <ControlsOverlay mapInstance={mapInstance} setCoordinates={setCoordinates} />
    </div>
  )
}
