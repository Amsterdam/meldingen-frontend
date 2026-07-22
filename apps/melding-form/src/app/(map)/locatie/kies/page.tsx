import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import type { MeldingOutput } from '@meldingen/api-client'

import { getMeldingByMeldingIdAssetsMelder, getMeldingByMeldingIdMelder } from '@meldingen/api-client'

import { deleteExistingAssets } from './_utils/deleteExistingAssets'
import { fetchAssets } from './_utils/fetchAssets'
import { SelectLocation } from './SelectLocation'
import { COOKIES } from '~/constants'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')
  const tShared = await getTranslations('shared')

  return {
    title: `${t('title')} - ${tShared('organisation-name')}`,
  }
}

const MAX_ASSETS_FALLBACK = 3

const getAssetConfig = async (data?: MeldingOutput) => {
  const args = data?.classification?.asset_type?.arguments

  const t = await getTranslations('select-location.notifications.too-many-assets')

  return {
    icon: {
      entry: args?.icon_entry as string | undefined,
      folder: args?.icon_folder as string | undefined,
    },
    label: args?.label as string | undefined,
    maxCount: data?.classification?.asset_type?.max_assets ?? MAX_ASSETS_FALLBACK,
    names: {
      plural: (args?.plural as string | undefined) ?? t('fallback-asset-names.plural'),
      singular: (args?.singular as string | undefined) ?? t('fallback-asset-names.singular'),
    },
    wfsQuery: {
      assetTypeId: data?.classification?.asset_type?.id,
      classification: data?.classification?.name,
      filter: args?.filter as string | undefined,
      srsName: args?.srs_name as string | undefined,
      typeNames: args?.type_names as string | undefined,
    },
  }
}

const clearAndFetchAssets = async (meldingId: number, token: string, assetTypeId: number, typeNames: string) => {
  // Get existing assets for this melding
  const { data: assetIds, error } = await getMeldingByMeldingIdAssetsMelder({
    path: { melding_id: meldingId },
    query: { token },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
    return []
  }

  // Delete all assets to avoid conflicts with previously selected assets
  await deleteExistingAssets(meldingId, token, assetIds)

  return await fetchAssets(assetTypeId, typeNames, assetIds)
}

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = parseInt(cookieStore.get(COOKIES.ID)!.value, 10)
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const { data, error } = await getMeldingByMeldingIdMelder({
    path: { melding_id: meldingId },
    query: { token },
  })

  if (error) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error)
  }

  const assetTypeId = data?.classification?.asset_type?.id
  const assetConfig = await getAssetConfig(data)
  const {
    wfsQuery: { typeNames },
  } = assetConfig

  const selectedAssets =
    assetTypeId && typeNames ? await clearAndFetchAssets(meldingId, token, assetTypeId, typeNames) : []

  const coordinates = data?.geo_location?.geometry?.coordinates && {
    lat: data.geo_location.geometry.coordinates[0],
    lng: data.geo_location.geometry.coordinates[1],
  }

  return <SelectLocation assetConfig={assetConfig} coordinates={coordinates} selectedAssets={selectedAssets} />
}
