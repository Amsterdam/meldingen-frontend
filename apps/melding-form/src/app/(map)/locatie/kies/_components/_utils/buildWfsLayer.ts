import L from 'leaflet'
import { MutableRefObject } from 'react'

import { getWfsByName } from '@meldingen/api-client'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { getWfsFilter } from './getWfsFilter'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

export const buildWfsLayer = async (
  mapInstance: L.Map,
  classification: string,
  assetLayerRef: MutableRefObject<L.Layer | null>,
) => {
  const filter = getWfsFilter(mapInstance)

  const { data, error } = await getWfsByName({
    path: { name: classification },
    query: { filter },
  })

  if (data?.features && data.features.length > 0) addAssetLayerToMap(data.features, assetLayerRef, mapInstance)

  if (error) throw new Error(handleApiError(error))
}
