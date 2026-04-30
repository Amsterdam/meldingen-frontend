import { COOKIES } from '~/constants'
import { cookies } from 'next/headers'

import {
  getAssetTypeByAssetTypeIdWfs,
  getMeldingByMeldingIdAssetsMelder,
  getMeldingByMeldingIdMelder,
} from '@meldingen/api-client'

import { Location } from './Location'

const getFilter = (id: string) => `
  <Filter>
    <ResourceId rid="${id}" />
  </Filter>
`

const getAssetsFromMelding = async (meldingId: string, token: string) => {
  const meldingIdInt = parseInt(meldingId, 10)

  const [{ data: assetIds, error: assetIdError }, { data: melding, error: meldingError }] = await Promise.all([
    getMeldingByMeldingIdAssetsMelder({ path: { melding_id: meldingIdInt }, query: { token } }),
    getMeldingByMeldingIdMelder({ path: { melding_id: meldingIdInt }, query: { token } }),
  ])

  if (assetIdError || meldingError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(assetIdError ?? meldingError)
    return []
  }

  const assetTypeId = melding.classification?.asset_type?.id
  const typeNames = melding.classification?.asset_type?.arguments?.type_names as string | undefined

  if (!assetTypeId || !typeNames) return []

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

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const address = cookieStore.get(COOKIES.ADDRESS)?.value
  const prevPage = cookieStore.get(COOKIES.LAST_PANEL_PATH)

  const assets = await getAssetsFromMelding(meldingId, token)

  return <Location address={address} prevPage={prevPage ? prevPage.value : '/'} selectedAssets={assets} />
}
