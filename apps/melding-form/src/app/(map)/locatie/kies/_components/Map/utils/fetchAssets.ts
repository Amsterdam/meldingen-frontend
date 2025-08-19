import L from 'leaflet'

import { getWfsByName } from '@meldingen/api-client'

import { getWfsFilter } from './getWfsFilter'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

export const fetchAssets = async (mapInstance: L.Map, classification: string) => {
  const filter = getWfsFilter(mapInstance)

  const { data, error } = await getWfsByName({
    path: { name: classification },
    query: { filter },
  })

  if (error) throw new Error(handleApiError(error))

  return data
}
