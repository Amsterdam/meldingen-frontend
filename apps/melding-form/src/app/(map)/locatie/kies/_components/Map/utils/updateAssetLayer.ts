import L from 'leaflet'
import { MutableRefObject } from 'react'

import { Feature } from '@meldingen/api-client'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { fetchAssets } from './fetchAssets'

const classificationsWithAssets = ['container']
const ASSET_ZOOM_THRESHOLD = 16

type Props = {
  assetLayerRef: MutableRefObject<L.Layer | null>
  classification: string
  mapInstance: L.Map
  setAssetList: (assets: Feature[]) => void
}

export const updateAssetLayer = async ({ mapInstance, classification, setAssetList, assetLayerRef }: Props) => {
  // Don't fetch assets when map is hidden with display: none
  const size = mapInstance.getSize()
  const hasDisplayNone = size.x === 0 && size.y === 0

  if (!classificationsWithAssets.includes(classification) || hasDisplayNone) return

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
}
