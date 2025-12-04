import { Checkbox } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'

import { Feature } from '@meldingen/api-client'

import type { Coordinates } from 'apps/melding-form/src/types'

import { MAX_ASSETS } from '../../SelectLocation'
import { NotificationType } from '../../SelectLocation'
import { getContainerAssetIconSVG } from './getContainerAssetIconSVG'

import styles from './AssetList.module.css'

export type Props = {
  assetList: Feature[]
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setNotificationType: (notificationType: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

const getCheckboxLabel = (asset: Feature, idNummer: string) => {
  const icon = getContainerAssetIconSVG(asset)
  const altText = `${asset.properties?.fractie_omschrijving ?? ''} icon`.trim()

  return (
    <span className={styles.label}>
      <Image alt={altText} height={32} src={icon} width={32} />
      <span>{idNummer}</span>
    </span>
  )
}

export const AssetList = ({
  assetList,
  selectedAssets,
  setCoordinates,
  setNotificationType,
  setSelectedAssets,
}: Props) => {
  if (assetList.length === 0 && selectedAssets.length === 0) return

  const filteredList = assetList.filter(
    (asset) => !selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id),
  )

  const handleDeselectAsset = (asset: Feature) => {
    setNotificationType(null)

    if (selectedAssets.length <= 1) {
      setCoordinates(undefined)
    } else if (asset.id === selectedAssets[0].id) {
      // Set the address of the second asset on the list
      // when the last selected asset (#1 on the list) is deselected
      // @ts-expect-error an asset always has coordinates
      const [y, x] = selectedAssets[1].geometry.coordinates
      setCoordinates({ lat: x, lng: y })
    }

    setSelectedAssets((assetList) => assetList.filter((a) => a.id !== asset.id))
  }

  const handleSelectAsset = (asset: Feature) => {
    if (selectedAssets.length >= MAX_ASSETS) {
      setNotificationType('too-many-assets')
      return
    }

    // @ts-expect-error an asset always has coordinates
    const [y, x] = asset.geometry.coordinates
    setCoordinates({ lat: x, lng: y })

    setSelectedAssets((assetList) => [asset, ...assetList])
  }

  return (
    <ul className={clsx(styles.container, 'ams-mb-m')}>
      {selectedAssets.map((asset) => {
        // @ts-expect-error id_nummer always exists on asset properties
        const publicId = asset.properties.id_nummer as string
        const label = getCheckboxLabel(asset, publicId)

        return (
          <li key={publicId}>
            <Checkbox checked className={styles.checkbox} onChange={() => handleDeselectAsset(asset)}>
              {label}
            </Checkbox>
          </li>
        )
      })}
      {filteredList.map((asset) => {
        // @ts-expect-error id_nummer always exists on asset properties
        const publicId = asset.properties.id_nummer as string
        const label = getCheckboxLabel(asset, publicId)

        return (
          <li key={publicId}>
            <Checkbox checked={false} className={styles.checkbox} onChange={() => handleSelectAsset(asset)}>
              {label}
            </Checkbox>
          </li>
        )
      })}
    </ul>
  )
}
