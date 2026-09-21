import type { Dispatch, SetStateAction } from 'react'

import { Checkbox } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import type { Feature } from '@meldingen/api-client'

import { Paragraph } from '@meldingen/ui'

import type { NotificationType, Props as SelectLocationProps } from '../../SelectLocation'
import type { Coordinates } from '~/types'

import { AssetIcon } from '../AssetIcon/AssetIcon'
import { Loading } from './Loading'
import { getAssetLabelText } from '~/app/(general)/_utils/getAssetLabelText'

import styles from './AssetList.module.css'

export type Props = {
  assetConfig: Pick<SelectLocationProps['assetConfig'], 'icon' | 'label' | 'maxCount' | 'names'>
  assetList: Feature[]
  isLoading: boolean
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
  isLoading,
  selectedAssets,
  setCoordinates,
  setNotificationType,
  setSelectedAssets,
}: Props) => {
  const t = useTranslations('select-location.asset-list')
  const pluralName = assetConfig.names.plural
  const noResults = assetList.length === 0 && selectedAssets.length === 0

  if (isLoading) return <Loading>{t('loading', { pluralName })}</Loading>
  if (noResults) return <Paragraph className={styles.emptyState}>{t('no-results', { pluralName })}</Paragraph>

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

    setSelectedAssets((prevSelectedAssets) => prevSelectedAssets.filter((a) => a.id !== asset.id))
  }

  const handleSelectAsset = (asset: Feature) => {
    if (selectedAssets.length >= assetConfig.maxCount) {
      setNotificationType('too-many-assets')
      return
    }

    // @ts-expect-error an asset always has coordinates
    const [y, x] = asset.geometry.coordinates
    setCoordinates({ lat: x, lng: y })

    setSelectedAssets((prevSelectedAssets) => [asset, ...prevSelectedAssets])
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
