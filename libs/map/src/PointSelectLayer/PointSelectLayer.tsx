import { latLng, LeafletKeyboardEvent, LeafletMouseEvent, marker, Marker } from 'leaflet'
import { useContext, useEffect, useRef } from 'react'

import { MapContext } from '../Map/Map'
import { defaultIcon } from '../markerIcons'
import { Coordinates } from '../types'
import { Crosshair } from './Crosshair'

export const FLY_TO_MIN_ZOOM = 18

type Props = {
  hideSelectedPoint: boolean
  onSelectedPointChange: (point: Coordinates) => void
  selectedPoint?: Coordinates
}

export const PointSelectLayer = ({ hideSelectedPoint, onSelectedPointChange, selectedPoint }: Props) => {
  const map = useContext(MapContext)
  const markerRef = useRef<Marker | null>(null)

  // Handlers
  const handleMapClick = (e: LeafletMouseEvent) => {
    onSelectedPointChange(e.latlng)
  }

  const handleMapKeydown = ({ originalEvent }: LeafletKeyboardEvent) => {
    const crosshair = document.getElementById('crosshair')

    if (!map || !crosshair) return

    // Show crosshair when map is controlled using arrow keys
    if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(originalEvent.key)) {
      crosshair.style.display = 'block'
    }
    // Select point on spacebar or Enter
    if (originalEvent.key === ' ' || originalEvent.key === 'Enter') {
      onSelectedPointChange(map.getCenter())
    }
  }

  const handleHideCrosshair = () => {
    const crosshair = document.getElementById('crosshair')

    if (crosshair) crosshair.style.display = 'none'
  }

  // When hideSelectedPoint is true:
  // - Only fly to the selected point on initial page load
  // - When the selected point changes after that, do not fly to it
  useEffect(() => {
    if (!hideSelectedPoint || !map || !selectedPoint) return
    const { lat, lng } = selectedPoint

    const currentZoom = map.getZoom()
    map.flyTo([lat, lng], currentZoom < FLY_TO_MIN_ZOOM ? FLY_TO_MIN_ZOOM : currentZoom)
  }, [map])

  // Register map events
  useEffect(() => {
    if (!map) return

    map.on('click', handleMapClick)
    map.on('keydown', handleMapKeydown)
    map.on('blur mousemove dragstart', handleHideCrosshair)

    return () => {
      map.off('click', handleMapClick)
      map.off('keydown', handleMapKeydown)
      map.off('blur mousemove dragstart', handleHideCrosshair)
    }
  }, [map])

  // Add marker at selected point and zoom to it when hideSelectedPoint is false
  useEffect(() => {
    // Remove previous marker
    markerRef.current?.remove()

    if (!map || !selectedPoint || hideSelectedPoint) return

    const { lat, lng } = selectedPoint

    // Create marker and add to map
    const newMarker = marker(latLng([lat, lng]), {
      icon: defaultIcon,
      keyboard: false,
    }).addTo(map)

    // Store marker layer in ref
    markerRef.current = newMarker

    // Zoom to selected point
    const currentZoom = map.getZoom()
    map.flyTo([lat, lng], currentZoom < FLY_TO_MIN_ZOOM ? FLY_TO_MIN_ZOOM : currentZoom)
  }, [map, selectedPoint, hideSelectedPoint])

  return <Crosshair id="crosshair" />
}
