import { latLng, LeafletKeyboardEvent, LeafletMouseEvent, marker, Marker } from 'leaflet'
import { useContext, useEffect, useRef } from 'react'

import { Crosshair } from './Crosshair'
import { MapContext } from '../Map/Map'
import { defaultIcon } from '../markerIcons'
import { Coordinates } from '../types'

type Props = {
  selectedPoint?: Coordinates
  onSelectedPointChange: (coordinates: Coordinates) => void
}

export const PointSelectLayer = ({ selectedPoint, onSelectedPointChange }: Props) => {
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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(originalEvent.key)) {
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

  // Add marker to map based on selected point
  useEffect(() => {
    if (!map) return

    if (!selectedPoint) {
      markerRef.current?.remove()
      markerRef.current = null
      return
    }

    // Remove previous marker
    markerRef.current?.remove()

    const { lat, lng } = selectedPoint

    // Create marker and add to map
    const newMarker = marker(latLng([lat, lng]), {
      icon: defaultIcon,
      keyboard: false,
    }).addTo(map)

    // Store marker layer in ref
    markerRef.current = newMarker

    // Zoom to marker
    const currentZoom = map.getZoom()
    const flyToMinZoom = 18
    map.flyTo([lat, lng], currentZoom < flyToMinZoom ? flyToMinZoom : currentZoom)
  }, [map, selectedPoint])

  return <Crosshair id="crosshair" />
}
