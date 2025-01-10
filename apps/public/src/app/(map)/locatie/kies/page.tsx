'use client'

import { Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { SideBar } from './_components/SideBar/SideBar'
import { reverseGeocodeService } from './utils.ts/reverse-geocode-service'

export type Coordinates = { lat: number; lon: number }

const Map = dynamic(() => import('./_components/BaseLayer').then((module) => module.BaseLayer), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const KiesLocatie = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    const getAddress = async () => {
      if (!coordinates) return
      const result = await reverseGeocodeService({ lat: coordinates.lat, lon: coordinates.lon })

      setAddress(result.response.docs[0].weergavenaam)
    }
    getAddress()
  }, [coordinates])

  return (
    // TODO: Create a compact grid with padding 24px and the map that overflows it. https://designsystem.amsterdam/?path=/docs/brand-design-tokens-grid--docs
    <Grid>
      <Grid.Cell span={4}>
        <SideBar address={address} />
      </Grid.Cell>
      <Grid.Cell span={8}>
        <Map setCoordinates={setCoordinates} />
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
