'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./_components/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

const KiesLocatie = () => <Map />

export default KiesLocatie
