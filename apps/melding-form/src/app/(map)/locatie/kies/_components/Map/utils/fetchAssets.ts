import L from 'leaflet'
import { MutableRefObject } from 'react'

import { Feature, getWfsByName } from '@meldingen/api-client'

import { getWfsFilter } from './getWfsFilter'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

const classificationsWithAssets = ['container']
export const ASSET_ZOOM_THRESHOLD = 16

export type Props = {
  mapInstance: L.Map
  classification?: string
  setAssetList: (assets: Feature[]) => void
  assetLayerRef: MutableRefObject<L.Layer | null>
}

export const fetchAssets = async ({ mapInstance, classification, setAssetList, assetLayerRef }: Props) => {
  // Don't fetch assets when map is hidden with display: none
  const size = mapInstance.getSize()
  const mapIsHidden = size.x === 0 && size.y === 0

  if (!classification || !classificationsWithAssets.includes(classification) || mapIsHidden) return

  const zoom = mapInstance.getZoom()

  // Has correct zoom level for assets
  if (zoom >= ASSET_ZOOM_THRESHOLD) {
    const filter = getWfsFilter(mapInstance)

    const { data: assets, error } = await getWfsByName({
      path: { name: classification },
      query: { filter },
    })

    if (error) throw new Error(handleApiError(error))

    setAssetList(assets?.features || [])
  }

  if (zoom < ASSET_ZOOM_THRESHOLD && assetLayerRef.current) {
    assetLayerRef.current.remove()
    setAssetList([])
  }
}
