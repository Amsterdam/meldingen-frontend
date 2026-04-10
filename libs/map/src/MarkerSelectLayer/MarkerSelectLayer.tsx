import { Layer, Map } from 'leaflet'
import 'leaflet.markercluster'
import { RefObject, useContext, useEffect, useRef } from 'react'

import { Feature, getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

import { MapContext } from '../Map/Map'
import { Coordinates } from '../types'
import { useAddMarkersToMap } from './useAddMarkersToMap'

import './cluster.css'
import { getWfsFilter } from './utils/getWfsFilter'

export const ZOOM_THRESHOLD = 16

export const fetchFeaturesOnMoveEnd = async (
  map: Map,
  onFeaturesChange: Props['onFeaturesChange'],
  markerLayerRef: RefObject<Layer | null>,
  assetTypeId?: number,
  typeNames?: string,
  srsName?: string,
  classification?: string,
  filter?: string,
) => {
  // Don't fetch markers when map is hidden with display: none
  const size = map.getSize()
  const mapIsHidden = size.x === 0 && size.y === 0

  if (!classification || !assetTypeId || !typeNames || !filter || mapIsHidden) return

  const zoom = map.getZoom()

  // Has correct zoom level for markers
  if (zoom >= ZOOM_THRESHOLD) {
    const filterWithCoordinates = getWfsFilter(filter, map, srsName)

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
  assetTypeId?: number
  classification?: string
  features: Feature[]
  filter?: string
  maxMarkers: number
  onFeaturesChange: (markers: Feature[]) => void
  onMaxMarkersReached: (maxReached: boolean) => void
  onSelectedMarkersChange: (selectedMarkers: Feature[]) => void
  selectedMarkers: Feature[]
  srsName?: string
  typeNames?: string
  updateSelectedPoint: (point?: Coordinates) => void
}

export const MarkerSelectLayer = ({
  assetTypeId,
  classification,
  features,
  filter,
  maxMarkers,
  onFeaturesChange,
  onMaxMarkersReached,
  onSelectedMarkersChange,
  selectedMarkers,
  srsName,
  typeNames,
  updateSelectedPoint,
}: Props) => {
  const map = useContext(MapContext)
  const markerLayerRef = useRef<Layer | null>(null)

  useEffect(() => {
    if (!map) return

    const handleMoveEnd = () =>
      fetchFeaturesOnMoveEnd(
        map,
        onFeaturesChange,
        markerLayerRef,
        assetTypeId,
        typeNames,
        srsName,
        classification,
        filter,
      )

    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
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
