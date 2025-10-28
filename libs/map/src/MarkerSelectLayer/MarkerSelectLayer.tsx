import { divIcon, latLng, Layer, Map, Marker, MarkerCluster, MarkerClusterGroup } from 'leaflet'
import 'leaflet.markercluster'
import { RefObject, useContext, useEffect, useRef } from 'react'

import { Feature, getWfsByName } from '@meldingen/api-client'

import { MapContext } from '../Map/Map'
import { Coordinates } from '../types'
import { AssetFeature, getContainerFeatureIcon } from './utils/getContainerFeatureIcon'
import { getWfsFilter } from './utils/getWfsFilter'

import './cluster.css'

export const MAX_ASSETS = 5
export const ASSET_ZOOM_THRESHOLD = 16

export const createClusterIcon = (cluster: MarkerCluster) => {
  // Cluster markers should not be keyboard accessible
  cluster.options.keyboard = false

  return divIcon({
    html: cluster.getChildCount().toString(),
    className: 'meldingen-cluster',
    iconSize: [70, 70],
    iconAnchor: [35, 35],
  })
}

const handleMoveEnd = async (
  map: Map,
  onMarkersChange: Props['onMarkersChange'],
  markerLayerRef: RefObject<Layer | null>,
) => {
  // Don't fetch assets when map is hidden with display: none
  const size = map.getSize()
  const mapIsHidden = size.x === 0 && size.y === 0

  // if (!classification || !classificationsWithAssets.includes(classification) || mapIsHidden) return // TODO
  if (mapIsHidden) return

  const zoom = map.getZoom()

  // Has correct zoom level for assets
  if (zoom >= ASSET_ZOOM_THRESHOLD) {
    const filter = getWfsFilter(map)

    const { data, error } = await getWfsByName({
      path: { name: 'container' },
      query: { filter },
    })

    if (error) throw new Error(`${error}`) // TODO

    onMarkersChange(data?.features || [])
  }

  if (zoom < ASSET_ZOOM_THRESHOLD && markerLayerRef.current) {
    markerLayerRef.current.remove()
    onMarkersChange([])
  }
}

type Props = {
  markers: Feature[]
  selectedMarkers: Feature[]
  onMarkersChange: (markers: Feature[]) => void
  onSelectedMarkersChange: (selectedMarkers: Feature[]) => void
  updateSelectedPoint: (point?: Coordinates) => void
  onMaxAssetsReached: (maxReached: boolean) => void
}

export const MarkerSelectLayer = ({
  markers,
  selectedMarkers,
  onMarkersChange,
  onSelectedMarkersChange,
  updateSelectedPoint,
  onMaxAssetsReached,
}: Props) => {
  const map = useContext(MapContext)
  const markersRef = useRef<Record<string, Marker>>({})
  const markerLayerRef = useRef<Layer | null>(null)

  useEffect(() => {
    if (!map) return
    map.on('moveend', () => handleMoveEnd(map, onMarkersChange, markerLayerRef))

    return () => {
      map.off('moveend', () => handleMoveEnd(map, onMarkersChange, markerLayerRef))
    }
  }, [map])

  useEffect(() => {
    if (!map || markers.length === 0) return

    markerLayerRef.current?.remove()

    const markerClusterGroup = new MarkerClusterGroup({
      iconCreateFunction: createClusterIcon,
      showCoverageOnHover: false,
    })

    markers.forEach((feature) => {
      if (!feature.geometry || feature.geometry.type !== 'Point') return

      const geometry = feature.geometry
      const [lng, lat] = geometry.coordinates
      const latlng = latLng(lat, lng)
      const isSelected = selectedMarkers.some((a) => a.id === feature.id)

      const marker = new Marker(latlng, {
        icon: getContainerFeatureIcon(feature as AssetFeature, isSelected),
        keyboard: false,
      })

      if (feature.id !== null && (typeof feature.id === 'string' || typeof feature.id === 'number')) {
        markersRef.current[feature.id] = marker
      }

      marker.on('click', () => {
        if (isSelected) {
          onMaxAssetsReached(false)
          onSelectedMarkersChange(selectedMarkers.filter((a) => a.id !== feature.id))

          if (selectedMarkers.length <= 1) {
            updateSelectedPoint(undefined)
          } else if (feature.id === selectedMarkers[0].id) {
            // Set the address of the second asset on the list
            // when the last selected asset (#1 on the list) is deselected
            // @ts-expect-error an asset always has coordinates
            const [y, x] = selectedMarkers[1].geometry.coordinates
            updateSelectedPoint({ lat: x, lng: y })
          }
        } else {
          if (selectedMarkers.length >= MAX_ASSETS) {
            onMaxAssetsReached(true)
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
  }, [map, markers, selectedMarkers])

  return undefined
}
