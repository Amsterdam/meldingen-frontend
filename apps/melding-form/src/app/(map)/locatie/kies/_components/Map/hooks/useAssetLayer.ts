import L from 'leaflet'
import { useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap } from '../utils/addAssetLayerToMap'
import { fetchAssets } from '../utils/fetchAssets'

const classificationsWithAssets = ['container']
const ASSET_ZOOM_THRESHOLD = 16

type Props = {
  classification?: string
  setAssetList: (assets: Feature[]) => void
  mapInstance: L.Map | null
}

export const useAssetLayer = ({ mapInstance, classification, setAssetList }: Props) => {
  const assetLayerRef = useRef<L.Layer | null>(null)

  // This useEffect prevents the WFS layer from being fetched twice
  useEffect(() => {
    mapInstance?.on('moveend', async () => {
      // Don't fetch assets when map is hidden with display: none
      const size = mapInstance.getSize()
      const hasDisplayNone = size.x === 0 && size.y === 0

      if (!classification || !classificationsWithAssets.includes(classification) || hasDisplayNone) return

      const zoom = mapInstance.getZoom()

      // Has correct zoom level for assets
      if (zoom >= ASSET_ZOOM_THRESHOLD) {
        const assets = await fetchAssets(mapInstance, classification)

        if (assets?.features && assets.features.length > 0) {
          addAssetLayerToMap(assets.features, assetLayerRef, mapInstance)
          setAssetList(assets.features)
        } else setAssetList([])
      }

      if (zoom < ASSET_ZOOM_THRESHOLD && assetLayerRef.current) {
        assetLayerRef.current.remove()
        setAssetList([])
      }
    })
  }, [mapInstance])
}
