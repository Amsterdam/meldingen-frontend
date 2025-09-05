import { Checkbox } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'

import { Feature } from '@meldingen/api-client'

import { MAX_ASSETS } from '../../_utils/addAssetLayerToMap'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './AssetList.module.css'

export type Props = {
  assetList: Feature[]
  selectedAssets: Feature[]
  setCoordinates: (coordinates: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const AssetList = ({ assetList, selectedAssets, setSelectedAssets }: Props) => {
  if (assetList.length === 0 && selectedAssets.length === 0) return

  const filteredList = assetList.filter(
    (asset) => !selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id),
  )

  return (
    <div className={clsx(styles.container, 'ams-mb-m')}>
      {selectedAssets.map((asset) => {
        // @ts-expect-error id_nummer always exists on asset properties
        const idNummer = asset.properties.id_nummer as string

        return (
          <Checkbox
            key={idNummer}
            onChange={() => setSelectedAssets((assetList) => assetList.filter((a) => a !== asset))}
            checked
          >
            {idNummer}
          </Checkbox>
        )
      })}
      {filteredList.map((asset) => {
        // @ts-expect-error id_nummer always exists on asset properties
        const idNummer = asset.properties.id_nummer as string

        return (
          <Checkbox
            key={idNummer}
            onChange={() => setSelectedAssets((assetList) => [asset, ...assetList])}
            disabled={selectedAssets.length === MAX_ASSETS}
          >
            {idNummer}
          </Checkbox>
        )
      })}
    </div>
  )
}
