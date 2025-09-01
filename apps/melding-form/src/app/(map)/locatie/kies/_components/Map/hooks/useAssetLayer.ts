import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap } from '../utils/addAssetLayerToMap'
import { fetchAssets } from '../utils/fetchAssets'
import { updateAssetMarkers } from '../utils/updateAssetMarkers'
import { Coordinates } from 'apps/melding-form/src/types'

export type Props = {
  assetList: Feature[]
  classification?: string
  mapInstance: L.Map | null
  selectedAssets: Feature[]
  setAssetList: (assets: Feature[]) => void
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const useAssetLayer = async ({
  assetList,
  classification,
  mapInstance,
  selectedAssets,
  setAssetList,
  setCoordinates,
  setSelectedAssets,
}: Props) => {
  const assetLayerRef = useRef<L.Layer | null>(null)
  const AssetMarkersRef = useRef<Record<string, L.Marker>>({})

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
      assetList,
      assetLayerRef,
      mapInstance,
      setCoordinates,
      selectedAssets,
      setSelectedAssets,
      AssetMarkersRef,
    })
  }, [assetList, selectedAssets])

  /**
   * Update asset markers on selection change
   */
  useEffect(() => {
    updateAssetMarkers({ mapInstance, AssetMarkersRef, selectedAssets })
  }, [selectedAssets])
}
