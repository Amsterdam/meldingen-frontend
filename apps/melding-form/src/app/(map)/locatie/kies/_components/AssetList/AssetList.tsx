import type { Dispatch, SetStateAction } from 'react'

import { Checkbox } from '@amsterdam/design-system-react'

import type { Feature } from '@meldingen/api-client'

import type { NotificationType, Props as SelectLocationProps } from '../../SelectLocation'
import type { Coordinates } from '~/types'

import { AssetIcon } from '~/app/_components/AssetIcon/AssetIcon'
import { getAssetLabelText } from '~/app/(general)/_utils/getAssetLabelText'

import styles from './AssetList.module.css'

export type Props = {
  assetConfig: Pick<SelectLocationProps['assetConfig'], 'icon' | 'label' | 'maxCount'>
  assetList: Feature[]
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setNotificationType: (notificationType: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

type AssetListItemProps = {
  asset: Feature
  assetConfig: Pick<SelectLocationProps['assetConfig'], 'icon' | 'label'>
  isChecked?: boolean
  onChange: () => void
}

const AssetListItem = ({ asset, assetConfig, isChecked = false, onChange }: AssetListItemProps) => (
  <li>
    <Checkbox checked={isChecked} className={styles.checkbox} onChange={onChange}>
      <span className={styles.label}>
        <AssetIcon alt="" height={32} iconConfig={assetConfig.icon} properties={asset.properties} width={32} />
        {getAssetLabelText(asset, assetConfig.label)}
      </span>
    </Checkbox>
  </li>
)

export const AssetList = ({
  assetConfig,
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
    if (selectedAssets.length >= assetConfig.maxCount) {
      setNotificationType('too-many-assets')
      return
    }

    // @ts-expect-error an asset always has coordinates
    const [y, x] = asset.geometry.coordinates
    setCoordinates({ lat: x, lng: y })

    setSelectedAssets((assetList) => [asset, ...assetList])
  }

  return (
    <ul className={styles.container}>
      {selectedAssets.map((asset) => (
        <AssetListItem
          asset={asset}
          assetConfig={assetConfig}
          isChecked
          key={asset.id}
          onChange={() => handleDeselectAsset(asset)}
        />
      ))}
      {filteredList.map((asset) => (
        <AssetListItem
          asset={asset}
          assetConfig={assetConfig}
          key={asset.id}
          onChange={() => handleSelectAsset(asset)}
        />
      ))}
    </ul>
  )
}
