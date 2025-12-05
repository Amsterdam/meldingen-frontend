import L, { divIcon, latLng, Layer, Map, Marker, MarkerCluster } from 'leaflet'
import 'leaflet.markercluster'
import { RefObject, useContext, useEffect, useRef } from 'react'

import { Feature, getWfsByName } from '@meldingen/api-client'

import { MapContext } from '../Map/Map'
import { Coordinates } from '../types'
import { getContainerIcon } from './utils/getContainerIcon'
import { getWfsFilter } from './utils/getWfsFilter'

import './cluster.css'

const classificationsWithAssets = ['container']
export const ZOOM_THRESHOLD = 16

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

const fetchFeaturesOnMoveEnd = async (
  classification: Props['classification'],
  map: Map,
  onFeaturesChange: Props['onFeaturesChange'],
  markerLayerRef: RefObject<Layer | null>,
) => {
  // Don't fetch markers when map is hidden with display: none
  const size = map.getSize()
  const mapIsHidden = size.x === 0 && size.y === 0

  if (!classification || !classificationsWithAssets.includes(classification) || mapIsHidden) return

  const zoom = map.getZoom()

  // Has correct zoom level for markers
  if (zoom >= ZOOM_THRESHOLD) {
    const filter = getWfsFilter(map)

    const { data, error } = await getWfsByName({
      path: { name: 'container' },
      query: { filter },
    })
    console.log('--- ~ data:', data)

    if (error) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error)
    }

    onFeaturesChange(data?.features || [])
  }

  if (zoom < ZOOM_THRESHOLD && markerLayerRef.current) {
    markerLayerRef.current.remove()
    onFeaturesChange([])
  }
}

export type Props = {
  classification?: string
  features: Feature[]
  maxMarkers: number
  onFeaturesChange: (markers: Feature[]) => void
  onMaxMarkersReached: (maxReached: boolean) => void
  onSelectedMarkersChange: (selectedMarkers: Feature[]) => void
  selectedMarkers: Feature[]
  updateSelectedPoint: (point?: Coordinates) => void
}

export const MarkerSelectLayer = ({
  classification,
  features,
  maxMarkers,
  onFeaturesChange,
  onMaxMarkersReached,
  onSelectedMarkersChange,
  selectedMarkers,
  updateSelectedPoint,
}: Props) => {
  const map = useContext(MapContext)
  const markersRef = useRef<Record<string, Marker>>({})
  const markerLayerRef = useRef<Layer | null>(null)

  useEffect(() => {
    if (!map) return
    map.on('moveend', () => fetchFeaturesOnMoveEnd(classification, map, onFeaturesChange, markerLayerRef))

    return () => {
      map.off('moveend', () => fetchFeaturesOnMoveEnd(classification, map, onFeaturesChange, markerLayerRef))
    }
  }, [map])

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

      if (feature.id !== null && (typeof feature.id === 'string' || typeof feature.id === 'number')) {
        markersRef.current[feature.id] = marker
      }

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

  return undefined
}
