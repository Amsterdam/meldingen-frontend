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
    // TODO: Create a compact grid with padding 24px and the map that overflows it. https://designsystem.amsterdam/?path=/docs/brand-design-tokens-grid--docs
    <Grid className={styles.container}>
      <Grid.Cell span={{ narrow: 4, medium: 5, wide: 4 }}>
        <SideBar coordinates={coordinates} />
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 8, wide: 4 }}
        className={`${styles.cell} ${hideListView && styles.NotShowList}`}
      >
        <ListView />
      </Grid.Cell>
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 8 }} className={styles.cellMap}>
        <Map setCoordinates={setCoordinates} />
      </Grid.Cell>
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 4 }}>
        <Column className={styles.cellButton}>
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
