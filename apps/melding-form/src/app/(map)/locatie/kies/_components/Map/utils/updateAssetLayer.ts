import L from 'leaflet'
import { MutableRefObject } from 'react'

import { Feature } from '@meldingen/api-client'

import { fetchAndAddAssetLayerToMap } from './fetchAndAddAssetLayerToMap'

const classificationsWithAssets = ['container']

const ASSET_ZOOM_THRESHOLD = 16

export const updateAssetLayer = (
  mapInstance: L.Map,
  assetLayerRef: MutableRefObject<L.Layer | null>,
  setAssets: (assets: Feature[]) => void,
  classification?: string,
) => {
  if (!classification || !classificationsWithAssets.includes(classification)) return

  const zoom = mapInstance.getZoom()

  // Has correct zoom level for assets
  if (zoom >= ASSET_ZOOM_THRESHOLD) {
    fetchAndAddAssetLayerToMap(mapInstance, classification, assetLayerRef, setAssets)
  } else if (zoom < ASSET_ZOOM_THRESHOLD && assetLayerRef.current) {
    setAssets([])
    assetLayerRef.current.remove()
  }
}
