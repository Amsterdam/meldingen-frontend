import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import {
  deleteMeldingByMeldingIdAssetByAssetId,
  Feature,
  getMeldingByMeldingIdAssetsMelder,
  getMeldingByMeldingIdMelder,
} from '@meldingen/api-client'

import { SelectLocation } from './SelectLocation'
import { COOKIES } from 'apps/melding-form/src/constants'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')

  return {
    title: t('metadata.title'),
  }
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

  // Get existing assets for this report
  const { data: assetData } = await getMeldingByMeldingIdAssetsMelder({
    path: {
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  })

  // Delete all assets to avoid conflicts with previously selected assets
  if (assetData && assetData.length > 0) {
    assetData.forEach(async (asset) => {
      await deleteMeldingByMeldingIdAssetByAssetId({
        path: {
          asset_id: asset.id,
          melding_id: parseInt(meldingId, 10),
        },
        query: { token },
      })
    })
  }

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  const coordinates = data?.geo_location?.geometry?.coordinates && {
    lat: data.geo_location.geometry.coordinates[0],
    lng: data.geo_location.geometry.coordinates[1],
  }

  // TODO: properties should be returned from the API
  const selectedAssets =
    (assetData?.map((asset) => {
      return {
        ...asset,
        db_id: asset.id,
        geometry: {
          coordinates: data?.geo_location?.geometry?.coordinates,
          type: 'Point',
        },
        id: asset.external_id,
        properties: { id_nummer: `${asset.external_id}` },
        type: 'Feature',
      }
    }) as Feature[]) || []

  return (
    <SelectLocation
      classification={data?.classification?.name}
      coordinates={coordinates}
      prefilledSelectedAssets={selectedAssets}
    />
  )
}
