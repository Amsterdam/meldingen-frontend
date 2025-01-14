'use client'

import { Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { SideBar } from './_components/SideBar/SideBar'

export type Coordinates = { lat: number; lon: number }

const Map = dynamic(() => import('./_components/BaseLayer').then((module) => module.BaseLayer), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const KiesLocatie = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)

  return (
    // TODO: Create a compact grid with padding 24px and the map that overflows it. https://designsystem.amsterdam/?path=/docs/brand-design-tokens-grid--docs
    <Grid>
      <Grid.Cell span={4}>
        <SideBar coordinates={coordinates} />
      </Grid.Cell>
      <Grid.Cell span={8}>
        <Map setCoordinates={setCoordinates} />
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
