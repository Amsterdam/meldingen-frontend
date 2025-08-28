import { Button } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import L from 'leaflet'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction } from 'react'

import { Feature } from '@meldingen/api-client'

import styles from '../../SelectLocation.module.css'

export type Props = {
  assetList: Feature[]
  mapInstance: L.Map | null
  setShowAssetList: Dispatch<SetStateAction<boolean>>
  showAssetList: boolean
}

export const AssetListToggle = ({ assetList, mapInstance, setShowAssetList, showAssetList }: Props) => {
  const t = useTranslations('select-location')

  if (assetList.length === 0) return null

  const toggleListView = () => {
    setShowAssetList((prevState) => !prevState)

    // Leaflet has to know it should recalculate dimensions of the map
    // when the asset list is shown/hidden as this changes the size of the map container
    setTimeout(() => {
      mapInstance?.invalidateSize()
    }, 0)
  }

  return (
    <Button
      variant="secondary"
      onClick={toggleListView}
      className={clsx(styles.toggleButton, showAssetList && styles.removeAbsolutePosition)}
    >
      {showAssetList ? t('toggle-button.map') : t('toggle-button.list')}
    </Button>
  )
}
