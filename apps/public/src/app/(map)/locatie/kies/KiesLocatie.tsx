'use client'

import { Button } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import type { Coordinates } from 'apps/public/src/types'

import { AssetList } from './_components/AssetList/AssetList'
import { SideBar } from './_components/SideBar/SideBar'
import styles from './page.module.css'

const Map = dynamic(() => import('./_components/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

export const KiesLocatie = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>()
  const [showAssetList, setShowAssetList] = useState(false)

  const handleAssetListToggle = () => {
    setShowAssetList((prevState) => !prevState)
  }

  return (
    <div className={styles.grid}>
      <SideBar coordinates={coordinates} setCoordinates={setCoordinates} />
      <div className={`${styles.assetList} ${showAssetList && styles.showAssetList}`}>
        <AssetList />
        <Button form="address" type="submit" className={styles.hideButtonMobile}>
          Bevestigen
        </Button>
      </div>
      <div className={styles.map}>
        <Map coordinates={coordinates} setCoordinates={setCoordinates} showAssetList={showAssetList} />
        <Button form="address" type="submit" className={styles.submitbutton}>
          Bevestigen
        </Button>
        <Button variant="secondary" onClick={handleAssetListToggle} className={styles.toggleButton}>
          {showAssetList ? 'Kaart' : 'Lijst'}
        </Button>
      </div>
    </div>
  )
}
