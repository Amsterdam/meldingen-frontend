import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap, fetchAssets, updateAssetMarkers } from '../_utils'
import { NotificationType } from '../SelectLocation'
import { Coordinates } from 'apps/melding-form/src/types'

export type Props = {
  assetList: Feature[]
  classification?: string
  mapInstance: L.Map | null
  notificationType: NotificationType
  selectedAssets: Feature[]
  setAssetList: (assets: Feature[]) => void
  setCoordinates: (coordinates?: Coordinates) => void
  setNotificationType: (notificationType: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const useAssetLayer = async ({
  assetList,
  classification,
  mapInstance,
  notificationType,
  selectedAssets,
  setAssetList,
  setCoordinates,
  setNotificationType,
  setSelectedAssets,
}: Props) => {
  const assetLayerRef = useRef<L.Layer | null>(null)
  const assetMarkersRef = useRef<Record<string, L.Marker>>({})

  /**
   * Fetch assets
   */
  useEffect(() => {
    mapInstance?.on('moveend', async () => {
      fetchAssets({ mapInstance, classification, setAssetList, assetLayerRef })
    })
  }, [mapInstance])

  /**
   * Add asset markers to map
   */
  useEffect(() => {
    addAssetLayerToMap({
      assetLayerRef,
      assetList,
      assetMarkersRef,
      mapInstance,
      notificationType,
      selectedAssets,
      setCoordinates,
      setNotificationType,
      setSelectedAssets,
    })
  }, [assetList, selectedAssets, notificationType])

  /**
   * Update asset markers on selection change
   */
  useEffect(() => {
    updateAssetMarkers({ mapInstance, assetMarkersRef, selectedAssets })
  }, [selectedAssets])
}
