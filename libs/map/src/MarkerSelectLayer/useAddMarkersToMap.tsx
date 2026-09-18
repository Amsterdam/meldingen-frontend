import type { Layer, Map, MarkerCluster, PointExpression } from 'leaflet'
import type { RefObject } from 'react'

import L, { divIcon, latLng, Marker } from 'leaflet'
import 'leaflet.markercluster'
import { useEffect } from 'react'

import type { Feature } from '@meldingen/api-client'

import type { Coordinates } from '../types'

import { getAssetIcon } from './utils/getAssetIcon'

export const createClusterIcon = (cluster: MarkerCluster, isActive?: boolean) => {
  // Cluster markers should not be keyboard accessible
  cluster.options.keyboard = false

  const className = isActive ? 'meldingen-cluster active' : 'meldingen-cluster'
  const iconSize: PointExpression = isActive ? [80, 80] : [54, 54]
  const iconAnchor: PointExpression = isActive ? [40, 40] : [27, 27]

  return divIcon({
    className,
    html: cluster.getChildCount().toString(),
    iconAnchor,
    iconSize,
  })
}

export type Props = {
  features: Feature[]
  iconConfig: {
    entry?: string
    folder?: string
  }
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
  iconConfig,
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

    const markerIds = new WeakMap<Marker, Feature['id']>()
    const selectedMarkerIds = new Set(selectedMarkers.map(({ id }) => id))

    markerLayerRef.current?.remove()

    const markerClusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const isActive = cluster.getAllChildMarkers().some((marker) => {
          const markerId = markerIds.get(marker)

          return markerId != null && selectedMarkerIds.has(markerId)
        })

        return createClusterIcon(cluster, isActive)
      },
      showCoverageOnHover: false,
    })

    for (const feature of features) {
      if (!feature.geometry || feature.geometry.type !== 'Point') continue

      const geometry = feature.geometry
      const [lng, lat] = geometry.coordinates
      const latlng = latLng(lat, lng)
      const isSelected = selectedMarkerIds.has(feature.id)

      const marker = new Marker(latlng, {
        icon: getAssetIcon(feature, isSelected, iconConfig),
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

          return
        }

        if (selectedMarkers.length >= maxMarkers) {
          onMaxMarkersReached(true)
          return
        }

        onSelectedMarkersChange([feature, ...selectedMarkers])
        updateSelectedPoint({ lat, lng })
      })

      // Load fallback whe icon fails to load (e.g. due to missing icon for a specific asset type)
      marker.on('add', () => {
        const el = marker.getElement() as HTMLImageElement | null
        if (!el) return

        el.addEventListener(
          'error',
          () => {
            el.src = '/asset-fallback.svg'
          },
          { once: true },
        )
      })

      markerIds.set(marker, feature.id)

      markerClusterGroup.addLayer(marker)
    }

    markerLayerRef.current = markerClusterGroup
    markerClusterGroup.addTo(map)

    return () => {
      markerClusterGroup.clearLayers()
      markerLayerRef.current = null
    }
  }, [
    map,
    features,
    selectedMarkers,
    iconConfig,
    maxMarkers,
    onMaxMarkersReached,
    onSelectedMarkersChange,
    updateSelectedPoint,
  ])
}
