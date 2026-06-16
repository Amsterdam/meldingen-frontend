import type { AssetOutput } from '@meldingen/api-client'

import { getAssetTypeByAssetTypeIdWfs } from '@meldingen/api-client'

const getFilter = (id: string) => `
  <Filter>
    <ResourceId rid="${id}" />
  </Filter>
`

export const fetchAssets = async (assetTypeId: number, typeNames: string, assetIds: AssetOutput[]) => {
  const assets = await Promise.all(
    assetIds.map(async (asset) => {
      const filter = getFilter(asset.external_id)

      const { data, error } = await getAssetTypeByAssetTypeIdWfs({
        path: { asset_type_id: assetTypeId },
        query: { filter, type_names: typeNames },
      })

      if (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
        return null
      }

      return data.features[0] ?? null
    }),
  )

  return assets.filter((asset) => asset !== null)
}
