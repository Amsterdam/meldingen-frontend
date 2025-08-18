import L from 'leaflet'
import { MutableRefObject } from 'react'

import { Feature, getWfsByName } from '@meldingen/api-client'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { getWfsFilter } from './getWfsFilter'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

export const fetchAndAddAssetLayerToMap = async (
  mapInstance: L.Map,
  classification: string,
  assetLayerRef: MutableRefObject<L.Layer | null>,
  setAssetList: (assets: Feature[]) => void,
) => {
  const filter = getWfsFilter(mapInstance)

  const { data, error } = await getWfsByName({
    path: { name: classification },
    query: { filter },
  })

  if (data?.features && data.features.length > 0) {
    addAssetLayerToMap(data.features, assetLayerRef, mapInstance)
    setAssetList(data.features)
  } else setAssetList([])

  if (error) throw new Error(handleApiError(error))
}
