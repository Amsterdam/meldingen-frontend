import { Layer, Map } from 'leaflet'
import 'leaflet.markercluster'
import { RefObject, useContext, useEffect, useRef } from 'react'

import { Feature, getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

import { MapContext } from '../Map/Map'
import { Coordinates } from '../types'
import { useAddMarkersToMap } from './useAddMarkersToMap'
import { getWfsFilter } from './utils/getWfsFilter'

import './cluster.css'

export const ZOOM_THRESHOLD = 16

export type WfsQuery = {
  assetTypeId?: number
  classification?: string
  filter?: string
  srsName?: string
  typeNames?: string
}

export const fetchFeaturesOnMoveEnd = async (
  map: Map,
  onFeaturesChange: Props['onFeaturesChange'],
  markerLayerRef: RefObject<Layer | null>,
  wfsQuery: WfsQuery,
) => {
  // Don't fetch markers when map is hidden with display: none
  const size = map.getSize()
  const mapIsHidden = size.x === 0 && size.y === 0

  const { assetTypeId, classification, filter, srsName, typeNames } = wfsQuery

  if (!classification || !assetTypeId || !typeNames || !filter || !srsName || mapIsHidden) return

  const zoom = map.getZoom()

  // Has correct zoom level for markers
  if (zoom >= ZOOM_THRESHOLD) {
    const filterWithCoordinates = getWfsFilter({ filter, mapInstance: map, srsName })

    const { data, error } = await getAssetTypeByAssetTypeIdWfs({
      path: { asset_type_id: assetTypeId },
      query: { filter: filterWithCoordinates, type_names: typeNames },
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
  assetTypeIconConfig: {
    iconEntry?: string
    iconFolder?: string
  }
  features: Feature[]
  maxMarkers: number
  onFeaturesChange: (markers: Feature[]) => void
  onMaxMarkersReached: (maxReached: boolean) => void
  onSelectedMarkersChange: (selectedMarkers: Feature[]) => void
  selectedMarkers: Feature[]
  updateSelectedPoint: (point?: Coordinates) => void
  wfsQuery: WfsQuery
}

export const MarkerSelectLayer = ({
  assetTypeIconConfig,
  features,
  maxMarkers,
  onFeaturesChange,
  onMaxMarkersReached,
  onSelectedMarkersChange,
  selectedMarkers,
  updateSelectedPoint,
  wfsQuery,
}: Props) => {
  const map = useContext(MapContext)
  const markerLayerRef = useRef<Layer | null>(null)

  useEffect(() => {
    if (!map) return

    const handleMoveEnd = () => fetchFeaturesOnMoveEnd(map, onFeaturesChange, markerLayerRef, wfsQuery)

    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
    }
  }, [map])

  useAddMarkersToMap({
    assetTypeIconConfig,
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
