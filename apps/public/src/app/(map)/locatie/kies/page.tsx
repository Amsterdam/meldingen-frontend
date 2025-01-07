'use client'

import { Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { AddressMenu } from './_components/AddressMenu/AddressMenu'

type Location = { lat: number; lon: number }

const Map = dynamic(() => import('./_components/BaseLayer').then((module) => module.BaseLayer), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const reverseGeocodeService = async ({ lat, lon }: Location) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lon}&rows=1`)
    .then((res) => res.json())
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error:', error))

const KiesLocatie = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    const getAddress = async () => {
      if (!location) return
      const result = await reverseGeocodeService({ lat: location.lat, lon: location.lon })

      setAddress(result.response.docs[0].weergavenaam)
    }
    getAddress()
  }, [location])

  return (
    // TODO: Create a compact grid with padding 24px and the map that overflows it. https://designsystem.amsterdam/?path=/docs/brand-design-tokens-grid--docs
    <Grid>
      <Grid.Cell span={4}>
        <AddressMenu address={address} />
      </Grid.Cell>
      <Grid.Cell span={8}>
        <Map setLocation={setLocation} />
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
