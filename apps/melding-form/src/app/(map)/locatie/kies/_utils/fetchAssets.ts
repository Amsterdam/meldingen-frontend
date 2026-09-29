import type { AssetOutput, Feature } from '@meldingen/api-client'

import { getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

const getFilter = (ids: string[]) => `
  <Filter>
    ${ids.map((id) => `<ResourceId rid="${id}" />`).join('')}
  </Filter>
`

export const fetchAssets = async (assetTypeId: number, typeNames: string, assetIds: AssetOutput[]) => {
  if (assetIds.length === 0) return []

  const filter = getFilter(assetIds.map((asset) => asset.external_id))

  const { data, error } = await getAssetTypeByAssetTypeIdWfs({
    path: { asset_type_id: assetTypeId },
    query: { filter, type_names: typeNames },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)

    return []
  }

  // The WFS response order is not guaranteed, so we return the features in the same order as assetIds
  return assetIds
    .map((asset) => data.features.find((feature) => feature.id === asset.external_id))
    .filter((feature): feature is Feature => feature !== undefined)
}
