'use client'

import { Button, Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { AssetList } from './_components/AssetList/AssetList'
import { SideBar } from './_components/SideBar/SideBar'
import styles from './page.module.css'

export type Coordinates = { lat: number; lng: number }

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
        <SideBar coordinates={coordinates} setCoordinates={setCoordinates} />
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 4 }}
        start={{ narrow: 1, medium: 1, wide: 1 }}
        className={`${styles.assetList} ${showAssetList && styles.showAssetList}`}
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
        <Map coordinates={coordinates} setCoordinates={setCoordinates} showAssetList={showAssetList} />
        <Button form="address" type="submit" className={styles.submitbutton}>
          Bevestigen
        </Button>
        <Button variant="secondary" onClick={handleAssetListToggle} className={styles.toggleButton}>
          {showAssetList ? 'Kaart' : 'Lijst'}
        </Button>
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
