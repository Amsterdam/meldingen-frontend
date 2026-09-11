import type { Layer, Map } from 'leaflet'

import 'leaflet.markercluster'
import type { RefObject } from 'react'

import { useContext, useEffect, useRef } from 'react'

import type { Feature } from '@meldingen/api-client'

import { getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

import type { Coordinates } from '../types'

import { MapContext } from '../Map/Map'
import { useAddMarkersToMap } from './useAddMarkersToMap'
import { getWfsFilter } from './utils/getWfsFilter'

import './cluster.css'

export const ZOOM_THRESHOLD = 11

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
  pendingRequestRef: RefObject<AbortController | null>,
) => {
  const { assetTypeId, classification, filter, srsName, typeNames } = wfsQuery

  if (!classification || !assetTypeId || !typeNames || !filter || !srsName) return

  const zoom = map.getZoom()

  // Has correct zoom level for markers
  if (zoom >= ZOOM_THRESHOLD) {
    // Abort a still in-flight request from an earlier call
    pendingRequestRef.current?.abort()
    const abortController = new AbortController()
    pendingRequestRef.current = abortController

    const filterWithCoordinates = getWfsFilter({ filter, mapInstance: map, srsName })

    const { data, error } = await getAssetTypeByAssetTypeIdWfs({
      path: { asset_type_id: assetTypeId },
      query: { filter: filterWithCoordinates, type_names: typeNames },
      signal: abortController.signal,
    })

    if (abortController.signal.aborted) return

    if (error) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error)
    }

    onFeaturesChange(data?.features || [])
  }

  if (zoom < ZOOM_THRESHOLD) {
    pendingRequestRef.current?.abort()

    if (markerLayerRef.current) {
      markerLayerRef.current.remove()
      onFeaturesChange([])
    }
  }
}

export type Props = {
  features: Feature[]
  iconConfig: {
    entry?: string
    folder?: string
  }
  maxMarkers: number
  onFeaturesChange: (markers: Feature[]) => void
  onMaxMarkersReached: (maxReached: boolean) => void
  onSelectedMarkersChange: (selectedMarkers: Feature[]) => void
  selectedMarkers: Feature[]
  updateSelectedPoint: (point?: Coordinates) => void
  wfsQuery: WfsQuery
}

export const MarkerSelectLayer = ({
  features,
  iconConfig,
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
  const pendingRequestRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!map) return

    const handleMoveEnd = () =>
      fetchFeaturesOnMoveEnd(map, onFeaturesChange, markerLayerRef, wfsQuery, pendingRequestRef)

    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
      // Reading .current here on purpose: unlike a DOM-node ref, we want whichever
      // request is in flight at cleanup time, not a value captured at mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      pendingRequestRef.current?.abort()
    }
  }, [map, onFeaturesChange, wfsQuery])

  useAddMarkersToMap({
    features,
    iconConfig,
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
