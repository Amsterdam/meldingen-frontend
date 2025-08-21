'use client'
import { Button } from '@amsterdam/design-system-react'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import clsx from 'clsx'
import L from 'leaflet'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'

import { AssetList } from './_components/AssetList/AssetList'
import { SideBar } from './_components/SideBar/SideBar'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './SelectLocation.module.css'

const Map = dynamic(() => import('./_components/Map/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

type Props = {
  classification?: string
}

export const SelectLocation = ({ classification }: Props) => {
  const [coordinates, setCoordinates] = useState<Coordinates>()
  const [showAssetList, setShowAssetList] = useState(false)
  const [assetList, setAssetList] = useState<Feature[]>([])
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  const t = useTranslations('select-location')

  const isWideWindow = useIsAfterBreakpoint('wide')

  useEffect(() => {
    // Hide mobile asset list view when resizing to larger screens
    if (isWideWindow) {
      setShowAssetList(false)
    }
  }, [isWideWindow])

  const handleAssetListToggle = () => {
    setShowAssetList((prevState) => !prevState)

    // Force map to resize after toggling asset list visibility
    setTimeout(() => {
      mapInstance?.invalidateSize()
    }, 0)
  }

  return (
    <div className={styles.grid}>
      <SideBar coordinates={coordinates} setCoordinates={setCoordinates} />
      <div className={clsx(styles.assetList, showAssetList && styles.showAssetList)}>
        <AssetList assetList={assetList} />
        <Button form="address" type="submit" className={styles.hideButtonMobile}>
          {t('submit-button.desktop')}
        </Button>
      </div>
      <div className={styles.map}>
        <Map
          classification={classification}
          coordinates={coordinates}
          mapInstance={mapInstance}
          setAssetList={setAssetList}
          setCoordinates={setCoordinates}
          setMapInstance={setMapInstance}
          showAssetList={showAssetList}
        />
        <div className={styles.buttonWrapper}>
          <Button
            form="address"
            type="submit"
            className={clsx(styles.submitbutton, showAssetList && styles.removeAbsolutePosition)}
          >
            {t('submit-button.mobile')}
          </Button>
          {assetList.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleAssetListToggle}
              className={clsx(styles.toggleButton, showAssetList && styles.removeAbsolutePosition)}
            >
              {showAssetList ? t('toggle-button.map') : t('toggle-button.list')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
