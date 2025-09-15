import { Checkbox } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction } from 'react'

import { Feature } from '@meldingen/api-client'

import { MAX_ASSETS } from '../../_utils/addAssetLayerToMap'
import { getContainerFeatureIconSVG } from '../../_utils/getContainerFeatureIconSVG'
import type { Coordinates, NotificationType } from 'apps/melding-form/src/types'

import styles from './AssetList.module.css'

export type Props = {
  assetList: Feature[]
  selectedAssets: Feature[]
  notification: NotificationType | null
  setCoordinates: (coordinates?: Coordinates) => void
  setNotification: (notification: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}
  
  const getCheckboxLabel = (asset: Feature, idNummer: string) => {
  const icon = getContainerFeatureIconSVG(asset)
  const altText = `${asset.properties?.fractie_omschrijving ?? ''} icon`.trim()

  return (
    <span className={styles.label}>
      <Image src={icon} alt={altText} width={32} height={32} />
      <span>{idNummer}</span>
    </span>
  )
}


export const AssetList = ({
  assetList,
  notification,
  selectedAssets,
  setNotification,
  setCoordinates,
  setSelectedAssets,
}: Props) => {
  const t = useTranslations('select-location.asset-list')
  
  if (assetList.length === 0 && selectedAssets.length === 0) return

  const filteredList = assetList.filter(
    (asset) => !selectedAssets.some((selectedAsset) => selectedAsset.id === asset.id),
  )

  const handleDeselectAsset = (asset: Feature) => {
    if (notification) {
      setNotification(null)
    }

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
      setNotification({
        closeButtonLabel: t('max-asset-notification.close-button'),
        heading: t('max-asset-notification.title', { maxAssets: MAX_ASSETS }),
      })
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
            <Checkbox onChange={() => handleDeselectAsset(asset)} checked className={styles.checkbox}>
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
            <Checkbox className={styles.checkbox} onChange={() => handleSelectAsset(asset)} checked={false}>
              {label}
            </Checkbox>
          </li>
        )
      })}
    </ul>
  )
}
