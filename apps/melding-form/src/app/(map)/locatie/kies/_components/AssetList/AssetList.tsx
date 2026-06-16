import type { Dispatch, SetStateAction } from 'react'

import { Checkbox } from '@amsterdam/design-system-react'

import type { Feature } from '@meldingen/api-client'

import type { NotificationType } from '../../SelectLocation'
import type { AssetTypeIconConfig, Coordinates } from '~/types'

import { AssetIcon } from '~/app/_components/AssetIcon/AssetIcon'

import styles from './AssetList.module.css'

export type Props = {
  assetList: Feature[]
  assetTypeIconConfig: AssetTypeIconConfig
  labelConfig?: string
  maxAssets: number
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setNotificationType: (notificationType: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

const getLabelText = (asset: Feature, labelConfig?: string) => {
  // `id` always exists on WFS layers from the City of Amsterdam
  if (!labelConfig) return asset.id

  const label = labelConfig
    // Replace each {{field_name}} placeholder with the matching value from asset.properties
    // For example, '{{fractie_omschrijving}} container - {{id_nummer}}' will become 'Papier container - 12345'
    .replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = asset.properties?.[key]
      return value !== undefined && value !== null ? String(value) : ''
    })
    .trim()

  return label || asset.id
}

type AssetListItemProps = {
  asset: Feature
  assetTypeIconConfig: AssetTypeIconConfig
  isChecked?: boolean
  labelConfig?: string
  onChange: () => void
}

const AssetListItem = ({
  asset,
  assetTypeIconConfig,
  isChecked = false,
  labelConfig,
  onChange,
}: AssetListItemProps) => (
  <li>
    <Checkbox checked={isChecked} className={styles.checkbox} onChange={onChange}>
      <span className={styles.label}>
        <AssetIcon
          alt=""
          assetTypeIconConfig={assetTypeIconConfig}
          height={32}
          properties={asset.properties}
          width={32}
        />
        {getLabelText(asset, labelConfig)}
      </span>
    </Checkbox>
  </li>
)

export const AssetList = ({
  assetList,
  assetTypeIconConfig,
  labelConfig,
  maxAssets,
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
    if (selectedAssets.length >= maxAssets) {
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
          assetTypeIconConfig={assetTypeIconConfig}
          isChecked
          key={asset.id}
          labelConfig={labelConfig}
          onChange={() => handleDeselectAsset(asset)}
        />
      ))}
      {filteredList.map((asset) => (
        <AssetListItem
          asset={asset}
          assetTypeIconConfig={assetTypeIconConfig}
          key={asset.id}
          labelConfig={labelConfig}
          onChange={() => handleSelectAsset(asset)}
        />
      ))}
    </ul>
  )
}
