import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap } from '../utils/addAssetLayerToMap'
import { fetchAssets } from '../utils/fetchAssets'
import { updateAssetMarkers } from '../utils/updateAssetMarkers'
import { Coordinates } from 'apps/melding-form/src/types'

const classificationsWithAssets = ['container']
export const ASSET_ZOOM_THRESHOLD = 16

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
    if (!mapInstance || !classification) return

    mapInstance.on('moveend', async () => {
      // Don't fetch assets when map is hidden with display: none
      const size = mapInstance.getSize()
      const mapIsHidden = size.x === 0 && size.y === 0

      if (!classificationsWithAssets.includes(classification) || mapIsHidden) return

      const zoom = mapInstance.getZoom()

      // Has correct zoom level for assets
      if (zoom >= ASSET_ZOOM_THRESHOLD) {
        const assets = await fetchAssets(mapInstance, classification)
        setAssetList(assets?.features || [])
      }

      if (zoom < ASSET_ZOOM_THRESHOLD && assetLayerRef.current) {
        assetLayerRef.current.remove()
        setAssetList([])
      }
    })
  }, [mapInstance])

  /**
   * Add asset markers to map
   */
  useEffect(() => {
    if (!mapInstance) return

    if (assetList && assetList.length > 0) {
      addAssetLayerToMap({
        assetList,
        assetLayerRef,
        mapInstance,
        setCoordinates,
        selectedAssets,
        setSelectedAssets,
        AssetMarkersRef,
      })
    }
  }, [assetList, selectedAssets])

  /**
   * Update asset markers on selection change
   */
  useEffect(() => {
    updateAssetMarkers({ mapInstance, AssetMarkersRef, selectedAssets })
  }, [selectedAssets])
}
