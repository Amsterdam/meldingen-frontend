'use client'

import { Grid } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { SideMenu } from './_components/SideMenu'

const Map = dynamic(() => import('./_components/BaseLayer').then((module) => module.BaseLayer), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const reverseGeocodeService = async ({ lat, lon }: { lat: number; lon: number }) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lon}&rows=1`)
    .then((res) => res.json())
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error:', error))

const KiesLocatie = () => {
  const [location, setLocation] = useState({ lat: 0, lon: 0 })
  const [address, setAddress] = useState()

  useEffect(() => {
    const getAddress = async () => {
      const result = await reverseGeocodeService({ lat: location.lat, lon: location.lon })

      setAddress(result.response.docs[0].weergavenaam)
    }
    getAddress()
  }, [location])

  return (
    <Grid paddingVertical="small">
      <Grid.Cell span={4}>
        <SideMenu address={address} />
      </Grid.Cell>
      <Grid.Cell span={8}>
        <Map setLocation={setLocation} />
      </Grid.Cell>
    </Grid>
  )
}

export default KiesLocatie
