'use client'

import { Button, Column, Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { ListView } from './_components/ListView/ListView'
import { SideBar } from './_components/SideBar/SideBar'
import styles from './page.module.css'

export type Coordinates = { lat: number; lon: number }

const Map = dynamic(() => import('./_components/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const KiesLocatie = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>()
  const [hideListView, setHideListView] = useState(true)

  const handleToggle = () => {
    setHideListView((prevState) => !prevState)
  }

  return (
    <Grid className={styles.page}>
      <Grid.Cell span={{ narrow: 4, medium: 5, wide: 4 }}>
        <SideBar coordinates={coordinates} />
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 4 }}
        start={{ narrow: 1, medium: 1, wide: 1 }}
        className={`${styles.listView} ${hideListView && styles.hideListView}`}
      >
        <ListView />
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 8 }}
        start={{ narrow: 1, medium: 1, wide: 5 }}
        className={styles.mapView}
      >
        <Map setCoordinates={setCoordinates} hideListView={hideListView} />
      </Grid.Cell>
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 4 }}>
        <Column className={styles.buttonColumn}>
          <Button id="address" type="submit">
            Bevestigen
          </Button>
          <Button variant="secondary" className={styles.toggle} onClick={handleToggle}>
            {hideListView ? 'Lijst' : 'Kaart'}
          </Button>
        </Column>
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
