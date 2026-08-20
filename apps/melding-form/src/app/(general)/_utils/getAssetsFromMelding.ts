import {
  getAssetTypeByAssetTypeIdWfs,
  getMeldingByMeldingIdAssetsMelder,
  getMeldingByMeldingIdMelder,
} from '@meldingen/api-client'

const getFilter = (id: string) => `
  <Filter>
    <ResourceId rid="${id}" />
  </Filter>
`

export const getAssetsFromMelding = async (meldingId: string, token: string) => {
  const meldingIdInt = parseInt(meldingId, 10)

  const [{ data: assetIds, error: assetIdError }, { data: melding, error: meldingError }] = await Promise.all([
    getMeldingByMeldingIdAssetsMelder({ path: { melding_id: meldingIdInt }, query: { token } }),
    getMeldingByMeldingIdMelder({ path: { melding_id: meldingIdInt }, query: { token } }),
  ])

  if (assetIdError || meldingError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(assetIdError ?? meldingError)
    return { assets: [], pageConfig: undefined, requiredErrorMessage: undefined }
  }

  const assetType = melding.classification?.asset_type
  const assetTypeId = assetType?.id
  const typeNames = assetType?.arguments?.type_names as string | undefined

  if (!assetTypeId || !typeNames) {
    return {
      assets: [],
      pageConfig: undefined,
      requiredErrorMessage: undefined,
    }
  }

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

  return {
    assets: assets.filter((asset) => asset !== null),
    pageConfig: {
      description: assetType?.arguments?.location_description as string | undefined,
      label: assetType?.arguments?.location_label as string | undefined,
      termPlural: assetType?.arguments?.plural as string | undefined,
      termSingular: assetType?.arguments?.singular as string | undefined,
    },
    requiredErrorMessage: assetType?.arguments?.location_required_error as string | undefined,
  }
}
