'use client'

import { Button } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { AssetList } from './_components/AssetList/AssetList'
import { SideBar } from './_components/SideBar/SideBar'
import type { Coordinates } from 'apps/public/src/types'

import styles from './page.module.css'

const Map = dynamic(() => import('./_components/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

export const SelectLocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>()
  const [showAssetList, setShowAssetList] = useState(false)

  const t = useTranslations('select-location')

  useEffect(() => {
    const mediaQuery = window && window.matchMedia('((min-width: 68rem)')
    mediaQuery.addEventListener('change', hideMobileAssetListView)
  }, [])

  const hideMobileAssetListView = (e: MediaQueryListEvent) => {
    if (e.matches) {
      // Hide mobile asset list view when resizing to larger screens
      setShowAssetList(false)
    }
  }

  const handleAssetListToggle = () => {
    setShowAssetList((prevState) => !prevState)
  }

  return (
    <div className={styles.grid}>
      <SideBar coordinates={coordinates} setCoordinates={setCoordinates} />
      <div className={`${styles.assetList} ${showAssetList ? styles.showAssetList : ''}`}>
        <AssetList />
        <Button form="address" type="submit" className={styles.hideButtonMobile}>
          {t('submit-button.desktop')}
        </Button>
      </div>
      <div className={styles.map}>
        <Map coordinates={coordinates} setCoordinates={setCoordinates} showAssetList={showAssetList} />
        <Button form="address" type="submit" className={styles.submitbutton}>
          {t('submit-button.mobile')}
        </Button>
        <Button variant="secondary" onClick={handleAssetListToggle} className={styles.toggleButton}>
          {showAssetList ? t('toggle-button.map') : t('toggle-button.list')}
        </Button>
      </div>
    </div>
  )
}
