import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import {
  deleteMeldingByMeldingIdAssetByAssetId,
  getMeldingByMeldingIdAssetsMelder,
  getMeldingByMeldingIdMelder,
  getWfsByName,
} from '@meldingen/api-client'

import { SelectLocation } from './SelectLocation'
import { COOKIES } from 'apps/melding-form/src/constants'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')

  return {
    title: t('metadata.title'),
  }
}

const getFilter = (id: string) => {
  return `
    <Filter> 
      <ResourceId rid="${id}" />
    </Filter>
    `
}

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

      const { data, error } = await getWfsByName({ path: { name: 'container' }, query: { filter } })

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
      classification={data?.classification?.name}
      coordinates={coordinates}
      selectedAssets={selectedAssets}
    />
  )
}
