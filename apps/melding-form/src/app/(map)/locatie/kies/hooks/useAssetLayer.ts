import L from 'leaflet'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap, fetchAssets, updateAssetMarkers } from '../_utils'
import { Coordinates, NotificationType } from 'apps/melding-form/src/types'

export type Props = {
  assetList: Feature[]
  classification?: string
  mapInstance: L.Map | null
  notification: NotificationType | null
  selectedAssets: Feature[]
  setAssetList: (assets: Feature[]) => void
  setCoordinates: (coordinates?: Coordinates) => void
  setNotification: (notification: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const useAssetLayer = async ({
  assetList,
  classification,
  mapInstance,
  notification,
  selectedAssets,
  setAssetList,
  setCoordinates,
  setNotification,
  setSelectedAssets,
}: Props) => {
  const assetLayerRef = useRef<L.Layer | null>(null)
  const assetMarkersRef = useRef<Record<string, L.Marker>>({})
  const t = useTranslations('select-location.asset-list')

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
      notification,
      selectedAssets,
      setCoordinates,
      setNotification,
      setSelectedAssets,
      t,
    })
  }, [assetList, selectedAssets, notification])

  /**
   * Update asset markers on selection change
   */
  useEffect(() => {
    updateAssetMarkers({ mapInstance, assetMarkersRef, selectedAssets })
  }, [selectedAssets])
}
