import L, { divIcon, latLng, Layer, Map, Marker, MarkerCluster } from 'leaflet'
import 'leaflet.markercluster'
import { RefObject, useEffect } from 'react'

import { Feature } from '@meldingen/api-client'

import { Coordinates } from '../types'
import { getContainerIcon } from './utils/getContainerIcon'

export const createClusterIcon = (cluster: MarkerCluster) => {
  // Cluster markers should not be keyboard accessible
  cluster.options.keyboard = false

  return divIcon({
    className: 'meldingen-cluster',
    html: cluster.getChildCount().toString(),
    iconAnchor: [35, 35],
    iconSize: [70, 70],
  })
}

export type Props = {
  features: Feature[]
  map?: Map
  markerLayerRef: RefObject<Layer | null>
  maxMarkers: number
  onMaxMarkersReached: (maxReached: boolean) => void
  onSelectedMarkersChange: (selectedMarkers: Feature[]) => void
  selectedMarkers: Feature[]
  updateSelectedPoint: (point?: Coordinates) => void
}

export const useAddMarkersToMap = ({
  features,
  map,
  markerLayerRef,
  maxMarkers,
  onMaxMarkersReached,
  onSelectedMarkersChange,
  selectedMarkers,
  updateSelectedPoint,
}: Props) => {
  useEffect(() => {
    if (!map || features.length === 0) return

    markerLayerRef.current?.remove()

    const markerClusterGroup = L.markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      showCoverageOnHover: false,
    })

    features.forEach((feature) => {
      if (!feature.geometry || feature.geometry.type !== 'Point') return

      const geometry = feature.geometry
      const [lng, lat] = geometry.coordinates
      const latlng = latLng(lat, lng)
      const isSelected = selectedMarkers.some((a) => a.id === feature.id)

      const marker = new Marker(latlng, {
        icon: getContainerIcon(feature, isSelected),
        keyboard: false,
      })

      marker.on('click', () => {
        if (isSelected) {
          onMaxMarkersReached(false)
          onSelectedMarkersChange(selectedMarkers.filter((a) => a.id !== feature.id))

          if (selectedMarkers.length <= 1) {
            updateSelectedPoint(undefined)
          } else if (feature.id === selectedMarkers[0].id) {
            // Set the address of the second selected marker when
            // the last selected marker (#1 on the list) is deselected
            // @ts-expect-error an marker always has coordinates
            const [y, x] = selectedMarkers[1].geometry.coordinates
            updateSelectedPoint({ lat: x, lng: y })
          }
        } else {
          if (selectedMarkers.length >= maxMarkers) {
            onMaxMarkersReached(true)
            return
          }
          onSelectedMarkersChange([feature, ...selectedMarkers])
          updateSelectedPoint({ lat, lng })
        }
      })

      markerClusterGroup.addLayer(marker)
    })

    markerLayerRef.current = markerClusterGroup
    markerClusterGroup.addTo(map)

    return () => {
      markerClusterGroup.clearLayers()
      markerLayerRef.current = null
    }
  }, [map, features, selectedMarkers])
}
