import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import {
  deleteMeldingByMeldingIdAssetByAssetId,
  getAssetTypeByAssetTypeIdWfs,
  getMeldingByMeldingIdAssetsMelder,
  getMeldingByMeldingIdMelder,
} from '@meldingen/api-client'

import { SelectLocation } from './SelectLocation'
import { COOKIES } from 'apps/melding-form/src/constants'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')
  const tShared = await getTranslations('shared')

  return {
    title: `${t('title')} - ${tShared('organisation-name')}`,
  }
}

const getFilter = (id: string) => `
  <Filter>
    <ResourceId rid="${id}" />
  </Filter>
`

const MAX_ASSETS_FALLBACK = 3

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

  // Delete all assets to avoid conflicts with previously selected assets
  assetIds.forEach(async (asset) => {
    const { error } = await deleteMeldingByMeldingIdAssetByAssetId({
      path: {
        asset_id: asset.id,
        melding_id: parseInt(meldingId, 10),
      },
      query: { token },
    })

    if (error) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error)
    }
  })

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

  const { data, error } = await getMeldingByMeldingIdMelder({
    path: {
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  const selectedAssets = await getAssetsFromMelding(meldingId, token)

  const coordinates = data?.geo_location?.geometry?.coordinates && {
    lat: data.geo_location.geometry.coordinates[0],
    lng: data.geo_location.geometry.coordinates[1],
  }

  return (
    <SelectLocation
      assetTypeIconConfig={{
        iconEntry: data?.classification?.asset_type?.arguments?.icon_entry as string | undefined,
        iconFolder: data?.classification?.asset_type?.arguments?.icon_folder as string | undefined,
      }}
      coordinates={coordinates}
      maxAssets={data?.classification?.asset_type?.max_assets ?? MAX_ASSETS_FALLBACK}
      selectedAssets={selectedAssets}
      wfsQuery={{
        assetTypeId: data?.classification?.asset_type?.id,
        classification: data?.classification?.name,
        filter: data?.classification?.asset_type?.arguments?.filter as string | undefined,
        srsName: data?.classification?.asset_type?.arguments?.srs_name as string | undefined,
        typeNames: data?.classification?.asset_type?.arguments?.type_names as string | undefined,
      }}
    />
  )
}
