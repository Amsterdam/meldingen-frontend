import { Checkbox } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'

import { Feature, Point } from '@meldingen/api-client'

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

const isPoint = (geometry: Feature['geometry']): geometry is Point => geometry?.type === 'Point'

export const AssetList = ({ assetList, selectedAssets, setCoordinates, setSelectedAssets }: Props) => {
  if (assetList.length === 0 && selectedAssets.length === 0) return

  const filteredList = assetList.filter(
    (asset) => !selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id),
  )

  const updateSelectedAsset = (asset: Feature) => {
    if (selectedAssets.length > 1 && isPoint(selectedAssets[1].geometry)) {
      const previousSelectedAssetCoordinates = selectedAssets[1].geometry.coordinates
      const [y, x] = previousSelectedAssetCoordinates
      setCoordinates({ lat: x, lng: y })
    } else {
      setCoordinates()
    }

    setSelectedAssets((assetList) => {
      return assetList.filter((a) => a.id !== asset.id)
    })
  }

  const updateUnselectedAsset = (asset: Feature) => {
    if (isPoint(asset.geometry)) {
      const [y, x] = asset.geometry.coordinates
      setCoordinates({ lat: x, lng: y })
    }
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
          <Checkbox key={idNummer} onChange={() => updateSelectedAsset(asset)} checked className={styles.checkbox}>
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
            onChange={() => updateUnselectedAsset(asset)}
            disabled={selectedAssets.length === MAX_ASSETS}
          >
            {label}
          </Checkbox>
        )
      })}
    </div>
  )
}
