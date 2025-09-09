import { Checkbox } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'

import { Feature } from '@meldingen/api-client'

import { MAX_ASSETS } from '../../_utils/addAssetLayerToMap'
import { getContainerFeatureIconSVG } from '../../_utils/getContainerFeatureIconSVG'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './AssetList.module.css'

export type Props = {
  assetList: Feature[]
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const AssetList = ({ assetList, selectedAssets, setCoordinates, setSelectedAssets }: Props) => {
  if (assetList.length === 0 && selectedAssets.length === 0) return

  const filteredList = assetList.filter(
    (asset) => !selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id),
  )

  const handleDeselectAsset = (asset: Feature) => {
    if (selectedAssets.length <= 1) {
      setCoordinates()
    } else if (asset.id === selectedAssets[0].id) {
      // Set the address of the second asset on the list
      // when the last selected asset (#1 on the list) is deselected
      // @ts-expect-error an asset always has coordinates
      const [y, x] = selectedAssets[1].geometry.coordinates
      setCoordinates({ lat: x, lng: y })
    }

    setSelectedAssets((assetList) => {
      return assetList.filter((a) => a.id !== asset.id)
    })
  }

  const handleSelectAsset = (asset: Feature) => {
    // @ts-expect-error an asset always has coordinates
    const [y, x] = asset.geometry.coordinates
    setCoordinates({ lat: x, lng: y })

    setSelectedAssets((assetList) => [asset, ...assetList])
  }

  const getCheckboxLabel = (asset: Feature, idNummer: string) => {
    const icon = getContainerFeatureIconSVG(asset)

    return (
      <span className={styles.label}>
        <Image src={icon} alt="Label icon" width={32} height={32} />
        <span>{idNummer}</span>
      </span>
    )
  }

  return (
    <div className={clsx(styles.container, 'ams-mb-m')}>
      {selectedAssets.map((asset) => {
        // @ts-expect-error id_nummer always exists on asset properties
        const idNummer = asset.properties.id_nummer as string
        const label = getCheckboxLabel(asset, idNummer)

        return (
          <Checkbox key={idNummer} onChange={() => handleDeselectAsset(asset)} checked className={styles.checkbox}>
            {label}
          </Checkbox>
        )
      })}
      {filteredList.map((asset) => {
        // @ts-expect-error id_nummer always exists on asset properties
        const idNummer = asset.properties.id_nummer as string
        const label = getCheckboxLabel(asset, idNummer)

        return (
          <Checkbox
            key={idNummer}
            className={styles.checkbox}
            onChange={() => handleSelectAsset(asset)}
            disabled={selectedAssets.length === MAX_ASSETS}
          >
            {label}
          </Checkbox>
        )
      })}
    </div>
  )
}
