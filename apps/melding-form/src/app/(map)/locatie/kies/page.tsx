import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

import type { AssetOutput, MeldingOutput } from '@meldingen/api-client'

import {
  deleteMeldingByMeldingIdAssetByAssetId,
  getAssetTypeByAssetTypeIdWfs,
  getMeldingByMeldingIdAssetsMelder,
  getMeldingByMeldingIdMelder,
} from '@meldingen/api-client'

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

const getAssetTypeConfig = (data?: MeldingOutput) => {
  const args = data?.classification?.asset_type?.arguments

  return {
    filter: args?.filter as string | undefined,
    iconEntry: args?.icon_entry as string | undefined,
    iconFolder: args?.icon_folder as string | undefined,
    label: args?.label as string | undefined,
    maxAssets: data?.classification?.asset_type?.max_assets ?? MAX_ASSETS_FALLBACK,
    srsName: args?.srs_name as string | undefined,
    typeNames: args?.type_names as string | undefined,
  }
}

const getFilter = (id: string) => `
  <Filter>
    <ResourceId rid="${id}" />
  </Filter>
`

const fetchAssetFeatures = async (assetTypeId: number, typeNames: string, assetIds: AssetOutput[]) => {
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

const deleteExistingAssets = async (meldingId: number, token: string, assetIds: AssetOutput[]) => {
  await Promise.all(
    assetIds.map(async (asset) => {
      const { error } = await deleteMeldingByMeldingIdAssetByAssetId({
        path: {
          asset_id: asset.id,
          melding_id: meldingId,
        },
        query: { token },
      })

      if (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }),
  )
}

const getAssetsFromMelding = async (meldingId: number, token: string, assetTypeId: number, typeNames: string) => {
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

  return await fetchAssetFeatures(assetTypeId, typeNames, assetIds)
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
  const assetTypeConfig = getAssetTypeConfig(data)
  const { typeNames } = assetTypeConfig

  const selectedAssets =
    assetTypeId && typeNames ? await getAssetsFromMelding(meldingId, token, assetTypeId, typeNames) : []

  const coordinates = data?.geo_location?.geometry?.coordinates && {
    lat: data.geo_location.geometry.coordinates[0],
    lng: data.geo_location.geometry.coordinates[1],
  }

  return (
    <SelectLocation
      assetTypeIconConfig={{
        iconEntry: assetTypeConfig.iconEntry,
        iconFolder: assetTypeConfig.iconFolder,
      }}
      coordinates={coordinates}
      labelConfig={assetTypeConfig.label}
      maxAssets={assetTypeConfig.maxAssets}
      selectedAssets={selectedAssets}
      wfsQuery={{
        assetTypeId,
        classification: data?.classification?.name,
        filter: assetTypeConfig.filter,
        srsName: assetTypeConfig.srsName,
        typeNames: assetTypeConfig.typeNames,
      }}
    />
  )
}
