import L from 'leaflet'
import { useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { fetchAssets } from './fetchAssets'
import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { selectedAssetIcon } from '../markerIcons'
import { Coordinates } from 'apps/melding-form/src/types'

const classificationsWithAssets = ['container']
export const ASSET_ZOOM_THRESHOLD = 16

type Props = {
  assetList: Feature[]
  classification?: string
  mapInstance: L.Map | null
  selectedAsset: Feature | null
  setAssetList: (assets: Feature[]) => void
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAsset: (asset: Feature | null) => void
}

export const useAssetLayer = async ({
  assetList,
  classification,
  mapInstance,
  selectedAsset,
  setAssetList,
  setCoordinates,
  setSelectedAsset,
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
        selectedAsset,
        setSelectedAsset,
        AssetMarkersRef,
      })
    }
  }, [assetList, selectedAsset])

  /**
   * Update asset markers on selection change
   */
  useEffect(() => {
    if (!mapInstance || Object.keys(AssetMarkersRef.current).length === 0) return

    Object.entries(AssetMarkersRef.current).forEach(([id, marker]) => {
      if (id === selectedAsset?.id) {
        marker.setIcon(selectedAssetIcon)
      } else if (marker.feature) {
        marker.setIcon(getContainerFeatureIcon(marker.feature))
      }
    })
  }, [selectedAsset])
}
