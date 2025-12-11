import { Layer, Map } from 'leaflet'
import 'leaflet.markercluster'
import { RefObject, useContext, useEffect, useRef } from 'react'

import { Feature, getWfsByName } from '@meldingen/api-client'

import { MapContext } from '../Map/Map'
import { Coordinates } from '../types'
import { useAddMarkersToMap } from './useAddMarkersToMap'

import './cluster.css'
import { getWfsFilter } from './utils/getWfsFilter'

const classificationsWithAssets = ['container']
export const ZOOM_THRESHOLD = 16

export const fetchFeaturesOnMoveEnd = async (
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
  const markerLayerRef = useRef<Layer | null>(null)

  useEffect(() => {
    if (!map) return
    map.on('moveend', () => fetchFeaturesOnMoveEnd(classification, map, onFeaturesChange, markerLayerRef))

    return () => {
      map.off('moveend', () => fetchFeaturesOnMoveEnd(classification, map, onFeaturesChange, markerLayerRef))
    }
  }, [map])

  useAddMarkersToMap({
    features,
    map,
    markerLayerRef,
    maxMarkers,
    onMaxMarkersReached,
    onSelectedMarkersChange,
    selectedMarkers,
    updateSelectedPoint,
  })

  return undefined
}
