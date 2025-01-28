'use client'

import { Button, Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { AssetList } from './_components/AssetList/AssetList'
import { SideBar } from './_components/SideBar/SideBar'
import styles from './page.module.css'

export type Coordinates = { lat: number; lon: number }

const Map = dynamic(() => import('./_components/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const KiesLocatie = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>()
  const [showAssetList, setShowAssetList] = useState(false)

  const handleAssetListToggle = () => {
    setShowAssetList((prevState) => !prevState)
  }

  return (
    <Grid className={styles.page}>
      <Grid.Cell span={{ narrow: 4, medium: 5, wide: 4 }}>
        <SideBar coordinates={coordinates} />
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 4 }}
        start={{ narrow: 1, medium: 1, wide: 1 }}
        className={`${styles.assetList} ${showAssetList && styles.toggleAssetList}`}
      >
        <AssetList />
        <Button form="address" type="submit" className={styles.hideButtonMobile}>
          Bevestigen
        </Button>
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 8 }}
        start={{ narrow: 1, medium: 1, wide: 5 }}
        className={styles.map}
      >
        <Map setCoordinates={setCoordinates} showAssetList={showAssetList} />
        <div className={`${styles.submitButton} ${styles.hideButtonDesktop}`}>
          <Button form="address" type="submit">
            Bevestigen
          </Button>
        </div>
        <div className={`${styles.toggleButton} ${styles.hideButtonDesktop}`}>
          <Button variant="secondary" onClick={handleAssetListToggle}>
            {showAssetList ? 'Lijst' : 'Kaart'}
          </Button>
        </div>
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
