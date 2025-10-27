import L from 'leaflet'
import { Dispatch, PropsWithChildren, SetStateAction, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

import { Feature } from '@meldingen/api-client'

import { defaultIcon } from '../../markerIcons'
import { ControlsOverlay } from './components/ControlsOverlay/ControlsOverlay'
import { Crosshair } from './components/Crosshair/Crosshair'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './Map.module.css'

export type Props = PropsWithChildren & {
  coordinates?: Coordinates
  isHidden?: boolean
  mapInstance: L.Map | null
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setMapInstance: (map: L.Map) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
  onCurrentLocationError: () => void
}

export const Map = ({
  children,
  coordinates,
  isHidden,
  mapInstance,
  selectedAssets,
  setCoordinates,
  setMapInstance,
  setSelectedAssets,
  onCurrentLocationError,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const pointerMarkerRef = useRef<L.Marker | null>(null)

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
      setSelectedAssets([])
    })

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove()
    }
  }, [mapInstance, setCoordinates])

  // Add marker to map based on coordinates
  useEffect(() => {
    if (!coordinates) {
      pointerMarkerRef.current?.remove()
      return
    }

    if (mapInstance && coordinates) {
      // Remove existing marker layer
      pointerMarkerRef.current?.remove()

      // If there are selected assets, do not add a pointer marker
      if (selectedAssets.length > 0) return

      // Create marker layer and add to map
      const newMarker = L.marker(L.latLng([coordinates.lat, coordinates.lng]), {
        icon: defaultIcon,
        keyboard: false,
      }).addTo(mapInstance)

      // Store marker layer in ref
      pointerMarkerRef.current = newMarker

      // Zoom to the marker location
      const currentZoom = mapInstance.getZoom()
      const flyToMinZoom = 18
      mapInstance.flyTo([coordinates.lat, coordinates.lng], currentZoom < flyToMinZoom ? flyToMinZoom : currentZoom)
    }
  }, [mapInstance, coordinates])

  useEffect(() => {
    if (mapInstance) {
      // Leaflet has to know it should recalculate dimensions of the map
      // when it is shown/hidden as this changes the size of the map container
      mapInstance.invalidateSize()
    }
  }, [isHidden])

  return (
    <div className={`${styles.container} ${isHidden && styles.hideMap}`}>
      <div className={styles.map} ref={mapRef} />
      <Crosshair id="crosshair" />
      <ControlsOverlay
        mapInstance={mapInstance}
        setCoordinates={setCoordinates}
        onCurrentLocationError={onCurrentLocationError}
      >
        {children}
      </ControlsOverlay>
    </div>
  )
}
