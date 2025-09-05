import clsx from 'clsx'

import { Feature } from '@meldingen/api-client'

import styles from './AssetList.module.css'

export type Props = {
  assetList: Feature[]
  selectedAssets: Feature[]
}

const getStructuredAssetList = (assetList: Feature[], selectedAssets: Feature[]) => {
  // Filter selectedAssets from list to avoid duplicates
  const filteredList = assetList.filter(
    (asset) => !selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id),
  )
  // Add selected assets to the top
  return [...selectedAssets, ...filteredList]
}

export const AssetList = ({ assetList, selectedAssets }: Props) => {
  if (assetList.length === 0 && selectedAssets.length === 0) {
    return
  }

  const structuredAssetList = getStructuredAssetList(assetList, selectedAssets)

  return (
    <div className={clsx(styles.container, 'ams-mb-m')}>
      <ul>
        {structuredAssetList.map((asset) => {
          // @ts-expect-error id_nummer always exists on asset properties
          const idNummer = asset.properties.id_nummer as string
          return (
            <li key={asset.id} className={styles.item}>
              <span className={styles.name}>{idNummer}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
