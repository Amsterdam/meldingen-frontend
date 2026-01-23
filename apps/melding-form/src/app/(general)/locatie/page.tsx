import { cookies } from 'next/headers'

import { getAssetTypeByAssetTypeIdWfs, getMeldingByMeldingIdAssetsMelder } from '@meldingen/api-client'

import { Location } from './Location'
import { COOKIES } from 'apps/melding-form/src/constants'

const getFilter = (id: string) => `
  <Filter>
    <ResourceId rid="${id}" />
  </Filter>
`

const getAssetsFromMelding = async (meldingId: string, token: string) => {
  // Get existing assets for this melding
  const { data: assetIds, error } = await getMeldingByMeldingIdAssetsMelder({
    path: {
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
    return []
  }

  const assets = await Promise.all(
    assetIds.map(async (asset) => {
      const filter = getFilter(asset.external_id)

      const { data, error } = await getAssetTypeByAssetTypeIdWfs({ path: { asset_type_id: 1 }, query: { filter } })

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
