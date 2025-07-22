import L from 'leaflet'
import { MutableRefObject } from 'react'

import { buildWfsLayer } from './buildWfsLayer'

const classificationsWithAssets = ['container']

const ASSET_ZOOM_THRESHOLD = 16

export const updateWfsLayer = (
  mapInstance: L.Map,
  assetLayerRef: MutableRefObject<L.Layer | null>,
  classification?: string,
) => {
  if (!mapInstance || !classification || !classificationsWithAssets.includes(classification)) return

  const zoom = mapInstance.getZoom()

  // Has correct zoom level for assets
  if (zoom >= ASSET_ZOOM_THRESHOLD) {
    buildWfsLayer(mapInstance, classification, assetLayerRef)
  } else if (zoom < ASSET_ZOOM_THRESHOLD && assetLayerRef.current) {
    assetLayerRef.current.remove()
  }
}
